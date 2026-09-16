# 提瓦特旅者 · Teyvat Traveler

一套受《原神》提瓦特世界与元素徽记启发的 DeepSeek Harness Web GUI 皮肤。它复用了 `maid-atelier` 已验证的舞台、侧栏、输入区、设置导航、移动端抽屉和生命周期实现，再换成翡翠自然、琥珀星图与雷紫信号的主题语言。

本包只包含原创的提瓦特灵感视觉素材，不包含《原神》角色、游戏原画、商标或外部网络资源。场景、旅者与元素灯饰素材由本项目生成并随包固化；项目代码与视觉装饰采用 MIT。

## 安装

在本仓库根目录执行：

```powershell
dsh plugin --profile web add 'E:/personal/Dsh/dsh-deep-whale-work/genshin-impact'
```

也可以使用 GitHub 子目录依赖：

```powershell
dsh plugin --profile web add 'github:ppy-web/dsh-deep-whale#path:/genshin-impact'
```

皮肤与其他皮肤互斥。安装 `skin-manager` 后，在「设置 → 皮肤管理」切换到「提瓦特旅者」。

## 视觉方向

- 亮色：玉绿色表面、琥珀高光与植物纹理背景。
- 暗色：深森林底色、薄荷玉光与紫色元素信号。
- 右下角四元素徽记只承担装饰作用，`pointer-events: none`，不会遮挡宿主控件。
- `prefers-reduced-motion: reduce` 下关闭皮肤引入的过渡与动画。

## 素材说明

`assets/` 中的 PNG 是本主题的原创生成素材，`src/client/asset-urls.ts` 由构建脚本编码为内联 data URL，因此运行时不请求外部图片。重新生成/打包前执行 `npm run build` 即可同步素材模块。
