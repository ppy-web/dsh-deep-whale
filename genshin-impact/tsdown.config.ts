import { clientBundle } from './build/tsdown.client.ts'

export default clientBundle('@ppy-web/dsh-client-ui-skin-genshin-impact', ['src/index.ts'], {
  portableCssModuleIds: true,
})
