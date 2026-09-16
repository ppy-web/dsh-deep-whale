import { beforeEach, describe, expect, it } from 'vitest'
import { apply } from '../src/client/index.ts'

describe('genshin-impact skin', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.title = 'Original'
  })

  it('mounts the elemental rail and restores owned state on disposal', () => {
    let dispose: (() => void) | undefined
    const ctx = {
      effect(effect: () => () => void): void {
        dispose = effect()
      },
    }

    apply(ctx as never)

    expect(document.body.hasAttribute('data-dsh-genshin-impact')).toBe(true)
    expect(document.querySelector('[data-skin-chrome="element-rail"]')).not.toBeNull()
    expect(document.querySelectorAll('[data-element]')).toHaveLength(4)
    expect(document.title).toBe('提瓦特旅者 · DeepSeek Harness')

    dispose?.()

    expect(document.body.hasAttribute('data-dsh-genshin-impact')).toBe(false)
    expect(document.querySelector('[data-skin-chrome="element-rail"]')).toBeNull()
    expect(document.title).toBe('Original')
  })
})
