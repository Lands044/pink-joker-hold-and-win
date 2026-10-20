import { DEFAULT_CONFIG as CORE_DEFAULTS } from '@js/config/defaults.js'

// Pink Joker — слот 3×3 із заздалегідь заданими спінами (окремо для desktop і
// mobile). Значення нижче дзеркалять те, що раніше було хардкоджено в
// src/components/pages/index/index.js / index.html.
//
// Named game.defaults.js (not defaults.js) deliberately: the core kit already
// installs its own src/js/config/defaults.js at that exact path, so this file
// needs a different name to sit next to it without colliding.

// У цій грі немає однієї кнопки дії та оверлею "поверніть пристрій" — ці core-
// тексти нічим не читаються, тому прибрані зі спреду (див. docs/config.md,
// "No dead or hidden fields").
const { actionButton, rotateNotice, ...CORE_TEXTS } = CORE_DEFAULTS.texts

export const DEFAULT_CONFIG = {
	...CORE_DEFAULTS,

	cta: {
		// href="#" у розмітці — реальне посилання підставляє хост/конфіг.
		url: '#',
		target: '_self'
	},

	texts: {
		...CORE_TEXTS,
		ctaButton: 'Download Now',
		creditLabel: 'CREDIT',
		lastWinLabel: 'LAST WIN',
		betLabel: 'BET'
	},

	assets: {
		logo: 'logo',
		background: 'bg',
		sounds: {
			spin: 'spin',
			win: 'win'
		}
	},

	game: {
		// Стартовий баланс (CREDIT)
		balance: 1000,
		// Доступні ставки, кнопки +/− ходять по цьому списку; перша — стартова
		bets: [1, 5, 10, 20, 30],

		// Джекпоти над барабаном — лише відображення
		jackpots: {
			grand: { label: 'GRAND', value: '1000.00' },
			major: { label: 'MAJOR', value: '150.00' },
			minor: { label: 'MINOR', value: '50.00' },
			mini: { label: 'MINI', value: '25.00' }
		},

		// 'line' — виграшна лінія, 'border' — анімована обводка іконок
		winAnimation: 'line',

		// Сценарій спінів по черзі. type: loss | smallwin | bigwin.
		// result — 3 колонки по 3 іконки (номери 1–8, src/assets/img/icon/icon-N.webp),
		// winLine — рядок (0–2) виграшної іконки в кожній колонці, або null.
		// Останній спін показує попап CTA.
		spins: {
			desktop: [
				{
					type: 'loss',
					winAmount: 0,
					winLine: null,
					result: [
						[2, 4, 1],
						[3, 5, 2],
						[1, 7, 4]
					]
				},
				{
					type: 'smallwin',
					winAmount: 50,
					winLine: [1, 1, 1],
					result: [
						[4, 5, 2],
						[3, 5, 6],
						[8, 5, 1]
					]
				},
				{
					type: 'bigwin',
					winAmount: 150,
					winLine: [0, 1, 2],
					result: [
						[1, 2, 4],
						[5, 1, 3],
						[6, 8, 1]
					]
				}
			],
			mobile: [
				{
					type: 'loss',
					winAmount: 0,
					winLine: null,
					result: [
						[4, 1, 7],
						[5, 2, 8],
						[7, 4, 3]
					]
				},
				{
					type: 'smallwin',
					winAmount: 50,
					winLine: [1, 1, 1],
					result: [
						[4, 5, 2],
						[3, 5, 6],
						[8, 5, 1]
					]
				},
				{
					type: 'bigwin',
					winAmount: 150,
					winLine: [0, 1, 2],
					result: [
						[1, 5, 4],
						[2, 1, 3],
						[6, 8, 1]
					]
				}
			]
		}
	}
}
