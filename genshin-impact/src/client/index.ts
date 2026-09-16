/**
 * Teyvat-inspired presentation skin. It only owns its body marker, one
 * decorative elemental rail, and the title; all changes are restored when the
 * Cordis context is disposed.
 */
import type { Context } from '@deepseek-ai/cordis'
import css from './genshin-impact.module.css'

const SKIN_TITLE = '提瓦特旅者 · DeepSeek Harness'
const BODY_ATTRIBUTE = 'data-dsh-genshin-impact'
const OWNER_ATTRIBUTE = 'data-genshin-impact-owned'

const cls = (name: keyof typeof css): string => css[name] ?? ''

function createElementRail(): HTMLDivElement {
  const rail = document.createElement('div')
  rail.className = cls('elementRail')
  rail.dataset.skinChrome = 'element-rail'
  rail.setAttribute(OWNER_ATTRIBUTE, '')
  rail.setAttribute('aria-hidden', 'true')

  const elements = [
    ['anemo', '风'],
    ['geo', '岩'],
    ['electro', '雷'],
    ['pyro', '火'],
  ] as const
  for (const [element, label] of elements) {
    const node = document.createElement('span')
    const className = `element${element[0].toUpperCase()}${element.slice(1)}` as keyof typeof css
    node.className = `${cls('elementNode')} ${cls(className)}`
    node.dataset.element = element
    node.textContent = label
    rail.append(node)
  }
  return rail
}

export function apply(ctx: Context): void {
  const body = document.body
  const originalTitle = document.title
  const hadBodyAttribute = body.hasAttribute(BODY_ATTRIBUTE)
  const rail = createElementRail()

  body.setAttribute(BODY_ATTRIBUTE, '')
  body.append(rail)
  document.title = SKIN_TITLE

  ctx.effect(() => () => {
    rail.remove()
    if (hadBodyAttribute) body.setAttribute(BODY_ATTRIBUTE, '')
    else body.removeAttribute(BODY_ATTRIBUTE)
    if (document.title === SKIN_TITLE) document.title = originalTitle
  }, 'ui-skin-genshin-impact: elemental chrome')
}
