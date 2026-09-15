<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { introLayouts } from './intro-layouts';
  import { _ } from 'svelte-i18n';
  import ProjectIndex from './ProjectIndex.svelte';

  export let zoom = 0;
  export let projects = [];
  export let studioOpen = false;
  let view = 'work';
  let reducedMotion = true;
  const animatedZoom = tweened(zoom);
  onMount(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      reducedMotion = preference.matches;
    };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  });
  $: animatedZoom.set(zoom, { duration: reducedMotion ? 0 : 160, easing: cubicOut });
  const dispatch = createEventDispatcher();
  const projectIds = [14, 3, 8, 7, 0, 13];
  const clients = [
    'DAVIDs TEA',
    'Herschel Supply',
    'Kombi Canada',
    'Rise Kombucha',
    'Herschel Supply',
    'Super Bonjour'
  ];
  let width = 1440;
  let scroller;
  $: scale = Math.max(width, 720) / 1440;
  $: segment = $animatedZoom <= 50 ? 0 : 1;
  $: progress = segment === 0 ? $animatedZoom / 50 : ($animatedZoom - 50) / 50;
  $: description =
    zoom < 25 ? 'Dense overview' : zoom < 75 ? 'Medium gallery' : 'Large horizontal gallery';
  const mix = (a, b, t) => a + (b - a) * t;
  $: cards = introLayouts[segment].map((from) => {
    const to = introLayouts[segment + 1].find((item) => item.id === from.id);
    return {
      ...from,
      x: mix(from.x, to?.x ?? from.x, progress),
      y: mix(from.y, to?.y ?? from.y, progress),
      w: mix(from.w, to?.w ?? from.w, progress),
      h: mix(from.h, to?.h ?? from.h, progress),
      opacity: to ? 1 : 1 - progress,
      visible: !!to || progress < 0.8
    };
  });
  $: canvasWidth = Math.max(1440, ...cards.filter((c) => c.visible).map((c) => c.x + c.w + 84));

  function updateZoom() {
    // Return to the start of the strip when changing magnification.
    if (scroller) scroller.scrollLeft = 0;
  }
</script>

<section class="intro" aria-label="Selected work" bind:clientWidth={width}>
  <div class="guide-vertical" aria-hidden="true" />
  <div class="guide-horizontal" aria-hidden="true" />
  <header class="intro-header">
    <button
      class="home-logo"
      aria-label="Super Bonjour home"
      on:click={() => {
        view = 'work';
        dispatch('closestudio');
      }}
    >
      <img src="/images/intro/logo.png" width="44" height="18" alt="Super Bonjour" />
    </button>
    <nav aria-label="Homepage views">
      <button
        class:active={!studioOpen && view === 'work'}
        aria-pressed={!studioOpen && view === 'work'}
        on:click={() => {
          view = 'work';
          dispatch('closestudio');
        }}>WORK</button
      >
      <button
        class:active={!studioOpen && view === 'index'}
        aria-pressed={!studioOpen && view === 'index'}
        on:click={() => {
          view = 'index';
          dispatch('closestudio');
        }}>INDEX</button
      >
      <button
        class:active={studioOpen}
        aria-pressed={studioOpen}
        on:click={() => dispatch('studio')}>STUDIO</button
      >
    </nav>
  </header>
  {#if view === 'work'}
    <div class="control">
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        bind:value={zoom}
        on:input={updateZoom}
        aria-label="Image size"
        aria-valuetext={description}
      />
    </div>
    <div class="gallery-scroll" bind:this={scroller}>
      <div class="canvas" style={`width:${canvasWidth * scale}px;height:${880 * scale}px;`}>
        {#each cards as card (card.id)}
          <button
            class="image-card"
            style={`left:${card.x * scale}px;top:${card.y * scale}px;width:${
              card.w * scale
            }px;opacity:${card.opacity};pointer-events:${
              card.visible ? 'auto' : 'none'
            };--caption-size:${
              mix(segment === 0 ? 3 : 6, segment === 0 ? 6 : 12, progress) * scale
            }px;`}
            tabindex={card.visible ? 0 : -1}
            aria-hidden={!card.visible}
            aria-label={`View ${$_('slider.' + (projectIds[card.asset] + 1) + '.title').replace(
              /\s*—\s*$/,
              ''
            )}`}
            on:click={() => dispatch('select', projectIds[card.asset])}
          >
            <img
              src={`/images/intro/image-${card.asset}.jpg`}
              alt=""
              draggable="false"
              style={`height:${card.h * scale}px;`}
            />
            <span class="caption">
              <span
                >{$_('slider.' + (projectIds[card.asset] + 1) + '.title').replace(/\s*—\s*$/, '')}
                {$_('slider.' + (projectIds[card.asset] + 1) + '.title2')}</span
              >
              <span>{clients[card.asset]}</span>
              <span>{$_('slider.' + (projectIds[card.asset] + 1) + '.title2')}</span>
            </span>
          </button>
        {/each}
      </div>
    </div>
    <button class="enter" on:click={() => dispatch('select', 0)}>View projects →</button>
  {:else}
    <ProjectIndex {projects} on:select />
  {/if}
</section>

<style>
  .guide-vertical,
  .guide-horizontal {
    position: fixed;
    z-index: 10;
    background: #ff0000;
    pointer-events: none;
  }
  .guide-vertical {
    top: 0;
    bottom: 0;
    left: 74.26px;
    width: 1px;
  }
  .guide-horizontal {
    top: 38.07px;
    left: 0;
    right: 0;
    height: 1px;
  }
  .intro-header {
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    z-index: 3;
    height: 18px;
  }
  .intro-header button {
    padding: 0;
    margin: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    cursor: pointer;
  }
  .home-logo {
    position: absolute;
    left: 74px;
    top: 0;
    width: 44px;
    height: 18px;
  }
  .home-logo img {
    display: block;
    width: 44px;
    height: 18px;
    object-fit: contain;
  }
  nav {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }
  nav button {
    font-family: roc-grotesk, sans-serif;
    font-size: 10px;
    font-weight: 500;
    line-height: 12px;
    color: #000;
  }
  nav button.active {
    color: #bd62ff;
  }
  .intro-header button:focus-visible {
    outline: 2px solid #bd62ff;
    outline-offset: 5px;
  }
  .intro {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: white;
    color: #000;
  }
  .control {
    position: absolute;
    top: max(46px, 3.1vw);
    left: 5.15%;
    right: 5.85%;
    z-index: 2;
  }
  input {
    display: block;
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    height: 35px;
    padding: 0;
    margin: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    cursor: ew-resize;
  }
  input::-webkit-slider-runnable-track {
    height: 1px;
    background: #000;
  }
  input::-moz-range-track {
    height: 1px;
    background: #000;
  }
  input::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 35px;
    height: 35px;
    margin-top: -17px;
    border: 0;
    border-radius: 50%;
    background: #bd62ff;
  }
  input::-moz-range-thumb {
    width: 35px;
    height: 35px;
    border: 0;
    border-radius: 50%;
    background: #bd62ff;
  }
  input:focus-visible {
    outline: 2px solid #bd62ff;
    outline-offset: 5px;
  }
  .gallery-scroll {
    padding-top: max(0px, calc(90px - 7.85vw));
    overflow: auto;
    overscroll-behavior-x: contain;
  }
  .canvas {
    position: relative;
  }
  .image-card {
    position: absolute;
    display: block;
    padding: 0;
    margin: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: black;
    text-align: left;
    cursor: pointer;
  }
  .image-card img {
    display: block;
    width: 100%;
    object-fit: cover;
  }
  .caption {
    display: block;
    margin-top: 5px;
    font-family: roc-grotesk, sans-serif;
    font-weight: 300;
    font-size: var(--caption-size);
    line-height: 1;
    color: #000;
  }
  .caption > span {
    display: block;
  }
  .image-card:hover,
  .image-card:active {
    background: transparent;
  }
  .image-card:focus-visible {
    outline: 2px solid #bd62ff;
    outline-offset: 5px;
  }
  .enter {
    display: block;
    margin: 0 5.85% 24px auto;
    padding: 10px 0;
    border: 0;
    background: transparent;
    color: #000;
    font-family: 'Opposit-Medium';
    cursor: pointer;
  }
  .enter:focus-visible {
    outline: 2px solid #bd62ff;
  }
  @media (max-width: 720px) {
    .control {
      top: 46px;
    }
    input::-webkit-slider-thumb {
      width: 25px;
      height: 25px;
      margin-top: -12px;
    }
    input::-moz-range-thumb {
      width: 25px;
      height: 25px;
    }
    .caption {
      font-size: max(6px, var(--caption-size));
    }
  }
</style>
