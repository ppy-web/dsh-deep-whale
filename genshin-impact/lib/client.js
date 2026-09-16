window.__ModuleLoader__.load({
	id: "@ppy-web/dsh-client-ui-skin-genshin-impact",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0dsh-css:src/client/genshin-impact.module.css.mjs
		const css = "body[data-dsh-genshin-impact]{--genshin-jade:#4c9d8b;--genshin-jade-deep:#23665d;--genshin-amber:#d79a3e;--genshin-violet:#8b70c7;--genshin-ink:#24352f;--genshin-line:#395e5233;--genshin-surface:#f8faf5e6;--genshin-surface-strong:#fffffaf5;--genshin-shadow:0 16px 48px #25483e24;color-scheme:light;color:var(--genshin-ink);background:radial-gradient(circle at 78% 8%,#d79a3e2e,#0000 28%),radial-gradient(circle at 18% 92%,#4c9d8b29,#0000 30%),#f3f6ef}body[data-dsh-genshin-impact]:before{z-index:0;pointer-events:none;content:\"\";opacity:.26;background-image:linear-gradient(115deg,#0000 49.8%,#4c9d8b33 50%,#0000 50.2%),linear-gradient(25deg,#0000 49.8%,#d79a3e29 50%,#0000 50.2%);background-size:180px 180px,240px 240px;position:fixed;inset:0;mask-image:linear-gradient(#000,#0000 76%)}body[data-dsh-genshin-impact]:after{z-index:3;pointer-events:none;content:\"\";background:linear-gradient(90deg, var(--genshin-jade), var(--genshin-amber), var(--genshin-violet));height:3px;position:fixed;inset:0 0 auto;box-shadow:0 1px 12px #4c9d8b61}body[data-dsh-genshin-impact] [id=root]{background:0 0}body[data-dsh-genshin-impact] [data-slot=sidebar]{border-right:1px solid var(--genshin-line);background:linear-gradient(#ebf3ebf0,#f9faf5d6);box-shadow:10px 0 36px #3a665714}body[data-dsh-genshin-impact] [data-slot=sidebar] button:is(:hover,:focus-visible),body[data-dsh-genshin-impact] [data-slot=sidebar] [role=button]:is(:hover,:focus-visible){background:color-mix(in srgb, var(--genshin-jade) 12%, transparent)}body[data-dsh-genshin-impact] [data-slot=sidebar] [aria-current=true],body[data-dsh-genshin-impact] [data-slot=sidebar] [aria-selected=true]{color:var(--genshin-jade-deep);background:color-mix(in srgb, var(--genshin-jade) 17%, transparent);box-shadow:inset 3px 0 var(--genshin-jade)}body[data-dsh-genshin-impact] [data-slot=sidebar\\.settings],body[data-dsh-genshin-impact] [data-slot=\"sidebar.footer.action\"]{border-top-color:var(--genshin-line)}body[data-dsh-genshin-impact] [data-conversation-scroll],body[data-dsh-genshin-impact] [data-pane=conversation]{background:0 0}body[data-dsh-genshin-impact] [data-composer-card],body[data-dsh-genshin-impact] [role=dialog],body[data-dsh-genshin-impact] [data-slot=workspace-panel]{border-color:var(--genshin-line);background:var(--genshin-surface);box-shadow:var(--genshin-shadow)}body[data-dsh-genshin-impact] [data-composer-card]{border-top:2px solid var(--genshin-jade);box-shadow:0 -8px 30px #4c9d8b14, var(--genshin-shadow)}body[data-dsh-genshin-impact] textarea:focus,body[data-dsh-genshin-impact] input:focus,body[data-dsh-genshin-impact] [contenteditable=true]:focus{outline:2px solid color-mix(in srgb, var(--genshin-jade) 58%, transparent);outline-offset:2px}body[data-dsh-genshin-impact] button:is(:hover,:focus-visible),body[data-dsh-genshin-impact] [role=button]:is(:hover,:focus-visible){color:var(--genshin-jade-deep)}body[data-dsh-genshin-impact] [data-phase=active] :is(a,button)[aria-current=true]{color:var(--genshin-amber)}body[data-dsh-genshin-impact] [data-slot=sidebar] [class*=avatar]{box-shadow:0 0 0 2px var(--genshin-surface-strong), 0 0 0 3px var(--genshin-jade)}body[data-dsh-genshin-impact] [data-slot=sidebar\\.settings] [role=dialog]:before{border:1px solid color-mix(in srgb, var(--genshin-amber) 34%, transparent);pointer-events:none;content:\"\";border-radius:inherit;position:absolute;inset:12px}.y97p2a_elementRail{z-index:5;pointer-events:none;opacity:.82;letter-spacing:.08em;align-items:center;gap:6px;font:600 10px/1.1 ui-sans-serif,system-ui,sans-serif;display:flex;position:fixed;bottom:22px;right:18px}.y97p2a_elementNode{background:color-mix(in srgb, currentColor 10%, transparent);border:1px solid;border-radius:50%;place-items:center;width:22px;height:22px;display:grid;box-shadow:0 0 0 3px #fffffaa3,0 4px 14px #22413721}.y97p2a_elementAnemo{color:var(--genshin-jade)}.y97p2a_elementGeo{color:var(--genshin-amber)}.y97p2a_elementElectro{color:var(--genshin-violet)}.y97p2a_elementPyro{color:#c76d54}body[data-dsh-genshin-impact][data-ds-dark-theme]{--genshin-jade:#72cdb3;--genshin-jade-deep:#a8e8d2;--genshin-amber:#e8b65a;--genshin-violet:#b9a3f0;--genshin-ink:#e2eee8;--genshin-line:#90cbb538;--genshin-surface:#192623eb;--genshin-surface-strong:#1f2e2afa;--genshin-shadow:0 18px 58px #0000004d;color-scheme:dark;background:radial-gradient(circle at 78% 8%,#e8b65a24,#0000 28%),radial-gradient(circle at 18% 92%,#72cdb31f,#0000 30%),#16231f}body[data-dsh-genshin-impact][data-ds-dark-theme] [data-slot=sidebar]{background:linear-gradient(#152a25fa,#182320f2)}body[data-dsh-genshin-impact][data-ds-dark-theme] .y97p2a_elementNode{box-shadow:0 0 0 3px #16231fcc,0 4px 18px #00000042}@media (width<=900px){.y97p2a_elementRail{transform-origin:100% 100%;bottom:14px;right:12px;transform:scale(.88)}body[data-dsh-genshin-impact]:before{opacity:.16}}@media (prefers-reduced-motion:reduce){body[data-dsh-genshin-impact] *,body[data-dsh-genshin-impact] :before,body[data-dsh-genshin-impact] :after{scroll-behavior:auto!important;transition-duration:0s!important;animation-duration:0s!important;animation-iteration-count:1!important}}";
		const tagId = "@ppy-web/dsh-client-ui-skin-genshin-impact/genshin-impact.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@ppy-web/dsh-client-ui-skin-genshin-impact";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var genshin_impact_module_css_default = {
			"elementAnemo": "y97p2a_elementAnemo",
			"elementElectro": "y97p2a_elementElectro",
			"elementGeo": "y97p2a_elementGeo",
			"elementNode": "y97p2a_elementNode",
			"elementPyro": "y97p2a_elementPyro",
			"elementRail": "y97p2a_elementRail"
		};
		//#endregion
		//#region src/client/index.ts
		const SKIN_TITLE = "提瓦特旅者 · DeepSeek Harness";
		const BODY_ATTRIBUTE = "data-dsh-genshin-impact";
		const OWNER_ATTRIBUTE = "data-genshin-impact-owned";
		const cls = (name) => genshin_impact_module_css_default[name] ?? "";
		function createElementRail() {
			const rail = document.createElement("div");
			rail.className = cls("elementRail");
			rail.dataset.skinChrome = "element-rail";
			rail.setAttribute(OWNER_ATTRIBUTE, "");
			rail.setAttribute("aria-hidden", "true");
			for (const [element, label] of [
				["anemo", "风"],
				["geo", "岩"],
				["electro", "雷"],
				["pyro", "火"]
			]) {
				const node = document.createElement("span");
				const className = `element${element[0].toUpperCase()}${element.slice(1)}`;
				node.className = `${cls("elementNode")} ${cls(className)}`;
				node.dataset.element = element;
				node.textContent = label;
				rail.append(node);
			}
			return rail;
		}
		function apply(ctx) {
			const body = document.body;
			const originalTitle = document.title;
			const hadBodyAttribute = body.hasAttribute(BODY_ATTRIBUTE);
			const rail = createElementRail();
			body.setAttribute(BODY_ATTRIBUTE, "");
			body.append(rail);
			document.title = SKIN_TITLE;
			ctx.effect(() => () => {
				rail.remove();
				if (hadBodyAttribute) body.setAttribute(BODY_ATTRIBUTE, "");
				else body.removeAttribute(BODY_ATTRIBUTE);
				if (document.title === SKIN_TITLE) document.title = originalTitle;
			}, "ui-skin-genshin-impact: elemental chrome");
		}
		//#endregion
		exports.apply = apply;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map