export const en = {
  // App
  appName: 'Habitual',
  tagline: 'A quiet place to build better habits.',

  // Navigation
  back: 'Back',
  habits: 'Habits',
  calendar: 'Calendar',
  stats: 'Stats',
  settings: 'Settings',

  // HabitsPage
  noHabitsYet: 'Your notebook is empty',
  noHabitsHint: 'Tap the + button below to add your first habit',
  noHabitsInCategory: 'No habits in this category',
  noHabitsInCategoryHint: 'Add one with the + button',
  allCategories: 'All',

  // AddHabit / EditHabit drawer
  newHabit: 'New habit',
  editHabit: 'Edit habit',
  save: 'Save',
  create: 'Create',
  cancel: 'Cancel',
  confirm: 'Confirm',
  keep: 'Keep',
  delete: 'Delete',
  edit: 'Edit',
  deleteHabit: 'Delete habit',
  deleteHabitConfirm: 'Are you sure?',
  deleteHabitWarning: 'and all its history will be moved to trash.',
  deleteHabitDetail: 'This includes all check-ins and notes.',
  deleteHabitRestoreHint: 'You can restore it within 30 days.',

  // HabitForm tabs
  tabBasics: 'Basics',
  tabSchedule: 'Schedule',
  tabReminder: 'Reminder',

  // Basics tab
  habitName: 'Habit name',
  habitNamePlaceholder: 'e.g. Morning walk',
  category: 'Category',
  newCategory: '+ New',
  categoryNamePlaceholder: 'Category name',

  // Schedule tab
  frequency: 'Frequency',
  freqDaily: 'Daily',
  freqDailyDesc: 'Every day',
  freqWeekly: 'Weekly',
  freqWeeklyDesc: 'Pick weekdays',
  freqMonthly: 'Monthly',
  freqMonthlyDesc: 'Pick a day of the month',
  freqYearly: 'Yearly',
  freqYearlyDesc: 'Pick a date each year',
  freqEveryXWeeks: 'Every X weeks',
  freqEveryXWeeksDesc: 'Every few weeks',
  freqEveryXMonths: 'Every X months',
  freqEveryXMonthsDesc: 'Every few months',
  freqCustom: 'Custom',
  freqCustomDesc: 'Every X days',
  everyLabel: 'Every',
  weeksLabel: 'weeks',
  monthsLabel: 'months',
  daysLabel: 'days',
  startingFrom: 'Starting from',
  startingOnThe: 'Starting on the',
  selectAtLeastOneDay: 'Select at least one day',
  skipMonthHint: 'Months without this day will be skipped.',
  intervalMinError: 'Minimum value is 2',
  intervalMaxError: 'Maximum value is 99',
  maxDaysSelected: 'Maximum 6 days selected',

  // Reminder tab
  dailyReminder: 'Daily reminder',
  remindMeAt: 'Remind me at',
  notificationNote: 'Notifications require permission. You\'ll be prompted on first use.',

  // Schedule human-readable labels
  scheduleEveryDay: 'Every day',
  scheduleEveryWeekOn: 'Every {{day}}',
  scheduleEveryMonthOn: 'Every month on the {{ordinal}}',
  scheduleEveryYearOn: 'Every {{date}}',
  scheduleEveryXDays: 'Every {{n}} days',
  scheduleEveryXWeeksOn: 'Every {{n}} weeks on {{days}}',
  scheduleEveryXMonthsOn: 'Every {{n}} months on the {{ordinal}}',
  andSymbol: '&', // For "Mon & Tue"

  // CalendarPage
  editButton: 'Edit',
  backToTop: 'Back to top',
  noHabitFound: 'Habit not found',

  // NoteModal
  noteModalTitle: 'Note',
  notePlaceholder: 'Write anything…',
  saveNote: 'Save',
  deleteNote: 'Delete note',
  characterCount: '{{current}} / {{max}}',

  // StatsPage
  currentStreak: 'Current streak',
  longestStreak: 'Longest streak',
  days: 'days',
  consistency: 'Consistency',
  completionRate: 'completion rate',
  noDataYet: 'No data yet',
  last52Weeks: 'Last 52 weeks',
  bestPeriod: 'Best period',
  noBestPeriod: 'No completed streaks yet',
  monthlyConsistency: 'Monthly consistency',
  totalCheckIns: 'Total check-ins',
  timesCompleted: 'times completed',
  completed: 'Completed',

  // SettingsPage
  settingsTitle: 'Settings',
  appearance: 'Appearance',
  theme: 'Theme',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',
  language: 'Language',
  langEnglish: 'English',
  langVietnamese: 'Tiếng Việt',
  data: 'Data',
  exportBackup: 'Export backup',
  lastExport: 'Last export',
  lastExportNever: 'never',
  exported: 'Exported!',
  restoreBackup: 'Restore backup',
  mergeOrReplace: 'Merge or replace your data',
  importButton: 'Import',
  exportButton: 'Export',
  about: 'About',
  version: 'Version',

  // Categories
  categories: 'Categories',
  manageCategories: 'Manage categories',
  uncategorized: 'None',
  addCategory: 'Add category',
  editCategory: 'Edit category',
  categoryColor: 'Color',
  deleteCategory: 'Delete category',
  deleteCategoryWarning: 'Habits in this category will become uncategorized.',
  noCategoriesYet: 'No categories yet.',
  noCategoriesHint: 'Go to Settings > Categories to add one',
  addOne: 'Add one',
  habitSingular: 'habit',
  habitsPlural: 'habits',
  
  // ImportModal
  importTitle: 'Restore backup',
  importSubtitle: 'Import a .json file exported from Habitual.',
  dropFileHere: 'Drop your backup file here',
  orTapToBrowse: 'or tap to browse',
  chooseDifferentFile: '× Choose different file',
  merge: 'Merge',
  replace: 'Replace',
  mergeDesc: 'New data is added. Existing habits are kept.',
  replaceDesc: 'All current data is deleted and replaced.',
  restore: 'Restore',
  importSuccess: 'Restored {{habits}} habits, {{entries}} entries',
  importError: 'Could not read file. Make sure it is a valid Habitual backup.',
  unsupportedVersion: 'Unsupported file version.',
  invalidFormat: 'Invalid file format.',

  // InstallPrompt
  addToHomeScreen: 'Add to home screen',
  installDesc: 'Use Habitual like a native app',
  installButton: 'Install',
  installLater: 'Later',

  // UpdatePrompt
  updateAvailable: 'Update available',
  updateDesc: 'A new version of Habitual is ready.',
  updateButton: 'Update now',

  // LandingPage
  landingHeadline1: 'Build better habits,',
  landingHeadline2: 'one day at a time.',
  landingSubtitle: 'Habitual is a free, premium tracker designed to help you focus on what truly matters.',
  getStarted: 'Get started',
  dataStoredLocally: 'Your data is stored locally',

  // Toast
  exportSuccess: 'Backup exported successfully',

  // ErrorBoundary
  somethingWentWrong: 'Something went wrong',
  reloadApp: 'Reload app',

  // Trash
  trash: 'Trash',
  emptyTrash: 'Empty Trash',
  emptyTrashConfirm: 'Permanently delete all items?',
  item: 'item',
  items: 'items',
  restoreItem: 'Restore',
  deletePermanently: 'Delete permanently',
  trashEmpty: 'Trash is empty',
  trashEmptyDesc: 'Deleted habits will appear here for 30 days',
  noDeletedHabits: 'No deleted habits',
  autoDeletes: 'auto-deletes in 30 days',
  viewButton: 'View',
  deletedPrefix: 'Deleted ',
  expiringSoon: 'Expiring soon',
  daysLeft: '{{n}}d left',
  entrySingular: 'entry',
  entriesPlural: 'entries',
  noteSingular: 'note',
  notesPlural: 'notes',
  itemRestored: '"{{name}}" restored',
  permanentlyDeleted: 'Permanently deleted',
  trashEmptied: 'Trash emptied',
  backupExported: 'Backup exported successfully',
  exportFailed: 'Export failed',
  tapThe: 'Tap the',
  share: 'Share',
  iconBelowAndSelect: 'icon below and select',
  addToHomeScreenQuote: '"Add to Home Screen"',
  fromTheMenu: 'from the menu.',
  appReadyOffline: 'App ready for offline',
  appReadyOfflineDesc: 'Access your habits even without internet',
  updateAvailableDesc: 'A new version with improvements is ready',
  updateAction: 'Update',
  gotIt: 'Got it',

  // Display modes
  modeWeek: 'week',
  modeYear: 'year',
  modeMonth: 'month',

  // Weekday short labels (Mon-first)
  weekdayMon: 'Mon',
  weekdayTue: 'Tue',
  weekdayWed: 'Wed',
  weekdayThu: 'Thu',
  weekdayFri: 'Fri',
  weekdaySat: 'Sat',
  weekdaySun: 'Sun',

  // Weekday single letter headers (for heatmap grids)
  weekdayMonShort: 'MO',
  weekdayTueShort: 'TU',
  weekdayWedShort: 'WE',
  weekdayThuShort: 'TH',
  weekdayFriShort: 'FR',
  weekdaySatShort: 'SA',
  weekdaySunShort: 'SU',
} as const

export type TranslationKey = keyof typeof en
