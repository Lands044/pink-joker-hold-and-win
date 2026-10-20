import { DEFAULT_CONFIG } from '@js/config/game.defaults.js'

// Game-specific devmenu field groups, concatenated with CORE_FIELDS (texts/CTA/
// sound) in index.js. See src/js/config/devmenu.js in the core kit for the field
// shape ({ path, label, type, min/max/step, hint }).
//
// Свідомо лише у файлі (не в панелі): spins.*.result та spins.*.winLine — це
// сітки іконок, які легко зламати вільним вводом; assets.* — технічні ключі.

const jackpotFields = () => Object.keys(DEFAULT_CONFIG.game.jackpots).map(key => [
	{ path: `game.jackpots.${key}.label`, label: `Джекпот ${key}: назва`, type: 'text' },
	{ path: `game.jackpots.${key}.value`, label: `Джекпот ${key}: сума`, type: 'text' }
]).flat()

// Одна група полів на кожен спін, кількість береться з дефолтів.
const spinFields = (breakpoint) => DEFAULT_CONFIG.game.spins[breakpoint].map((_, i) => [
	{ path: `game.spins.${breakpoint}.${i}.type`, label: `Спін #${i + 1}: тип`, type: 'text' },
	{ path: `game.spins.${breakpoint}.${i}.winAmount`, label: `Спін #${i + 1}: виграш`, type: 'number', min: 0, step: 1 }
]).flat()

export const GAME_FIELDS = [
	['Гра', [
		{ path: 'game.balance', label: 'Стартовий баланс', type: 'number', min: 0, step: 1 },
		{ path: 'game.bets', label: 'Ставки', type: 'list',
			hint: 'через кому, перша — стартова' },
		{ path: 'game.winAnimation', label: 'Анімація виграшу', type: 'text',
			hint: 'line — лінія, border — обводка іконок' }
	]],
	['Джекпоти', jackpotFields()],
	['Спіни (desktop)', spinFields('desktop')],
	['Спіни (mobile)', spinFields('mobile')],
	['Підписи', [
		{ path: 'texts.creditLabel', label: 'Баланс', type: 'text' },
		{ path: 'texts.lastWinLabel', label: 'Останній виграш', type: 'text' },
		{ path: 'texts.betLabel', label: 'Ставка', type: 'text' }
	]]
]

// Core-поля, яких ця гра не має (немає однієї кнопки дії).
const UNUSED_CORE_PATHS = ['texts.actionButton']

export const withoutUnusedCoreFields = (coreFields) => coreFields.map(([legend, fields]) =>
	[legend, fields.filter(field => !UNUSED_CORE_PATHS.includes(field.path))]
)
