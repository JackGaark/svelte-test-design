

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.CypB0oXk.js","_app/immutable/chunks/index.BzLGJncJ.js","_app/immutable/chunks/singletons.DvPYfcFk.js","_app/immutable/chunks/index.DhALg-Mm.js"];
export const stylesheets = [];
export const fonts = [];
