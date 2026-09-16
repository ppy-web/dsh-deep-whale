import { beforeEach, describe, expect, it } from 'vitest'
import { apply } from '../src/client/index.ts'

describe('genshin-impact skin', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.title = 'Original'
  })

  it('mounts layered chrome and restores owned state on disposal', () => {
    document.body.innerHTML = '<main data-pane="conversation"><div data-composer-card></div></main>'
    const disposers: Array<() => void> = []
    const ctx = {
      effect(effect: () => () => void): void {
        disposers.push(effect())
      },
    }

    apply(ctx as never)

    expect(document.body.hasAttribute('data-dsh-genshin-impact')).toBe(true)
    expect(document.querySelector('[data-skin-chrome="character-stage"]')).not.toBeNull()
    expect(document.querySelector('[data-skin-chrome="top-trim"]')).not.toBeNull()
    expect(document.querySelector('[data-skin-chrome="bottom-trim"]')).not.toBeNull()
    expect(document.title).toBe('提瓦特旅者 · DeepSeek Harness')

    disposers.reverse().forEach(dispose => dispose())

    expect(document.body.hasAttribute('data-dsh-genshin-impact')).toBe(false)
    expect(document.querySelector('[data-skin-chrome]')).toBeNull()
    expect(document.title).toBe('Original')
  })
})
