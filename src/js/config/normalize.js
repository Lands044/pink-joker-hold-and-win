import { setGameNormalizer, mergeConfig, toNumber, clampInt } from '@js/config/config.js'
import { DEFAULT_CONFIG as CORE_DEFAULTS } from '@js/config/defaults.js'
import { DEFAULT_CONFIG } from './game.defaults.js'

// Game-specific validation, registered with the core config module. Import this
// module once (from index.js, before loadConfig() runs) and it wires itself in —
// see registerGameConfig() below.

// Розмір сітки і кількість іконок закладені в розмітку/механіку — не конфіг.
const COLS = 3
const ROWS = 3
const ICONS = 8
const SPIN_TYPES = ['loss', 'smallwin', 'bigwin']

// Core normalizeConfig() зливає файл лише з core-дефолтами, тож там, де ця гра
// має інший дефолт (cta.url, texts.ctaButton, assets.background), пропущене у
// файлі поле приходить сюди зі значенням core. Такі значення замінюємо на
// дефолт гри.
const OVERRIDDEN_PATHS = ['cta.url', 'texts.ctaButton', 'assets.background']
const getPath = (object, path) => path.split('.').reduce((acc, key) => acc?.[key], object)
const setPath = (object, path, value) => {
	const keys = path.split('.')
	const last = keys.pop()
	keys.reduce((acc, key) => acc[key], object)[last] = value
}

const isIcon = (value) => Number.isInteger(value) && value >= 1 && value <= ICONS

// Сітка 3×3: не видаляємо записи, лише доповнюємо/виправляємо клітинки.
function normalizeGrid(grid, fallback) {
	return Array.from({ length: COLS }, (_, col) => Array.from({ length: ROWS }, (_, row) => {
		const value = Math.round(toNumber(grid?.[col]?.[row], NaN))
		return isIcon(value) ? value : (fallback?.[col]?.[row] ?? 1)
	}))
}

function normalizeWinLine(line) {
	if (!Array.isArray(line)) return null
	return Array.from({ length: COLS }, (_, col) => clampInt(line[col], 0, 0, ROWS - 1))
}

function normalizeSpins(list, defaults) {
	if (!Array.isArray(list) || list.length === 0) return structuredClone(defaults)
	return list.map((spin, index) => {
		const fallback = defaults[index] || defaults[defaults.length - 1]
		const type = SPIN_TYPES.includes(spin?.type) ? spin.type : 'loss'
		return {
			...spin,
			type,
			winAmount: Math.max(0, toNumber(spin?.winAmount, 0)),
			winLine: type === 'loss' ? null : normalizeWinLine(spin?.winLine),
			result: normalizeGrid(spin?.result, fallback.result)
		}
	})
}

function normalizeGameConfig(input) {
	for (const path of OVERRIDDEN_PATHS) {
		if (getPath(input, path) === getPath(CORE_DEFAULTS, path)) setPath(input, path, getPath(DEFAULT_CONFIG, path))
	}

	const config = mergeConfig(DEFAULT_CONFIG, input)
	// mergeConfig повертає core-ключі, яких ця гра не використовує.
	delete config.texts.actionButton
	delete config.texts.rotateNotice

	const game = config.game
	const defaults = DEFAULT_CONFIG.game

	game.balance = Math.max(0, toNumber(game.balance, defaults.balance))

	const bets = (Array.isArray(game.bets) ? game.bets : [])
		.map(bet => toNumber(bet, NaN))
		.filter(bet => bet > 0)
	game.bets = bets.length > 0 ? bets : [...defaults.bets]

	for (const key of Object.keys(defaults.jackpots)) {
		const jackpot = game.jackpots[key]
		jackpot.label = String(jackpot.label ?? defaults.jackpots[key].label)
		jackpot.value = String(jackpot.value ?? defaults.jackpots[key].value)
	}

	game.winAnimation = game.winAnimation === 'border' ? 'border' : 'line'

	game.spins.desktop = normalizeSpins(game.spins.desktop, defaults.spins.desktop)
	game.spins.mobile = normalizeSpins(game.spins.mobile, defaults.spins.mobile)

	return config
}

export function registerGameConfig() {
	setGameNormalizer(normalizeGameConfig)
}
