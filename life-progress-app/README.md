# Life Progress — V1

A Telegram Mini App: open the app, see Today, add a task, complete it, see your
daily progress, come back tomorrow. Nothing more — see the spec this was built
from for the full list of what's deliberately left out of V1.

This is a single **Next.js** app (frontend + API routes together). It replaces
the earlier two-service setup (a static page on Vercel + a separate Express
API on Railway) that was used earlier just to learn the deploy flow — this app
needs **only Vercel + Supabase**. Railway isn't used by this project.

## 1. Project structure

```
src/
  app/
    page.tsx              redirects to /onboarding or /today
    onboarding/page.tsx    first-launch welcome screen
    today/page.tsx         main screen: task list + daily progress
    settings/page.tsx      notifications, timezone, account, app version
    api/                   all backend routes (see below)
    layout.tsx, globals.css
  components/               UI building blocks (BottomNav, TaskRow, sheets, ...)
  lib/                      auth, session, db, date/timezone, pure business logic
supabase/schema.sql        run this once to create the database tables
tests/                     Vitest unit tests for the logic that must be correct
```

API routes (all under `src/app/api`), matching the spec:

```
POST   /api/auth/telegram          validate Telegram initData, create session
GET    /api/me                     current user
PATCH  /api/me                     update timezone / notifications_enabled
GET    /api/tasks?date=YYYY-MM-DD  list tasks for a day (defaults to "today")
POST   /api/tasks                  create a task
PATCH  /api/tasks/:id              edit title/date/time
DELETE /api/tasks/:id              delete a task
POST   /api/tasks/:id/complete     mark complete
POST   /api/tasks/:id/postpone     move to another date (defaults to tomorrow)
GET    /api/progress/daily         completed/planned for a day
POST   /api/events                 client-side analytics events
GET    /api/cron/reminders         sends "task in 30 min" reminders — see section 7
```

## 2. Install dependencies

Requires Node.js 18+.

```
npm install
```

## 3. Environment variables

Copy `.env.example` to `.env.local` and fill it in:

```
TELEGRAM_BOT_TOKEN=   # from @BotFather — server-side only, never sent to the browser
DATABASE_URL=         # Supabase Postgres connection string, see section 4
NEXT_PUBLIC_APP_URL=  # your deployed URL, e.g. https://your-app.vercel.app
SESSION_SECRET=       # random string, e.g. `openssl rand -hex 32`
CRON_SECRET=          # optional, protects /api/cron/reminders — see section 7
```

Never commit `.env.local` (it's already in `.gitignore`). In Vercel, set the
same variables under Project Settings → Environment Variables instead.

## 4. Database setup (Supabase)

1. In your Supabase project, open **SQL Editor → New query**.
2. Paste the contents of `supabase/schema.sql` and run it. This creates the
   `users`, `tasks`, and `events` tables.
3. Get your connection string: **Project Settings → Database → Connection
   string → URI**. Use the **Transaction pooler** version (port 6543) — it's
   the one that works correctly from a serverless environment like Vercel.
   Put it in `DATABASE_URL`.

## 5. Local development

```
npm run dev
```

Opens on `http://localhost:3000`. Note: Telegram Mini Apps only fully work
when opened from inside Telegram (that's where `window.Telegram.WebApp` and
`initData` come from) — opening the URL directly in a normal browser will show
"Open this app from inside Telegram" instead of the app. To test locally
end-to-end, either deploy and open the deployed URL from your bot, or use a
tunnel (e.g. `ngrok http 3000`) and point your bot's Mini App URL at the
tunnel's HTTPS address temporarily.

## 6. Production build

```
npm run build
npm start
```

For actual deployment, push this project to a GitHub repository and import it
into Vercel (Framework Preset: **Next.js**, this time — not "Other"). Add the
environment variables from section 3 in the Vercel project settings, then
deploy.

## 7. Telegram Mini App setup

1. In **@BotFather**: `/mybots` → select your bot → **Bot Settings → Menu
   Button** (or **Configure Mini App** depending on the BotFather version) →
   set the URL to your deployed `NEXT_PUBLIC_APP_URL`.
2. Make sure `TELEGRAM_BOT_TOKEN` in your deployment matches this exact bot.
3. **Notifications caveat:** `/api/cron/reminders` has to be called
   periodically for reminders to actually go out — it does nothing by itself.
   Vercel's free (Hobby) plan only runs scheduled Cron Jobs **once a day**,
   which isn't enough for "in 30 minutes" reminders. Options:
   - Use an external scheduler (e.g. cron-job.org, a free tier is enough) to
     hit `https://<your-app>/api/cron/reminders` every 5 minutes, sending
     `Authorization: Bearer <CRON_SECRET>` if you set one.
   - Or upgrade the Vercel plan, which allows more frequent Cron Jobs, and
     add a `vercel.json` cron entry pointing at that route.
   The rest of the app (Today, tasks, progress, settings) works fully without
   this — it only affects reminder delivery.

## 8. How to run tests

```
npm test
```

Covers: Telegram `initData` signature validation (valid, tampered, wrong bot
token, missing hash, stale `auth_date`, missing user), timezone/date
resolution (a day boundary differs by timezone, not server time), task
ordering, and daily progress counting. These are unit tests over pure logic
and don't require a live database. Testing the API routes end-to-end would
additionally need a real (or test) Postgres database wired up — not included
here to keep V1 simple, per the spec's "don't overengineer" instruction.

## Security notes

- Telegram `initData` is verified server-side via HMAC-SHA256 (`lib/telegramAuth.ts`)
  before any user is trusted — the frontend's claimed identity is never used directly.
- After verification, an httpOnly signed session cookie (`lib/session.ts`) is
  what authenticates subsequent requests — the client never sends a `user_id`
  that the server then trusts blindly.
- Every task route re-checks `user_id = <session user>` before reading or
  writing a row, so one user can never reach another user's tasks by id.
- `TELEGRAM_BOT_TOKEN`, `DATABASE_URL`, and `SESSION_SECRET` only ever exist
  as server-side environment variables — they are never sent to the browser.
