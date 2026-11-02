

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.Bi0AhxNr.js","_app/immutable/chunks/index.ne4DLkxx.js"];
export const stylesheets = [];
export const fonts = [];
