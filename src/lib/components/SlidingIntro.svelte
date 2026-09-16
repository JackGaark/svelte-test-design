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
  let draggingZoom = false;
  $: scale = Math.max(width, 720) / 1440;
  // The Figma middle view repeats its three-row pattern down the page.
  const middleCards = Array.from({ length: 4 }, (_, repeat) =>
    introLayouts[1].map((card, index) => ({
      ...card,
      id: repeat * introLayouts[1].length + index,
      y: card.y + repeat * 720
    }))
  ).flat();
  const availableMiddleCards = [...middleCards];
  const smallToMiddle = introLayouts[0].map((small) => {
    const match = availableMiddleCards.findIndex((card) => card.asset === small.asset);
    return availableMiddleCards.splice(match, 1)[0];
  });
  $: progress = Math.min($animatedZoom / 50, 1);
  $: largeProgress = Math.max(0, ($animatedZoom - 50) / 50);
  $: description =
    zoom < 25 ? 'Dense overview' : zoom < 75 ? 'Medium gallery' : 'Large horizontal gallery';
  const mix = (a, b, t) => a + (b - a) * t;
  $: cards = ($animatedZoom < 50 && zoom < 50
    ? smallToMiddle
    : zoom === 50
    ? middleCards
    : middleCards.slice(0, introLayouts[2].length)).map((middle, index) => {
      const small = $animatedZoom < 50 ? introLayouts[0][index] || middle : middle;
      const large = introLayouts[2][index] || middle;
      return {
        ...middle,
        x: mix(mix(small.x, middle.x, progress), large.x, largeProgress),
        y: mix(mix(small.y, middle.y, progress), large.y, largeProgress),
        w: mix(mix(small.w, middle.w, progress), large.w, largeProgress),
        h: mix(mix(small.h, middle.h, progress), large.h, largeProgress)
      };
    });
  $: canvasWidth = Math.max(1440, ...cards.map((c) => c.x + c.w + 84));
  $: canvasHeight = Math.max(880, ...cards.map((c) => c.y + c.h + 77));

  function updateZoom(event) {
    const value = Number(event.currentTarget.value);
    zoom = draggingZoom
      ? Math.abs(value - 50) <= 6
        ? 50
        : value >= 94
        ? 100
        : value
      : value;
    event.currentTarget.value = String(zoom);
    if (scroller) {
      scroller.scrollLeft = 0;
      scroller.scrollTop = 0;
    }
  }

  function handleGalleryWheel(event) {
    if (zoom !== 100 || !scroller || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();
    scroller.scrollLeft += event.deltaY;
  }
</script>

<svelte:window
  on:pointerup={() => (draggingZoom = false)}
  on:pointercancel={() => (draggingZoom = false)}
/>

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
        value={zoom}
        on:input={updateZoom}
        on:pointerdown={() => (draggingZoom = true)}
        aria-label="Image size"
        aria-valuetext={description}
      />
    </div>
    <div
      class="gallery-scroll"
      class:vertical={zoom === 50}
      class:horizontal={zoom === 100}
      bind:this={scroller}
      on:wheel|nonpassive={handleGalleryWheel}
    >
      <div class="canvas" style={`width:${canvasWidth * scale}px;height:${canvasHeight * scale}px;`}>
        {#each cards as card (card.id)}
          <button
            class="image-card"
            style={`left:${card.x * scale}px;top:${card.y * scale}px;width:${
              card.w * scale
            }px;--caption-size:${mix(mix(3, 6, progress), 12, largeProgress) * scale}px;`}
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
  .gallery-scroll.vertical {
    height: 100vh;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior-y: contain;
  }
  .gallery-scroll.horizontal {
    overflow-x: auto;
    overflow-y: hidden;
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
