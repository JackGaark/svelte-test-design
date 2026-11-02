

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.CqpMLW0u.js","_app/immutable/chunks/index.ne4DLkxx.js","_app/immutable/chunks/singletons.lRNByp6p.js","_app/immutable/chunks/index.irswsPxi.js"];
export const stylesheets = [];
export const fonts = [];
