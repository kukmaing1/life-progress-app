import type { Locale } from "./locale";

/**
 * The English source strings — every other locale's dictionary is typed
 * against this one's keys, so a translation that's missing a key (or has a
 * stray extra one) is a compile error, not a silent blank label at runtime.
 *
 * Keys are grouped by the screen/component they belong to. "Life Progress"
 * itself is never a translation key — it's the app's name, kept as a fixed
 * string wherever it appears (see AppIntro.tsx, settings/page.tsx), the same
 * way a real product wouldn't translate its own brand name.
 */
const en = {
  "nav.today": "Today",
  "nav.goals": "Goals",
  "nav.progress": "Progress",
  "nav.profile": "Profile",
  "nav.comingSoon": "{feature} — coming soon",

  "common.loading": "Loading...",
  "common.signInRequired": "Sign-in required.",

  "today.title": "Today",
  "today.completedOf": "{completed} / {planned} completed",
  "today.loadingTasks": "Loading tasks...",
  "today.empty": "Nothing yet — add your first task.",
  "today.scheduled": "Scheduled",
  "today.anytime": "Anytime",
  "today.completedSection": "Completed",
  "today.plannedFor": "Planned for {date}",
  "today.addTaskAria": "Add task",

  "errors.completeTaskFailed": "Couldn't complete the task. Try again.",
  "errors.saveTaskFailed": "Couldn't save the task. Try again.",
  "errors.generic": "Something went wrong. Try again.",
  "errors.signInFailed": "Couldn't sign you in. Close and reopen the app to try again.",
  "errors.openInTelegram": "Open this app from inside Telegram.",

  "addTask.heading": "New task",
  "addTask.closeAria": "Close",
  "addTask.titlePlaceholder": "Task title",
  "addTask.today": "Today",
  "addTask.tomorrow": "Tomorrow",
  "addTask.dateAria": "Task date",
  "addTask.saving": "Saving...",
  "addTask.addButton": "Add task",
  "addTask.planButton": "Plan task",

  "editTask.heading": "Edit task",
  "editTask.closeAria": "Close",
  "editTask.saveChanges": "Save changes",
  "editTask.postpone": "Postpone to tomorrow",
  "editTask.confirmDelete": "Confirm delete",
  "editTask.delete": "Delete task",

  "taskRow.completedAria": "Completed",
  "taskRow.markCompleteAria": "Mark complete",

  "progress.title": "Progress",
  "progress.prevMonthAria": "Previous month",
  "progress.nextMonthAria": "Next month",
  "progress.nothingPlanned": "Nothing planned that day.",

  "profile.title": "Profile",
  "profile.settingsAria": "Settings",
  "profile.dayStreak": "Day streak",
  "profile.completed": "Completed",
  "profile.thisWeek": "This week",

  "settings.title": "Settings",
  "settings.backAria": "Back to profile",
  "settings.notifications": "Notifications",
  "settings.notificationsSub": "Basic task reminders",
  "settings.notificationsAria": "Toggle notifications",
  "settings.appearance": "Appearance",
  "settings.appearanceSub": "Dark or light theme",
  "settings.darkAria": "Dark theme",
  "settings.lightAria": "Light theme",
  "settings.language": "Language",
  "settings.languageSub": "App display language",
  "settings.timezone": "Timezone",
  "settings.account": "Telegram account",

  "onboarding.getStarted": "Get started",

  "appIntro.headline": "Build a better version of yourself.",
  "appIntro.subtext": "Small actions. Real progress.",
} as const;

export type TranslationKey = keyof typeof en;

// Informal register throughout (ты / ти / tú) to match the app's casual,
// personal-habit-tracker tone — not the formal/polite form a bank or
// government form would use.
const ru: Record<TranslationKey, string> = {
  "nav.today": "Сегодня",
  "nav.goals": "Цели",
  "nav.progress": "Прогресс",
  "nav.profile": "Профиль",
  "nav.comingSoon": "{feature} — скоро",

  "common.loading": "Загрузка...",
  "common.signInRequired": "Нужно войти.",

  "today.title": "Сегодня",
  "today.completedOf": "{completed} / {planned} выполнено",
  "today.loadingTasks": "Загружаем задачи...",
  "today.empty": "Пока пусто — добавь первую задачу.",
  "today.scheduled": "По времени",
  "today.anytime": "В течение дня",
  "today.completedSection": "Выполнено",
  "today.plannedFor": "Запланировано на {date}",
  "today.addTaskAria": "Добавить задачу",

  "errors.completeTaskFailed": "Не удалось отметить задачу. Попробуй ещё раз.",
  "errors.saveTaskFailed": "Не удалось сохранить задачу. Попробуй ещё раз.",
  "errors.generic": "Что-то пошло не так. Попробуй ещё раз.",
  "errors.signInFailed": "Не удалось войти. Закрой и снова открой приложение.",
  "errors.openInTelegram": "Открой это приложение внутри Telegram.",

  "addTask.heading": "Новая задача",
  "addTask.closeAria": "Закрыть",
  "addTask.titlePlaceholder": "Название задачи",
  "addTask.today": "Сегодня",
  "addTask.tomorrow": "Завтра",
  "addTask.dateAria": "Дата задачи",
  "addTask.saving": "Сохраняем...",
  "addTask.addButton": "Добавить задачу",
  "addTask.planButton": "Запланировать",

  "editTask.heading": "Изменить задачу",
  "editTask.closeAria": "Закрыть",
  "editTask.saveChanges": "Сохранить изменения",
  "editTask.postpone": "Перенести на завтра",
  "editTask.confirmDelete": "Подтвердить удаление",
  "editTask.delete": "Удалить задачу",

  "taskRow.completedAria": "Выполнено",
  "taskRow.markCompleteAria": "Отметить выполненной",

  "progress.title": "Прогресс",
  "progress.prevMonthAria": "Предыдущий месяц",
  "progress.nextMonthAria": "Следующий месяц",
  "progress.nothingPlanned": "В этот день ничего не запланировано.",

  "profile.title": "Профиль",
  "profile.settingsAria": "Настройки",
  "profile.dayStreak": "Дней подряд",
  "profile.completed": "Выполнено",
  "profile.thisWeek": "Эта неделя",

  "settings.title": "Настройки",
  "settings.backAria": "Назад в профиль",
  "settings.notifications": "Уведомления",
  "settings.notificationsSub": "Базовые напоминания о задачах",
  "settings.notificationsAria": "Переключить уведомления",
  "settings.appearance": "Оформление",
  "settings.appearanceSub": "Тёмная или светлая тема",
  "settings.darkAria": "Тёмная тема",
  "settings.lightAria": "Светлая тема",
  "settings.language": "Язык",
  "settings.languageSub": "Язык интерфейса приложения",
  "settings.timezone": "Часовой пояс",
  "settings.account": "Аккаунт Telegram",

  "onboarding.getStarted": "Начать",

  "appIntro.headline": "Стань лучшей версией себя.",
  "appIntro.subtext": "Маленькие шаги. Настоящий прогресс.",
};

const uk: Record<TranslationKey, string> = {
  "nav.today": "Сьогодні",
  "nav.goals": "Цілі",
  "nav.progress": "Прогрес",
  "nav.profile": "Профіль",
  "nav.comingSoon": "{feature} — незабаром",

  "common.loading": "Завантаження...",
  "common.signInRequired": "Потрібно увійти.",

  "today.title": "Сьогодні",
  "today.completedOf": "{completed} / {planned} виконано",
  "today.loadingTasks": "Завантажуємо задачі...",
  "today.empty": "Поки що порожньо — додай першу задачу.",
  "today.scheduled": "За часом",
  "today.anytime": "Протягом дня",
  "today.completedSection": "Виконано",
  "today.plannedFor": "Заплановано на {date}",
  "today.addTaskAria": "Додати задачу",

  "errors.completeTaskFailed": "Не вдалося позначити задачу. Спробуй ще раз.",
  "errors.saveTaskFailed": "Не вдалося зберегти задачу. Спробуй ще раз.",
  "errors.generic": "Щось пішло не так. Спробуй ще раз.",
  "errors.signInFailed": "Не вдалося увійти. Закрий і знову відкрий застосунок.",
  "errors.openInTelegram": "Відкрий цей застосунок всередині Telegram.",

  "addTask.heading": "Нова задача",
  "addTask.closeAria": "Закрити",
  "addTask.titlePlaceholder": "Назва задачі",
  "addTask.today": "Сьогодні",
  "addTask.tomorrow": "Завтра",
  "addTask.dateAria": "Дата задачі",
  "addTask.saving": "Зберігаємо...",
  "addTask.addButton": "Додати задачу",
  "addTask.planButton": "Запланувати",

  "editTask.heading": "Редагувати задачу",
  "editTask.closeAria": "Закрити",
  "editTask.saveChanges": "Зберегти зміни",
  "editTask.postpone": "Перенести на завтра",
  "editTask.confirmDelete": "Підтвердити видалення",
  "editTask.delete": "Видалити задачу",

  "taskRow.completedAria": "Виконано",
  "taskRow.markCompleteAria": "Позначити виконаною",

  "progress.title": "Прогрес",
  "progress.prevMonthAria": "Попередній місяць",
  "progress.nextMonthAria": "Наступний місяць",
  "progress.nothingPlanned": "На цей день нічого не заплановано.",

  "profile.title": "Профіль",
  "profile.settingsAria": "Налаштування",
  "profile.dayStreak": "Днів поспіль",
  "profile.completed": "Виконано",
  "profile.thisWeek": "Цей тиждень",

  "settings.title": "Налаштування",
  "settings.backAria": "Назад до профілю",
  "settings.notifications": "Сповіщення",
  "settings.notificationsSub": "Базові нагадування про задачі",
  "settings.notificationsAria": "Перемкнути сповіщення",
  "settings.appearance": "Вигляд",
  "settings.appearanceSub": "Темна або світла тема",
  "settings.darkAria": "Темна тема",
  "settings.lightAria": "Світла тема",
  "settings.language": "Мова",
  "settings.languageSub": "Мова інтерфейсу застосунку",
  "settings.timezone": "Часовий пояс",
  "settings.account": "Обліковий запис Telegram",

  "onboarding.getStarted": "Почати",

  "appIntro.headline": "Стань кращою версією себе.",
  "appIntro.subtext": "Маленькі кроки. Справжній прогрес.",
};

const es: Record<TranslationKey, string> = {
  "nav.today": "Hoy",
  "nav.goals": "Metas",
  "nav.progress": "Progreso",
  "nav.profile": "Perfil",
  "nav.comingSoon": "{feature}: próximamente",

  "common.loading": "Cargando...",
  "common.signInRequired": "Inicia sesión para continuar.",

  "today.title": "Hoy",
  "today.completedOf": "{completed} / {planned} completadas",
  "today.loadingTasks": "Cargando tareas...",
  "today.empty": "Nada por aquí todavía — añade tu primera tarea.",
  "today.scheduled": "Con hora",
  "today.anytime": "En cualquier momento",
  "today.completedSection": "Completadas",
  "today.plannedFor": "Planeada para el {date}",
  "today.addTaskAria": "Añadir tarea",

  "errors.completeTaskFailed": "No se pudo completar la tarea. Inténtalo de nuevo.",
  "errors.saveTaskFailed": "No se pudo guardar la tarea. Inténtalo de nuevo.",
  "errors.generic": "Algo salió mal. Inténtalo de nuevo.",
  "errors.signInFailed": "No se pudo iniciar sesión. Cierra y vuelve a abrir la app.",
  "errors.openInTelegram": "Abre esta app desde dentro de Telegram.",

  "addTask.heading": "Nueva tarea",
  "addTask.closeAria": "Cerrar",
  "addTask.titlePlaceholder": "Título de la tarea",
  "addTask.today": "Hoy",
  "addTask.tomorrow": "Mañana",
  "addTask.dateAria": "Fecha de la tarea",
  "addTask.saving": "Guardando...",
  "addTask.addButton": "Añadir tarea",
  "addTask.planButton": "Planear tarea",

  "editTask.heading": "Editar tarea",
  "editTask.closeAria": "Cerrar",
  "editTask.saveChanges": "Guardar cambios",
  "editTask.postpone": "Posponer para mañana",
  "editTask.confirmDelete": "Confirmar eliminación",
  "editTask.delete": "Eliminar tarea",

  "taskRow.completedAria": "Completada",
  "taskRow.markCompleteAria": "Marcar como completada",

  "progress.title": "Progreso",
  "progress.prevMonthAria": "Mes anterior",
  "progress.nextMonthAria": "Mes siguiente",
  "progress.nothingPlanned": "No hay nada planeado ese día.",

  "profile.title": "Perfil",
  "profile.settingsAria": "Ajustes",
  "profile.dayStreak": "Racha de días",
  "profile.completed": "Completadas",
  "profile.thisWeek": "Esta semana",

  "settings.title": "Ajustes",
  "settings.backAria": "Volver al perfil",
  "settings.notifications": "Notificaciones",
  "settings.notificationsSub": "Recordatorios básicos de tareas",
  "settings.notificationsAria": "Activar o desactivar notificaciones",
  "settings.appearance": "Apariencia",
  "settings.appearanceSub": "Tema oscuro o claro",
  "settings.darkAria": "Tema oscuro",
  "settings.lightAria": "Tema claro",
  "settings.language": "Idioma",
  "settings.languageSub": "Idioma de la aplicación",
  "settings.timezone": "Zona horaria",
  "settings.account": "Cuenta de Telegram",

  "onboarding.getStarted": "Empezar",

  "appIntro.headline": "Conviértete en tu mejor versión.",
  "appIntro.subtext": "Pequeñas acciones. Progreso real.",
};

const dictionaries: Record<Locale, Record<TranslationKey, string>> = { en, ru, uk, es };

/**
 * Looks up `key` in `locale`'s dictionary and interpolates `{varName}`
 * placeholders from `vars` (a plain string replace — these are short UI
 * strings with at most one or two placeholders, not a templating engine).
 * Falls back to the English string if a locale is somehow missing a key, so
 * a gap in translation never renders literally as "today.title" on screen.
 */
export function translate(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  const template = dictionaries[locale]?.[key] ?? dictionaries.en[key];
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (result, [name, value]) => result.split(`{${name}}`).join(String(value)),
    template
  );
}
