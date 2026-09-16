/**
 * Teyvat Traveler skin. The client entry keeps the traveler artwork variants
 * background, collapsible sidebar artwork, and ornamental chrome as
 * independent layers. The sidebar keeps the product's native vector
 * wordmark; every skin-owned write is restored by the Cordis effect disposer.
 */
import type { Context } from '@deepseek-ai/cordis'
import {
  GENSHIN_IMPACT_BOW_CLEAN,
  GENSHIN_IMPACT_CHIBI,
  GENSHIN_IMPACT_NEW_SESSION,
  GENSHIN_IMPACT_SIDEBAR_SWAG,
  GENSHIN_IMPACT_TOP_TRIM_TILE,
} from './art.ts'
import {
  GENSHIN_IMPACT_TRAVELER_LEFT,
  GENSHIN_IMPACT_TRAVELER_RIGHT,
  GENSHIN_IMPACT_PALACE_DARK,
  GENSHIN_IMPACT_PALACE_LIGHT,
} from './background-art.generated.ts'
import {
  GENSHIN_IMPACT_COMPOSER_FRAME_SHELL,
  GENSHIN_IMPACT_COMPOSER_LACE_TILE,
  GENSHIN_IMPACT_COMPOSER_RIBBON_LEFT_CAP,
  GENSHIN_IMPACT_COMPOSER_RIBBON_LEFT_FILL,
  GENSHIN_IMPACT_COMPOSER_RIBBON_RIGHT_CAP,
  GENSHIN_IMPACT_COMPOSER_RIBBON_RIGHT_FILL,
} from './composer-art.generated.ts'
import { GENSHIN_IMPACT_TRAVELER_VISION } from './vision-art.generated.ts'
import {
  GENSHIN_IMPACT_BOTTOM_CREST,
  GENSHIN_IMPACT_BOTTOM_TRIM_TILE,
  GENSHIN_IMPACT_SETTINGS_FRAME,
  GENSHIN_IMPACT_SIDEBAR_CORNER,
} from './chrome-art.generated.ts'
import {
  GENSHIN_IMPACT_WORKSPACE_RIBBON,
  GENSHIN_IMPACT_WORKSPACE_SHIELD,
} from './workspace-art.generated.ts'
import './genshin-impact.module.css'
import './boot-error.module.css'
import { GENSHIN_IMPACT_TITLEBAR_BRAND } from './titlebar-brand.ts'
import { installGenshinComposerCapsule } from './composer-capsule.ts'
import { installGenshinComposerDismiss } from './composer-dismiss.ts'
import { installGenshinComposerScroll } from './composer-scroll.ts'
import { installGenshinMobileDrawerAutoClose } from './mobile-drawer.ts'
import { installGenshinMobileViewport } from './mobile-viewport.ts'
import { createGenshinSettingsNavigation } from './settings-navigation.ts'
import { installGenshinCustomization } from './customization.ts'
import { installGenshinBootError } from './boot-error.ts'
import { GENSHIN_BOOT_ERROR_LEFT, GENSHIN_BOOT_ERROR_RIGHT } from './boot-error-art.generated.ts'
import { installGenshinTableCards } from './table-card.ts'
import { installGenshinPageIcons } from './page-icons.ts'

const SKIN_TITLE = '提瓦特旅者 · DeepSeek Harness'
const SKIN_OWNER = 'genshin-impact'
const SKIN_SYSTEM_CHROME_COLOR = '#0b2630'
const VIEWPORT_RESIZE_SETTLE_MS = 120
const SIDEBAR_COLUMN_SELECTOR = ":is([data-pane='sidebar'], [class*='sidebarCol'])"
const CONVERSATION_COLUMN_SELECTOR = ":is([data-pane='conversation'], [class*='centerCol'])"
const SETTINGS_TRIGGER_SELECTOR = "[data-slot='sidebar.settings'] > :is(button, [role='button'])"
const SETTINGS_MASK_SELECTOR = "[role='presentation'] > [class*='mask']"
const SETTINGS_DIALOG_SELECTOR = "[data-slot='sidebar.settings'] [role='dialog'][aria-modal='true']"
const ACTIVE_CONVERSATION_SELECTOR = "[data-phase='active']"
const ACTIVE_CHAT_SELECTOR = `${ACTIVE_CONVERSATION_SELECTOR} [data-chat-flow]`
const WORKSPACE_SELECTOR = "header [role='tablist']"
const CORDIS_PANEL_SELECTOR = '[data-cordis-panel]'
const TERMINAL_SELECTOR = '.xterm'

interface AttributeLeaseState {
  originalValue: string | null
  owners: Set<symbol>
  value: string
}

const bodyAttributeLeases = new WeakMap<HTMLElement, Map<string, AttributeLeaseState>>()

function createBodyAttributeLease(body: HTMLElement, attribute: string, value = ''): {
  acquire: () => void
  release: () => void
} {
  const owner = Symbol(attribute)
  let active = false

  return {
    acquire(): void {
      if (active) return
      let attributes = bodyAttributeLeases.get(body)
      if (attributes === undefined) {
        attributes = new Map()
        bodyAttributeLeases.set(body, attributes)
      }
      let state = attributes.get(attribute)
      if (state === undefined) {
        state = {
          originalValue: body.getAttribute(attribute),
          owners: new Set(),
          value,
        }
        attributes.set(attribute, state)
      }
      state.owners.add(owner)
      active = true
      body.setAttribute(attribute, state.value)
    },
    release(): void {
      if (!active) return
      active = false
      const attributes = bodyAttributeLeases.get(body)
      const state = attributes?.get(attribute)
      if (state === undefined || !state.owners.delete(owner)) return
      if (state.owners.size > 0) {
        body.setAttribute(attribute, state.value)
        return
      }
      attributes?.delete(attribute)
      if (attributes?.size === 0) bodyAttributeLeases.delete(body)
      if (body.getAttribute(attribute) !== state.value) return
      if (state.originalValue === null) body.removeAttribute(attribute)
      else body.setAttribute(attribute, state.originalValue)
    },
  }
}

const PROJECTED_STATE_ATTRIBUTES = {
  activeChat: 'data-genshin-chat-active',
  activeConversation: 'data-genshin-conversation-active',
  cordisPanelOpen: 'data-genshin-cordis-panel-open',
  settingsOpen: 'data-genshin-settings-open',
  workspace: 'data-genshin-workspace',
} as const

const PROJECTED_STATE_SELECTOR = [
  ACTIVE_CONVERSATION_SELECTOR,
  '[data-chat-flow]',
  WORKSPACE_SELECTOR,
  CORDIS_PANEL_SELECTOR,
  "[data-slot='sidebar.settings']",
].join(', ')

/** Workspace decoration flags, listed so diff application iterates a fixed order. */
const WORKSPACE_FLAGS = [
  'data-genshin-workspace-group',
  'data-genshin-workspace-row',
  'data-genshin-workspace-active',
  'data-genshin-session-row',
  'data-genshin-session-flat',
  'data-genshin-session-first',
  'data-genshin-session-last',
] as const

const WORKSPACE_FLAG_SELECTOR = WORKSPACE_FLAGS.map(flag => `[${flag}]`).join(', ')

const SIDEBAR_FOOTER_FLAG = 'data-genshin-sidebar-footer'

const BACKDROP_PROPERTIES = [
  '--genshin-boot-error-left-art',
  '--genshin-boot-error-right-art',
  '--genshin-palace-art',
  '--genshin-sidebar-width',
  '--genshin-top-trim-art',
  '--genshin-bottom-trim-art',
  '--genshin-bottom-crest-art',
  '--genshin-bow-art',
  '--genshin-new-session-art',
  '--genshin-sidebar-swag-art',
  '--genshin-sidebar-corner-art',
  '--genshin-composer-frame-art',
  '--genshin-composer-ribbon-left-cap-art',
  '--genshin-composer-ribbon-left-fill-art',
  '--genshin-composer-ribbon-right-fill-art',
  '--genshin-composer-ribbon-right-cap-art',
  '--genshin-composer-lace-art',
  '--genshin-settings-frame-art',
  '--genshin-workspace-crest-art',
  '--genshin-workspace-ribbon-art',
] as const

function createCharacterStage(): HTMLDivElement {
  const stage = document.createElement('div')
  stage.dataset.skinChrome = 'character-stage'
  stage.dataset.skinOwner = SKIN_OWNER
  stage.setAttribute('aria-hidden', 'true')

  const left = document.createElement('img')
  left.dataset.genshinCharacter = 'left'
  left.alt = ''
  left.src = GENSHIN_IMPACT_TRAVELER_LEFT

  const right = document.createElement('img')
  right.dataset.genshinCharacter = 'right'
  right.alt = ''
  right.src = GENSHIN_IMPACT_TRAVELER_RIGHT

  const vision = document.createElement('img')
  vision.dataset.genshinCharacter = 'vision'
  vision.alt = ''
  vision.src = GENSHIN_IMPACT_TRAVELER_VISION

  stage.append(left, right, vision)
  return stage
}

/**
 * Seat the character stage (palace + both genshins) inside the conversation
 * column. The stage is a first child at z-index 0; the ConversationRoot
 * paints above it by DOM order once the skin gives it `position: relative`
 * without a z-index (no new stacking context, so fixed popups keep their
 * page-level tier). The column is the chat-owning box, so any layout push
 * (right/bottom workbenches) moves the artwork with the chat instead of
 * leaving it fixed to the viewport. When the column has not mounted yet the
 * stage waiter returns false; the conversation-column mutation path retries
 * once the chat area appears or is replaced.
 */
function ensureChatAreaStage(stage: HTMLElement): boolean {
  const chat = document.querySelector<HTMLElement>(CONVERSATION_COLUMN_SELECTOR)
  if (!chat) return false
  if (stage.parentElement !== chat) chat.prepend(stage)
  return true
}

function ensureChatAreaChrome(...chrome: HTMLElement[]): boolean {
  const chat = document.querySelector<HTMLElement>(CONVERSATION_COLUMN_SELECTOR)
  if (!chat) return false
  for (const element of chrome) {
    if (element.parentElement !== chat) chat.append(element)
  }
  return true
}

function createComposerLaceRail(): HTMLDivElement {
  const rail = document.createElement('div')
  const center = document.createElement('span')
  rail.dataset.skinChrome = 'composer-lace'
  rail.dataset.skinOwner = SKIN_OWNER
  rail.setAttribute('aria-hidden', 'true')
  center.dataset.genshinComposerLaceCenter = ''
  rail.append(center)
  return rail
}

function ensureComposerLaceRail(rail: HTMLElement): boolean {
  const card = document.querySelector<HTMLElement>(
    '[data-composer-card]',
  )
  if (!card) {
    rail.remove()
    return false
  }
  if (rail.parentElement !== card) card.prepend(rail)
  return true
}

function hasAcceleratedWebGL(): boolean {
  if (typeof WebGLRenderingContext === 'undefined') return false
  const canvas = document.createElement('canvas')
  const options: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true }
  for (const kind of ['webgl2', 'webgl'] as const) {
    try {
      const context = canvas.getContext(kind, options)
      if (context === null) continue
      context.getExtension('WEBGL_lose_context')?.loseContext()
      return true
    } catch {
      // A blocked or software-only context should use the CPU-safe CSS path.
    }
  }
  return false
}

function createSidebarCorners(): HTMLDivElement {
  const corners = document.createElement('div')
  corners.dataset.skinChrome = 'sidebar-corners'
  corners.dataset.skinOwner = SKIN_OWNER
  corners.setAttribute('aria-hidden', 'true')
  for (const position of ['top-left', 'top-right', 'bottom-right', 'bottom-left']) {
    const corner = document.createElement('span')
    corner.dataset.skinCorner = position
    corners.append(corner)
  }
  return corners
}

/**
 * Place the whale-free DeepSeek Harness wordmark at the left of the
 * frameless title bar (Web-app overlay / desktop shell), mirroring the
 * sidebar brand at a smaller scale.
 */
function decorateTitlebarBrand(ownedNodes: Set<Element>): void {
  const titlebar = document.querySelector<HTMLElement>("[class*='titlebar']")
  if (!titlebar) return
  if (titlebar.querySelector("[data-skin-chrome='titlebar-brand']")) return
  const brand = document.createElement('span')
  brand.dataset.skinChrome = 'titlebar-brand'
  brand.dataset.skinOwner = SKIN_OWNER
  brand.setAttribute('aria-hidden', 'true')
  brand.innerHTML = GENSHIN_IMPACT_TITLEBAR_BRAND
  ownedNodes.add(brand)
  titlebar.prepend(brand)
}
function decorateSidebar(ownedNodes: Set<Element>, decoratedElements: Set<HTMLElement>): void {
  const sidebar = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
  const sidebarRoot = sidebar?.querySelector<HTMLElement>(':scope > div')
  if (!sidebar || !sidebarRoot) return

  /* Write only the delta: every attribute write is a mutation record that the
     page's other observers (and style invalidation) pay for, and a resize
     storm re-runs this pass per structural change. */
  const settingsSlot = sidebar.querySelector<HTMLElement>("[data-slot='sidebar.settings']")
  let footer: HTMLElement | undefined
  if (settingsSlot) {
    let candidate = settingsSlot.parentElement
    while (candidate && candidate !== sidebar) {
      if (candidate.querySelector("[data-slot='sidebar.footer.action']")) {
        footer = candidate
        break
      }
      candidate = candidate.parentElement
    }
  }
  sidebar.querySelectorAll<HTMLElement>(`[${SIDEBAR_FOOTER_FLAG}]`).forEach((element) => {
    if (element === footer) return
    delete element.dataset.genshinSidebarFooter
    decoratedElements.delete(element)
  })
  if (footer && !footer.hasAttribute(SIDEBAR_FOOTER_FLAG)) {
    footer.dataset.genshinSidebarFooter = ''
    decoratedElements.add(footer)
  }

  if (!sidebarRoot.querySelector("[data-skin-chrome='sidebar-corners']")) {
    const corners = createSidebarCorners()
    ownedNodes.add(corners)
    sidebarRoot.prepend(corners)
  }

  if (!sidebarRoot.querySelector("[data-skin-chrome='sidebar-mascot']")) {
    const mascot = document.createElement('img')
    mascot.dataset.skinChrome = 'sidebar-mascot'
    mascot.dataset.skinOwner = SKIN_OWNER
    mascot.setAttribute('aria-hidden', 'true')
    mascot.alt = ''
    mascot.src = GENSHIN_IMPACT_CHIBI
    ownedNodes.add(mascot)
    sidebarRoot.prepend(mascot)
  }

}

function decorateWorkspaceTree(decoratedElements: Set<HTMLElement>): void {
  const sidebar = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
  if (!sidebar) return

  /* Compute the desired flags first, then write only the delta. During a
     resize storm this pass re-runs per structural mutation; unconditional
     delete+rewrite pairs would emit zero-net-change mutation records that
     other page observers and style invalidation pay for every frame. */
  const current = new Map<HTMLElement, Set<string>>()
  sidebar.querySelectorAll<HTMLElement>(WORKSPACE_FLAG_SELECTOR).forEach((element) => {
    const flags = new Set<string>()
    for (const flag of WORKSPACE_FLAGS) {
      if (element.hasAttribute(flag)) flags.add(flag)
    }
    current.set(element, flags)
  })
  const desired = new Map<HTMLElement, Set<string>>()
  const claim = (element: HTMLElement, flag: string): void => {
    let flags = desired.get(element)
    if (!flags) { flags = new Set(); desired.set(element, flags) }
    flags.add(flag)
  }

  sidebar.querySelectorAll<HTMLElement>("[role='tree']").forEach((tree) => {
    const rows = [...tree.querySelectorAll<HTMLElement>("[role='treeitem']")]
    if (tree.matches("[class*='flatList']") && !rows.some(row => row.hasAttribute('aria-expanded'))) {
      rows.filter(row => row.hasAttribute('aria-selected')).forEach((sessionRow) => {
        claim(sessionRow, 'data-genshin-session-row')
        claim(sessionRow, 'data-genshin-session-flat')
      })
      return
    }

    let workspaceRow: HTMLElement | undefined
    let sessionRows: HTMLElement[] = []
    const decorateGroup = (): void => {
      if (!workspaceRow) return

      claim(workspaceRow, 'data-genshin-workspace-row')
      if (workspaceRow.parentElement) {
        claim(workspaceRow.parentElement, 'data-genshin-workspace-group')
      }
      sessionRows.forEach((sessionRow) => {
        claim(sessionRow, 'data-genshin-session-row')
      })
      if (sessionRows[0]) claim(sessionRows[0], 'data-genshin-session-first')
      if (sessionRows.at(-1)) claim(sessionRows.at(-1)!, 'data-genshin-session-last')

      const containsCurrent = workspaceRow.getAttribute('aria-expanded') === 'true'
        && sessionRows.some(sessionRow => sessionRow.getAttribute('aria-selected') === 'true')
      if (containsCurrent) claim(workspaceRow, 'data-genshin-workspace-active')
    }

    rows.forEach((row) => {
      if (row.hasAttribute('aria-expanded')) {
        decorateGroup()
        workspaceRow = row
        sessionRows = []
      } else if (workspaceRow && row.hasAttribute('aria-selected')) {
        sessionRows.push(row)
      }
    })
    decorateGroup()
  })

  const touched = new Set<HTMLElement>([...current.keys(), ...desired.keys()])
  for (const element of touched) {
    const before = current.get(element)
    const after = desired.get(element)
    if (before !== undefined) {
      for (const flag of before) {
        if (!after?.has(flag)) element.removeAttribute(flag)
      }
    }
    if (after !== undefined) {
      for (const flag of after) {
        if (!before?.has(flag)) element.setAttribute(flag, '')
      }
      if (after.size > 0) decoratedElements.add(element)
    }
  }
}

/**
 * Apply the skin-owned background and independently retractable chrome.
 * @param ctx - owning context whose effect retracts every DOM and CSS write.
 */
export function apply(ctx: Context): void {
  const body = document.body
  ctx.effect(() => installGenshinCustomization(), 'ui-skin-genshin-impact: customization declaration')
  ctx.effect(() => installGenshinBootError(), 'ui-skin-genshin-impact: boot failure presentation')
  const originalTitle = document.title
  const layoutResizeLease = createBodyAttributeLease(body, 'data-genshin-layout-resizing')
  const lowPowerLease = createBodyAttributeLease(body, 'data-genshin-low-power')
  const previous = new Map<string, string>()
  for (const property of BACKDROP_PROPERTIES) {
    previous.set(property, body.style.getPropertyValue(property))
  }
  const previousProjectedStates = new Map<string, string | null>()
  for (const attribute of Object.values(PROJECTED_STATE_ATTRIBUTES)) {
    previousProjectedStates.set(attribute, body.getAttribute(attribute))
  }

  const ownedNodes = new Set<Element>()
  const decoratedElements = new Set<HTMLElement>()
  const characterStage = createCharacterStage()
  ownedNodes.add(characterStage)
  const composerLaceRail = createComposerLaceRail()
  ownedNodes.add(composerLaceRail)
  let themeColorMeta: HTMLMetaElement | null = null
  let previousThemeColor: string | undefined
  let themeColorObserver: MutationObserver | undefined
  let observedSidebar: HTMLElement | undefined
  let resizeObserver: ResizeObserver | undefined
  let composerPhase: 'hero' | 'active' | undefined
  let composerMotionTimer: ReturnType<typeof setTimeout> | undefined
  let viewportResizeTimer: ReturnType<typeof setTimeout> | undefined
  let handleViewportResize: (() => void) | undefined
  let railSearchFocusFrame: number | undefined
  let recoverRailSearchFocus: ((event: MouseEvent) => void) | undefined
  let settingsBackdropFrame: HTMLDivElement | undefined
  let observer: MutationObserver | undefined
  let titlebarOverlay: WindowControlsOverlay | undefined
  let syncTitlebarHeight: (() => void) | undefined
  let titlebarSyncFrame: number | undefined
  let disposeGenshinTableCards = (): void => {}

  ctx.effect(() => () => {
    delete body.dataset.dshGenshinImpact
    delete body.dataset.genshinComposerMotion
    delete body.dataset.genshinSidebarCompact
    delete body.dataset.genshinSidebarSize
    for (const [attribute, value] of previousProjectedStates) {
      if (value === null) body.removeAttribute(attribute)
      else body.setAttribute(attribute, value)
    }
    disposeGenshinComposerCapsule()
    disposeGenshinComposerScroll()
    disposeGenshinTableCards()
    if (composerMotionTimer !== undefined) clearTimeout(composerMotionTimer)
    if (viewportResizeTimer !== undefined) clearTimeout(viewportResizeTimer)
    if (handleViewportResize !== undefined) window.removeEventListener('resize', handleViewportResize)
    layoutResizeLease.release()
    lowPowerLease.release()
    if (railSearchFocusFrame !== undefined) cancelAnimationFrame(railSearchFocusFrame)
    if (recoverRailSearchFocus !== undefined) {
      document.removeEventListener('click', recoverRailSearchFocus)
    }
    observer?.disconnect()
    themeColorObserver?.disconnect()
    if (titlebarOverlay !== undefined && syncTitlebarHeight !== undefined) {
      titlebarOverlay.removeEventListener('geometrychange', syncTitlebarHeight)
    }
    if (titlebarSyncFrame !== undefined) cancelAnimationFrame(titlebarSyncFrame)
    titlebarSyncFrame = undefined
    resizeObserver?.disconnect()
    for (const [property, value] of previous) {
      body.style.setProperty(property, value)
    }
    ownedNodes.forEach(element => element.remove())
    decoratedElements.forEach((element) => {
      delete element.dataset.genshinSidebarFooter
      delete element.dataset.genshinWorkspaceGroup
      delete element.dataset.genshinWorkspaceRow
      delete element.dataset.genshinWorkspaceActive
      delete element.dataset.genshinSessionRow
      delete element.dataset.genshinSessionFlat
      delete element.dataset.genshinSessionFirst
      delete element.dataset.genshinSessionLast
    })
    if (themeColorMeta?.isConnected && themeColorMeta.content === SKIN_SYSTEM_CHROME_COLOR) {
      themeColorMeta.content = previousThemeColor ?? ''
    }
    if (document.title === SKIN_TITLE) document.title = originalTitle
  }, 'ui-skin-genshin-impact: layered background and ornament')

  handleViewportResize = (): void => {
    layoutResizeLease.acquire()
    if (viewportResizeTimer !== undefined) clearTimeout(viewportResizeTimer)
    viewportResizeTimer = setTimeout(() => {
      layoutResizeLease.release()
      viewportResizeTimer = undefined
    }, VIEWPORT_RESIZE_SETTLE_MS)
  }
  window.addEventListener('resize', handleViewportResize)
  if (!hasAcceleratedWebGL()) lowPowerLease.acquire()

  const syncSystemChrome = (): void => {
    const meta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (meta === null) return
    if (meta !== themeColorMeta) {
      themeColorMeta = meta
      previousThemeColor = meta.content
    }
    if (meta.content !== SKIN_SYSTEM_CHROME_COLOR) meta.content = SKIN_SYSTEM_CHROME_COLOR
  }
  themeColorObserver = new MutationObserver(syncSystemChrome)
  themeColorObserver.observe(document.head, {
    attributes: true,
    attributeFilter: ['content'],
    childList: true,
    subtree: true,
  })
  syncSystemChrome()
  body.dataset.dshGenshinImpact = ''
  // Composer presentation modes (skin setting 「输入框显示方式」):
  // capsule collapses the empty unfocused card, scroll fades it on scroll-up.
  ctx.effect(() => installGenshinComposerDismiss(body), 'ui-skin-genshin-impact: composer stats dismissal')
  const disposeGenshinComposerCapsule = installGenshinComposerCapsule(body)
  const disposeGenshinComposerScroll = installGenshinComposerScroll(body)
  const settingsNavigation = createGenshinSettingsNavigation(body)
  ctx.effect(() => settingsNavigation.dispose, 'ui-skin-genshin-impact: settings navigation hint')
  ctx.effect(() => installGenshinMobileDrawerAutoClose(body), 'ui-skin-genshin-impact: mobile drawer auto-close')
  ctx.effect(() => installGenshinMobileViewport(body), 'ui-skin-genshin-impact: phone viewport')
  disposeGenshinTableCards = installGenshinTableCards(ctx).dispose
  body.style.setProperty('--genshin-top-trim-art', `url(${GENSHIN_IMPACT_TOP_TRIM_TILE})`)
  body.style.setProperty('--genshin-boot-error-left-art', `url(${GENSHIN_BOOT_ERROR_LEFT})`)
  body.style.setProperty('--genshin-boot-error-right-art', `url(${GENSHIN_BOOT_ERROR_RIGHT})`)
  body.style.setProperty('--genshin-bottom-trim-art', `url(${GENSHIN_IMPACT_BOTTOM_TRIM_TILE})`)
  body.style.setProperty('--genshin-bottom-crest-art', `url(${GENSHIN_IMPACT_BOTTOM_CREST})`)
  body.style.setProperty('--genshin-bow-art', `url(${GENSHIN_IMPACT_BOW_CLEAN})`)
  body.style.setProperty('--genshin-new-session-art', `url(${GENSHIN_IMPACT_NEW_SESSION})`)
  body.style.setProperty('--genshin-sidebar-swag-art', `url(${GENSHIN_IMPACT_SIDEBAR_SWAG})`)
  body.style.setProperty('--genshin-sidebar-corner-art', `url(${GENSHIN_IMPACT_SIDEBAR_CORNER})`)
  body.style.setProperty('--genshin-composer-frame-art', `url(${GENSHIN_IMPACT_COMPOSER_FRAME_SHELL})`)
  body.style.setProperty(
    '--genshin-composer-ribbon-left-cap-art',
    `url(${GENSHIN_IMPACT_COMPOSER_RIBBON_LEFT_CAP})`,
  )
  body.style.setProperty(
    '--genshin-composer-ribbon-left-fill-art',
    `url(${GENSHIN_IMPACT_COMPOSER_RIBBON_LEFT_FILL})`,
  )
  body.style.setProperty(
    '--genshin-composer-ribbon-right-fill-art',
    `url(${GENSHIN_IMPACT_COMPOSER_RIBBON_RIGHT_FILL})`,
  )
  body.style.setProperty(
    '--genshin-composer-ribbon-right-cap-art',
    `url(${GENSHIN_IMPACT_COMPOSER_RIBBON_RIGHT_CAP})`,
  )
  body.style.setProperty('--genshin-composer-lace-art', `url(${GENSHIN_IMPACT_COMPOSER_LACE_TILE})`)
  body.style.setProperty('--genshin-settings-frame-art', `url(${GENSHIN_IMPACT_SETTINGS_FRAME})`)
  body.style.setProperty('--genshin-workspace-crest-art', `url(${GENSHIN_IMPACT_WORKSPACE_SHIELD})`)
  body.style.setProperty('--genshin-workspace-ribbon-art', `url(${GENSHIN_IMPACT_WORKSPACE_RIBBON})`)

  const syncBackdrop = (): void => {
    const source = body.hasAttribute('data-ds-dark-theme')
      ? GENSHIN_IMPACT_PALACE_DARK
      : GENSHIN_IMPACT_PALACE_LIGHT
    const next = `url(${source})`
    // The palace rides a custom property so the stage inside the conversation
    // column owns the backdrop — the column's box (not the viewport) defines
    // where the art lives and how it re-fits when the chat area is pushed.
    if (body.style.getPropertyValue('--genshin-palace-art') !== next) {
      body.style.setProperty('--genshin-palace-art', next)
    }
  }
  syncBackdrop()

  // 宽度联动写入独立的 <style> 规则而非 body style：CSSOM 修改不产生
  // attribute mutation，Chrome autofill 的 MutationObserver 不会逐帧触发，
  // 宽度变量只由侧栏及使用它的浮层继承，避免聊天树在每一帧重新计算样式。
  const widthSheet = document.createElement('style')
  widthSheet.dataset.skinChrome = 'sidebar-width-rule'
  widthSheet.dataset.skinOwner = SKIN_OWNER
  ownedNodes.add(widthSheet)
  document.head.append(widthSheet)
  // Only `--genshin-sidebar-width` is written at runtime: the drawer animates it
  // every frame, and each additional CSSOM write is another style invalidation
  // through the same rule. The two consumers that used to be mirrored from it
  // are derived here instead, where they cost nothing per frame.
  widthSheet.sheet!.insertRule(`body[data-dsh-genshin-impact] :is(${SIDEBAR_COLUMN_SELECTOR}, [data-cordis-panel], [data-genshin-settings-backdrop-frame], [data-genshin-table-lightbox]) { --genshin-sidebar-width: 280px; --genshin-sidebar-swag-height: clamp(54px, calc(var(--genshin-sidebar-width) * 0.2575), 94px); --genshin-sidebar-mascot-width: min(320px, calc(var(--genshin-sidebar-width) * 0.82)); }`)
  // The official frame rules reference env(titlebar-area-height), but the
  // CSS-modules pipeline rewrites the env() identifier there too, so the
  // title-bar row silently falls back to an auto row: expanding the sidebar
  // is fine, but collapsing it lets the content row’s max-content grow and
  // stretches the title-bar row to hundreds of pixels. Re-assert the rows
  // here through CSSOM, where env() survives verbatim (fallback 40px keeps
  // the headless/plain-tab mock sane), and pin the drag handles to the same
  // boundary.
  // Append explicitly: insertRule defaults to index 0 and would move the
  // variable rules away from their retained indices.
  const appendRule = (rule: string): void => {
    widthSheet.sheet!.insertRule(rule, widthSheet.sheet!.cssRules.length)
  }
  appendRule('body[data-dsh-genshin-impact] { --genshin-titlebar-height: 0px; }')
  appendRule('body[data-dsh-genshin-impact] [class*=\"frame\"][data-wco] { grid-template-rows: env(titlebar-area-height, 40px) 1fr; }')
  appendRule('body[data-dsh-genshin-impact] [class*=\"frame\"][data-desktop] { grid-template-rows: 32px 1fr; }')
  appendRule('body[data-dsh-genshin-impact] [class*=\"frame\"] [class*=\"handle\"] { top: var(--genshin-titlebar-height, 0px); }')

  const widthRule = widthSheet.sheet!.cssRules[0] as CSSStyleRule
  const titlebarRule = widthSheet.sheet!.cssRules[1] as CSSStyleRule
  const setRuleProperty = (rule: CSSStyleRule, name: string, value: string): void => {
    if (rule.style.getPropertyValue(name) !== value) rule.style.setProperty(name, value)
  }
  // The curtain is position:fixed, so it needs the viewport-space top of
  // the frame's title-bar row. Measuring the sidebar column (the row below
  // it) is authoritative: whatever the title-bar height is — WCO env(), the
  // desktop 32px row, or a scaled window — the curtain lands exactly on the
  // rendered boundary, never a pixel off.
  const measureTitlebarHeight = (): void => {
    const columns = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
    if (columns !== null) {
      const top = columns.getBoundingClientRect().top
      if (top > 0) {
        // Same-value CSSOM writes still invalidate the custom properties every
        // dependent (curtain translate, ::after centering, handles) reads back;
        // during a resize storm this pass runs per structural mutation, so a
        // redundant write forces one extra full layout for every other reader.
        setRuleProperty(titlebarRule, '--genshin-titlebar-height', `${top}px`)
        return
      }
    }
    // Desktop shell: fixed 32px row (columns not laid out yet).
    if (document.querySelector("[class*='frame'][data-desktop]") !== null) {
      setRuleProperty(titlebarRule, '--genshin-titlebar-height', '32px')
      return
    }
    setRuleProperty(titlebarRule, '--genshin-titlebar-height', '0px')
  }
  // `geometrychange` and every sidebar structural mutation can land in the same
  // frame, and each pass reads the column box (forcing layout) and then writes
  // CSSOM (invalidating it again). Coalesce them into one measure and one write
  // per frame; the first run stays synchronous so the curtain never starts a
  // frame without its offset.
  syncTitlebarHeight = (): void => {
    if (titlebarSyncFrame !== undefined) return
    titlebarSyncFrame = requestAnimationFrame(() => {
      titlebarSyncFrame = undefined
      measureTitlebarHeight()
    })
  }
  titlebarOverlay = navigator.windowControlsOverlay
  titlebarOverlay?.addEventListener('geometrychange', syncTitlebarHeight)
  measureTitlebarHeight()

  const applySidebarWidth = (width: number): void => {
    if (width <= 0) return
    const roundPx = (value: number): string => `${Math.round(value * 100) / 100}px`
    const nextSize = width <= 120 ? 'rail' : width <= 220 ? 'narrow' : 'wide'
    // ResizeObserver fires for height-only changes too; a same-value write of
    // --genshin-sidebar-width re-invalidates every dependent (character translate,
    // curtain translate, ::after centering) and forces a full style pass per
    // frame. Write only when a derived state actually moved.
    const compact = width <= 104
    if (roundPx(width) === widthRule.style.getPropertyValue('--genshin-sidebar-width')
      && body.dataset.genshinSidebarSize === nextSize
      && body.hasAttribute('data-genshin-sidebar-compact') === compact) {
      return
    }
    // The drawer animates this property frame by frame; the swag height and
    // the mascot width are derived from it in CSS, so one write moves every
    // dependent. Writing all three here cost three style invalidations per
    // frame for the same visual result.
    setRuleProperty(widthRule, '--genshin-sidebar-width', roundPx(width))
    if (body.dataset.genshinSidebarSize !== nextSize) body.dataset.genshinSidebarSize = nextSize
    if (body.hasAttribute('data-genshin-sidebar-compact') !== compact) {
      body.toggleAttribute('data-genshin-sidebar-compact', compact)
    }
  }

  const clearSidebarWidth = (): void => {
    setRuleProperty(widthRule, '--genshin-sidebar-width', '0px')
    if (body.dataset.genshinSidebarSize !== 'rail') body.dataset.genshinSidebarSize = 'rail'
    if (!body.hasAttribute('data-genshin-sidebar-compact')) {
      body.toggleAttribute('data-genshin-sidebar-compact', true)
    }
  }

  const syncProjectedState = (): void => {
    // A same-value attribute write is still a mutation record and still makes
    // every `body[...]`-prefixed rule re-match its whole subtree, so the
    // projection only writes the delta.
    const set = (attribute: string, active: boolean): void => {
      if (body.hasAttribute(attribute) !== active) body.toggleAttribute(attribute, active)
    }
    set(
      PROJECTED_STATE_ATTRIBUTES.activeChat,
      document.querySelector(ACTIVE_CHAT_SELECTOR) !== null,
    )
    set(
      PROJECTED_STATE_ATTRIBUTES.activeConversation,
      document.querySelector(ACTIVE_CONVERSATION_SELECTOR) !== null,
    )
    set(
      PROJECTED_STATE_ATTRIBUTES.workspace,
      document.querySelector(WORKSPACE_SELECTOR) !== null,
    )
    set(
      PROJECTED_STATE_ATTRIBUTES.cordisPanelOpen,
      document.querySelector(CORDIS_PANEL_SELECTOR) !== null,
    )
    set(
      PROJECTED_STATE_ATTRIBUTES.settingsOpen,
      document.querySelector(SETTINGS_DIALOG_SELECTOR) !== null,
    )
  }

  let observedChatArea: HTMLElement | undefined

  const ensureResizeObserved = (): void => {
    if (!resizeObserver) return
    const sidebar = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
    if (sidebar !== observedSidebar) {
      if (observedSidebar) resizeObserver.unobserve(observedSidebar)
      observedSidebar = sidebar ?? undefined
      if (sidebar) resizeObserver.observe(sidebar)
    }
    const chat = document.querySelector<HTMLElement>(CONVERSATION_COLUMN_SELECTOR)
    if (chat !== observedChatArea) {
      if (observedChatArea) resizeObserver.unobserve(observedChatArea)
      observedChatArea = chat ?? undefined
      if (chat) resizeObserver.observe(chat)
    }
  }

  /* rc.6 can mount its wide search and its outside-click listener during the
     rail button's own click. That same event then reaches document with the
     detached rail button as its target and immediately collapses the field.
     Re-enter the component through its wide search root after the slide has
     mounted; newer workspace builds already keep the wide field open, so the
     rail-only origin check makes this compatibility path inert there. */
  recoverRailSearchFocus = (event: MouseEvent): void => {
    const target = event.target instanceof Element
      ? event.target.closest<HTMLElement>("button[class*='searchButton']")
      : null
    const railSearch = target?.closest<HTMLElement>("[class*='search']")
    if (target === null || railSearch === null
      || railSearch.querySelector("input[class*='searchInput']") !== null) return

    if (railSearchFocusFrame !== undefined) cancelAnimationFrame(railSearchFocusFrame)
    const startedAt = performance.now()
    const recover = (): void => {
      railSearchFocusFrame = undefined
      const input = document.querySelector<HTMLInputElement>(
        `${SIDEBAR_COLUMN_SELECTOR} input[class*='searchInput']`,
      )
      const searchRoot = input?.closest<HTMLElement>("[class*='search']")
      if (input !== null && input !== undefined && searchRoot !== null && searchRoot !== undefined) {
        searchRoot.click()
        input.focus({ preventScroll: true })
        return
      }
      if (performance.now() - startedAt < 500) {
        railSearchFocusFrame = requestAnimationFrame(recover)
      }
    }
    railSearchFocusFrame = requestAnimationFrame(recover)
  }
  document.addEventListener('click', recoverRailSearchFocus)

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      // Sidebar entries drive the ornament width; conversation-area entries
      // drive the layout lease so genshin tracking re-tracks during any push
      // (right/bottom workbench panels) without transition lag.
      for (const entry of entries) {
        if (entry.target === observedSidebar) applySidebarWidth(entry.contentRect.width)
        else if (entry.target === observedChatArea) handleViewportResize?.()
      }
    })
  }

  const syncComposerMotion = (): void => {
    const phaseRoot = document.querySelector<HTMLElement>("[data-phase='hero'], [data-phase='active']")
    const next = phaseRoot?.dataset.phase
    if (next !== 'hero' && next !== 'active') return

    if (composerPhase !== undefined && composerPhase !== next) {
      body.dataset.genshinComposerMotion = next === 'active' ? 'dock' : 'rise'
      if (composerMotionTimer !== undefined) clearTimeout(composerMotionTimer)
      composerMotionTimer = setTimeout(() => {
        delete body.dataset.genshinComposerMotion
        composerMotionTimer = undefined
      }, 560)
    }
    composerPhase = next
  }

  /* The settings mask is mounted inside a promoted sidebar descendant. Chrome
     can omit sibling composited layers from that backdrop sample, so seat a
     copy of the existing frame immediately before the mask while it is open. */
  const syncSettingsBackdropFrame = (): void => {
    settingsNavigation.synchronize()
    const dialog = document.querySelector(SETTINGS_DIALOG_SELECTOR)
    const mask = dialog === null
      ? null
      : document.querySelector<HTMLElement>(SETTINGS_MASK_SELECTOR)
    const overlay = mask?.parentElement
    if (overlay === undefined || overlay === null) {
      settingsBackdropFrame?.remove()
      return
    }

    if (settingsBackdropFrame === undefined) {
      settingsBackdropFrame = createSidebarCorners()
      settingsBackdropFrame.dataset.genshinSettingsBackdropFrame = ''
      ownedNodes.add(settingsBackdropFrame)
    }
    if (settingsBackdropFrame.parentElement !== overlay) {
      overlay.insertBefore(settingsBackdropFrame, mask)
    }
  }

  const topTrim = document.createElement('div')
  topTrim.dataset.skinChrome = 'top-trim'
  topTrim.dataset.skinOwner = SKIN_OWNER
  topTrim.setAttribute('aria-hidden', 'true')
  const landingTrimLayer = document.createElement('div')
  landingTrimLayer.dataset.skinTrimLayer = 'landing'
  const workspaceTrimLayer = document.createElement('div')
  workspaceTrimLayer.dataset.skinTrimLayer = 'workspace'
  topTrim.append(landingTrimLayer, workspaceTrimLayer)
  ownedNodes.add(topTrim)

  const bottomTrim = document.createElement('div')
  bottomTrim.dataset.skinChrome = 'bottom-trim'
  bottomTrim.dataset.skinOwner = SKIN_OWNER
  bottomTrim.setAttribute('aria-hidden', 'true')
  ownedNodes.add(bottomTrim)

  decorateTitlebarBrand(ownedNodes)
  decorateSidebar(ownedNodes, decoratedElements)
  decorateWorkspaceTree(decoratedElements)
  ensureChatAreaStage(characterStage)
  ensureChatAreaChrome(topTrim, bottomTrim)
  ensureComposerLaceRail(composerLaceRail)
  ensureResizeObserved()
  const initialSidebar = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
  if (initialSidebar) applySidebarWidth(initialSidebar.getBoundingClientRect().width)
  syncComposerMotion()
  syncSettingsBackdropFrame()
  syncProjectedState()

  const syncSidebarDecorations = (): void => {
    syncTitlebarHeight?.()
    decorateTitlebarBrand(ownedNodes)
    decorateSidebar(ownedNodes, decoratedElements)
    decorateWorkspaceTree(decoratedElements)
    ensureChatAreaStage(characterStage)
    ensureChatAreaChrome(topTrim, bottomTrim)
    ensureResizeObserved()
    const sidebar = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
    if (sidebar === null) clearSidebarWidth()
    else if (resizeObserver === undefined) applySidebarWidth(sidebar.getBoundingClientRect().width)
  }

  const isSkinChrome = (node: Node): boolean => (
    node instanceof Element && node.getAttribute('data-skin-owner') === SKIN_OWNER
  )

  const nodeTouches = (node: Node, selector: string): boolean => (
    node instanceof Element && (node.matches(selector) || node.querySelector(selector) !== null)
  )
  const isConversationPhaseRoot = (element: Element | undefined): boolean => {
    if (!(element instanceof HTMLElement) || !element.hasAttribute('data-phase')) return false
    const scrollport = element.querySelector<HTMLElement>('[data-conversation-scroll]')
    return scrollport?.closest('[data-phase]') === element
  }
  const sidebarChromeSelector = `${SIDEBAR_COLUMN_SELECTOR}, [class*='titlebar']`
  const composerSelector = "[data-phase='hero'], [data-phase='active']"

  // ResizeObserver writes the animated width through CSSOM, so it never enters
  // this observer. Keep structural decoration in the MutationObserver checkpoint
  // before paint: delaying every change made the wide/rail hand-off visibly late.
  // Skin-owned insertions are ignored so decorating a React-owned node cannot
  // schedule a redundant whole-sidebar pass.
  observer = new MutationObserver((records) => {
    let sidebarStructureChanged = false
    let workspaceStateChanged = false
    let backdropChanged = false
    let composerChanged = false
    let chatStructureChanged = false
    let settingsStateChanged = false
    let projectedStateChanged = false
    for (const record of records) {
      const target = record.target instanceof Element ? record.target : undefined
      if (target?.closest(TERMINAL_SELECTOR) !== null) continue

      if (record.type === 'attributes') {
        const conversationPhaseChanged = record.attributeName === 'data-phase'
          && isConversationPhaseRoot(target)
        if (record.attributeName === 'aria-expanded'
          && target !== undefined
          && target.closest("[data-slot='sidebar.settings']") !== null) {
          settingsStateChanged = true
          projectedStateChanged = true
        } else if ((record.attributeName === 'aria-expanded' || record.attributeName === 'aria-selected')
          && target !== undefined && target.closest(SIDEBAR_COLUMN_SELECTOR) !== null) {
          workspaceStateChanged = true
        } else if (record.attributeName === 'data-ds-dark-theme' && record.target === body) {
          backdropChanged = true
        } else if (conversationPhaseChanged) {
          composerChanged = true
        }
        if (conversationPhaseChanged
          || record.attributeName === 'data-chat-flow'
          || record.attributeName === 'data-cordis-panel'
          || record.attributeName === 'data-slot'
          || record.attributeName === 'role') {
          projectedStateChanged = true
        }
        continue
      }
      const appNodes = [...record.addedNodes, ...record.removedNodes]
        .filter(node => node instanceof Element && !isSkinChrome(node))
      if (!sidebarStructureChanged && appNodes.length > 0
        && ((target !== undefined && target.closest(SIDEBAR_COLUMN_SELECTOR) !== null)
          || appNodes.some(node => nodeTouches(node, sidebarChromeSelector)))) {
        sidebarStructureChanged = true
      }
      if (!composerChanged && appNodes.length > 0
        && ((target !== undefined && target.closest(composerSelector) !== null)
          || appNodes.some(node => nodeTouches(node, composerSelector)))) {
        composerChanged = true
      }
      if (!chatStructureChanged && appNodes.length > 0
        && ((target !== undefined && target.closest(CONVERSATION_COLUMN_SELECTOR) !== null)
          || appNodes.some(node => nodeTouches(node, CONVERSATION_COLUMN_SELECTOR)))) {
        chatStructureChanged = true
      }
      // The settings mask is owned by this slot. Chat subtree replacements
      // cannot change it and must not scan their descendants for mask classes.
      if (!settingsStateChanged && appNodes.length > 0 && target !== undefined
        && target.closest("[data-slot='sidebar.settings']") !== null) {
        settingsStateChanged = true
      }
      if (!projectedStateChanged && appNodes.length > 0 && (appNodes.some(node => nodeTouches(node, PROJECTED_STATE_SELECTOR))
        || target?.matches("header, [data-slot='sidebar.settings']") === true)) {
        projectedStateChanged = true
      }
    }
    if (projectedStateChanged) syncProjectedState()
    if (sidebarStructureChanged) syncSidebarDecorations()
    else if (workspaceStateChanged) decorateWorkspaceTree(decoratedElements)
    if (!sidebarStructureChanged && chatStructureChanged) {
      ensureChatAreaStage(characterStage)
      ensureChatAreaChrome(topTrim, bottomTrim)
      ensureResizeObserved()
    }
    if (backdropChanged) syncBackdrop()
    if (composerChanged) {
      ensureComposerLaceRail(composerLaceRail)
      syncComposerMotion()
    }
    if (settingsStateChanged || projectedStateChanged) syncSettingsBackdropFrame()
  })
  observer.observe(body, {
    attributes: true,
    attributeFilter: [
      'aria-expanded',
      'aria-selected',
      'data-chat-flow',
      'data-cordis-panel',
      'data-ds-dark-theme',
      'data-phase',
      'data-slot',
      'role',
    ],
    childList: true,
    subtree: true,
  })

  installGenshinPageIcons(ctx)

  document.title = SKIN_TITLE
}
