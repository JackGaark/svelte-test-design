

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.BY3SQDI6.js","_app/immutable/chunks/preload-helper.C1FmrZbK.js","_app/immutable/chunks/index.ne4DLkxx.js","_app/immutable/chunks/index.irswsPxi.js"];
export const stylesheets = ["_app/immutable/assets/2.CdakrKwz.css"];
export const fonts = ["_app/immutable/assets/Opposit-Medium.Bd1apkJg.otf"];
