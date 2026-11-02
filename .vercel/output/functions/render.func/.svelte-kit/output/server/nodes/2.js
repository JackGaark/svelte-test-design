

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.Bme593qC.js","_app/immutable/chunks/preload-helper.C1FmrZbK.js","_app/immutable/chunks/index.BzLGJncJ.js","_app/immutable/chunks/index.DhALg-Mm.js"];
export const stylesheets = ["_app/immutable/assets/2.B4MhqWhO.css"];
export const fonts = ["_app/immutable/assets/Opposit-Medium.Bd1apkJg.otf"];
