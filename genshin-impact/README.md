# 提瓦特旅者 · Teyvat Traveler

一套受《原神》提瓦特世界与元素徽记启发的 DeepSeek Harness Web GUI 皮肤。它使用翡翠自然、琥珀星图与雷紫信号重绘界面骨架，亮暗主题均保留原生控件、对话流和无障碍语义。

本包只包含原创的抽象元素视觉，不包含《原神》角色、游戏原画、商标或外部网络资源。项目代码采用 MIT；本包内的 SVG 预览属于原创代码视觉，同样采用 MIT。

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
