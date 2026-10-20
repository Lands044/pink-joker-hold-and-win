import { imageUrl } from '@js/config/assets.js'

// textContent rather than innerText: these are plain labels, and innerText is
// rendering-dependent (it reads back empty inside a hidden element).
const setText = (selector, value) => {
	const element = document.querySelector(selector)
	if (element && typeof value === 'string') element.textContent = value
}

/**
 * Applies the config to the page: repoints art and rewrites every configurable
 * label. Safe to call repeatedly — this is the function the dev watcher re-runs
 * on every config.json edit and the one place that turns config into DOM.
 *
 * Баланс/ставка/виграш та барабани рендерить сам SlotMachine (index.js).
 */
export function renderLanding(config) {
	const { game, assets, texts, cta } = config

	const logo = document.querySelector('.logo img')
	if (logo) logo.src = imageUrl(assets.logo, 'logo')

	// Лише картинку: позиція/розмір фону лишаються з index.scss.
	const page = document.querySelector('.page')
	if (page) page.style.backgroundImage = `url("${imageUrl(assets.background, 'bg')}")`

	for (const [key, jackpot] of Object.entries(game.jackpots)) {
		setText(`.jackpot--${key} .jackpot__label`, jackpot.label)
		setText(`.jackpot--${key} .jackpot__value`, jackpot.value)
	}

	setText('.menu__info-block:not(.last-win) .menu__info-label', texts.creditLabel)
	setText('.last-win .menu__info-label', texts.lastWinLabel)
	setText('.menu__bet-center .menu__info-label', texts.betLabel)

	setText('.popup__title', texts.popupTitle)
	setText('.popup__text', texts.popupText)
	setText('.cta-button', texts.ctaButton)

	const ctaButton = document.querySelector('.cta-button')
	if (ctaButton) {
		ctaButton.href = cta.url
		ctaButton.target = cta.target
		if (cta.target === '_blank') ctaButton.rel = 'noopener'
		else ctaButton.removeAttribute('rel')
	}
}
