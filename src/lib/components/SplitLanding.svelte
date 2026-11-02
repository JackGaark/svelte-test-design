<script>
  import { onMount, createEventDispatcher } from 'svelte';
  
  export let studioOpen = false;
  const dispatch = createEventDispatcher();
  const view = 'work';
  let touchStart = 0;
  let entering = false;
  function enter() { if (!studioOpen && !entering) { entering = true; dispatch('enter'); } }
  // Reference: 10 fps, alternating cuts; each panel changes at 5 Hz.
  const CUT_INTERVAL_MS = 100;
  let current = 0;
  let bottomCurrent = 0;
  let phase = 0;
  let paused = false;
  let reduced = false;
  let hidden = false;
  const videoElements = new Set();
  let failed = false;
  const image = (file, alt, project = 11, position = '50% 50%') => ({ src: `/images/${file}.jpg`, alt, project, position });
  const video = (file, poster, project) => ({ src: `/videos/${file}.mp4`, type: 'video', poster: `/images/${poster}.jpg`, project, position: '50% 50%' });
  const pairs = [
    { title: 'Fable Home', category: 'Campaign direction · Still life', top: video('Fable_6', '01_details_matter', 2), bottom: image('01_lay_the_table-03', 'Sunlit Fable tableware on a warm ochre table', 2) },
    { title: 'Call It Spring / Kit & Ace', category: 'Art direction · Photography', top: image('01-sb_cis_7', 'A model holding a sculpted bust against blue tile', 11, '50% 38%'), bottom: image('05-sb_ka_1', 'Kit & Ace campaign with architectural forms and blue knitwear', 11, '50% 42%') },
    { title: 'Nike / Little Burgundy', category: 'Campaign direction · Film', top: video('NIKE_6', '06-sb_cis_2', 9), bottom: video('LB_2_2v', '11-sb_2', 6) },
    { title: 'Fable Home', category: 'Art direction · Photography', top: image('01_details_matter', 'Light reflecting on polished Fable cutlery', 2), bottom: image('04_lay_the_table-04', 'Ceramics and fruit on a pink tablecloth', 2) },
    { title: 'ALDO / Rise', category: 'Campaign direction · Photography', top: image('02-sb_aldo2', 'ALDO fashion portraits with sunglasses and black dresses', 11, '50% 35%'), bottom: image('04-sb_rise_1b', 'Fashion editorial against pale sky and textured stone', 7, '50% 42%') },
    { title: 'Nine Point', category: 'Branding · Film', top: video('NP_3', '12-sb-berlinb', 4), bottom: video('NP_4', '08-sb-boxts', 4) },
    { title: 'Fable Home', category: 'Campaign direction · Still life', top: image('03_back_in_stock', 'Stacked ceramic bowls in warm natural light', 2), bottom: image('05_come_together-02', 'A composition of Fable plates and bowls', 2) },
    { title: 'Call It Spring', category: 'Art direction · Campaign', top: image('06-sb_cis_2', 'Two models resting on colorful exercise mats', 11), bottom: image('07-sb_cis_3', 'Portrait against vivid pink flowers', 11, '50% 65%') },
    { title: 'Studio selections', category: 'Design · Identity', top: image('08-sb-boxts', 'Burgundy T-shirt with illustrated basketball graphics', 11), bottom: image('18-sb-denisets', 'Purple and yellow illustrated Denise shirts', 11) },
    { title: 'DAVIDs TEA / Fable Home', category: 'Campaign direction · Film & photography', top: video('DT_2', '06_shot_so_fresh', 17), bottom: image('06_shot_so_fresh', 'Fable ceramics submerged in sparkling water', 2) },
    { title: 'Kit & Ace / Call It Spring', category: 'Art direction · Photography', top: image('09-sb_ka_3', 'Sunlit campaign portraits against sky and a winding road', 11, '50% 35%'), bottom: image('10-sb_4', 'A swimmer floating in a bright blue pool', 11) },
    { title: 'Little Burgundy / Call It Spring', category: 'Campaign direction · Photography', top: image('11-sb_2', 'Fashion portraits in front of an oversized pretzel mural', 6, '50% 40%'), bottom: image('14-sb_cis_6', 'Portrait reflected in a car mirror in a desert landscape', 11) },
    { title: 'Studio selections', category: 'Design · Art direction', top: image('12-sb-berlinb', 'Blue illustrated bottles and Berlin Weiss typography', 11), bottom: image('20-sb-rentree4', 'Pink, lime and olive exhibition posters', 11) },
    { title: 'Rise / Call It Spring', category: 'Art direction · Photography', top: image('13-sb_rise_4b', 'Fashion editorial with metallic fabric and blue nails', 7), bottom: image('19-sb_cis_9b', 'Model in yellow on a typographic playground', 11) },
    { title: 'Call It Spring', category: 'Campaign direction · Photography', top: image('16-sb_boy_1', 'Playful fashion portraits in animal costumes', 11), bottom: image('17-sb_cis_5', 'Model posing beneath a giant green dinosaur', 11, '50% 60%') },
    { title: 'Call It Spring / Rise', category: 'Art direction · Photography', top: image('21-sb_cis_8', 'Red beret portrait paired with a streetwear photograph', 11, '50% 35%'), bottom: image('22-sb_rise_3', 'Fashion compositions using bright red studio backdrops', 7, '50% 35%') },
    { title: 'Studio selections', category: 'Design · Campaign direction', top: image('23-sb-aluminium3', 'Aluminium design publication on vivid red fabric', 11), bottom: image('24-sb_cis_10', 'Model against a multicolored striped wall', 11) }
  ];
  $: pair = pairs[current];
  $: running = !paused && !hidden && !studioOpen && view === 'work';
  function syncPlayback(element, play) {
    element.muted = true;
    if (play) element.play().catch((error) => { if (error.name !== 'AbortError') failed = true; });
    else element.pause();
  }
  function controlPlayback(element, state) {
    videoElements.add(element);
    let latest = state;
    const apply = () => syncPlayback(element, latest.active && latest.play);
    element.addEventListener('canplay', apply);
    apply();
    return {
      update(next) { latest = next; apply(); },
      destroy() { element.removeEventListener('canplay', apply); element.pause(); videoElements.delete(element); }
    };
  }
  function advance(direction) {
    current = (current + direction + pairs.length) % pairs.length;
    bottomCurrent = current;
    phase = 0;
    failed = false;
  }
  function togglePlayback() {
    if (failed) { failed = false; paused = false; for (const element of videoElements) { if (element.dataset.active === 'true') syncPlayback(element, true); } }
    else paused = !paused;
  }
  
  onMount(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => { reduced = query.matches; paused = reduced; };
    const updateVisibility = () => { hidden = document.hidden; };
    updateMotion(); updateVisibility();
    query.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    const timer = window.setInterval(() => {
      if (!running) return;
      // Bottom cuts first, then top, matching the reference's 100 ms offset.
      if (phase % 2 === 0) bottomCurrent = (bottomCurrent + 1) % pairs.length;
      else current = (current + 1) % pairs.length;
      phase += 1;
    }, CUT_INTERVAL_MS);
    return () => { clearInterval(timer); query.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); };
  });
</script>

<svelte:window on:keydown={(event) => {
  if (view !== 'work' || studioOpen || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
  if (event.key === 'ArrowRight') advance(1);
  if (event.key === 'ArrowLeft') advance(-1);
}} />

<div class="landing" on:wheel|passive={(event) => { if (event.deltaY > 45) enter(); }}
  on:touchstart|passive={(event) => { touchStart = event.touches[0].clientY; }}
  on:touchend|passive={(event) => { if (touchStart - event.changedTouches[0].clientY > 65) enter(); }}>
  <header>
    <button class="wordmark" aria-label="Super Bonjour home" on:click={enter}>SUPER<br />BONJOUR</button>
    <nav aria-label="Main navigation">
      <button class:active={view === 'work'} aria-current={view === 'work' ? 'page' : undefined} on:click={enter}>Work</button>
      <button on:click={enter}>Enter site ↗</button>
      <button on:click={() => dispatch('studio')}>Studio ↗</button>
    </nav>
    <a class="hello" href="mailto:salut@superbonjour.com">Say bonjour ↗</a>
  </header>


    <main class="stage" aria-label="Selected creative work">
      <div class="panel top">
        {#each pairs as item, index}
          {#if item.top.type === 'video'}
            <video src={item.top.src} poster={item.top.poster} muted playsinline loop preload="auto"
              class:visible={index === current} aria-hidden={index !== current} data-active={index === current}
              style:object-position={item.top.position}
              use:controlPlayback={{ active: index === current, play: running }}
              aria-label={`${item.title} film`} />
          {:else}
            <img src={item.top.src} alt={item.top.alt} class:visible={index === current}
              aria-hidden={index !== current} style:object-position={item.top.position} />
          {/if}
        {/each}
      </div>
      <div class="panel bottom">
        {#each pairs as item, index}
          {#if item.bottom.type === 'video'}
            <video src={item.bottom.src} poster={item.bottom.poster} muted playsinline loop preload="auto"
              class:visible={index === bottomCurrent} aria-hidden={index !== bottomCurrent} data-active={index === bottomCurrent}
              style:object-position={item.bottom.position}
              use:controlPlayback={{ active: index === bottomCurrent, play: running }}
              aria-label={`${item.title} film`} />
          {:else}
            <img src={item.bottom.src} alt={item.bottom.alt} class:visible={index === bottomCurrent}
              aria-hidden={index !== bottomCurrent} style:object-position={item.bottom.position} />
          {/if}
        {/each}
      </div>
      <div class="seam" aria-hidden="true"></div>
      <div class="identity">
        <p>Independent creative studio<br />Strategy, branding & content</p>
        <h1><img src="/images/00-sb-logo-simple-white.svg" alt="Super Bonjour" width="500" height="214" /></h1>
        <a href="mailto:salut@superbonjour.com">salut@superbonjour.com</a>
        <a href="https://www.instagram.com/super_bonjour/" target="_blank" rel="noreferrer">@super_bonjour ↗</a>
      </div>
      <span class="corner top-left">A considered point of view.</span>
      <span class="corner top-right">Independent by design.</span>
      <div class="caption"><span>{pair.title}</span><span>{pair.category}</span></div>
      <button class="explore" on:click={enter}>Enter site ↗</button>
    </main>
    <footer>
      <button class="edition" on:click={enter}>Scroll to explore ↓</button>
      <div class="sequence" aria-label="Media navigation">
        <button aria-label="Previous media pair" on:click={() => advance(-1)}>←</button>
        <span class="count">{String(current + 1).padStart(2, '0')} <span>/ {String(pairs.length).padStart(2, '0')}</span></span>
        <button aria-label="Next media pair" on:click={() => advance(1)}>→</button>
      </div>
      <button class="playback" on:click={togglePlayback} aria-label={paused || failed ? 'Play media and sequence' : 'Pause media and sequence'}>{paused || failed ? '▶ Play' : 'Ⅱ Pause'}</button>
    </footer>
</div>

<style>
  .landing { --paper: #edeae2; background: var(--paper); height: 100svh; min-height: 520px; box-sizing: border-box; padding: 0 3.4vw; display: flex; flex-direction: column; color: #26261f; }
  .landing button, .landing a { font-family: 'Opposit-Medium', Arial, sans-serif; color: inherit; font-size: 11px; font-weight: 400; letter-spacing: .015em; }
  .landing button { border: 0; border-radius: 0; background: transparent; padding: 9px 0; margin: 0; cursor: pointer; }
  .landing button:hover, .landing a:hover { opacity: .65; }
  .landing button:focus-visible, .landing a:focus-visible { outline: 2px solid currentColor; outline-offset: 5px; }
  header { height: 84px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; position: relative; }
  header .wordmark { font-size: 10px; line-height: .98; letter-spacing: -.04em; text-align: left; }
  nav { position: absolute; left: 50%; transform: translateX(-50%); display: flex; gap: 28px; }
  nav button { position: relative; }
  nav .active::after { content: ''; position: absolute; bottom: 2px; left: 0; right: 0; height: 1px; background: currentColor; }
  .stage { position: relative; flex: 1; min-height: 0; display: grid; grid-template-rows: minmax(0, 1fr) minmax(0, 1fr); isolation: isolate; background: #4b4438; }
  .panel { overflow: hidden; min-height: 0; position: relative; }
  .panel > img, .panel > video { position: absolute; inset: 0; visibility: hidden; width: 100%; height: 100%; object-fit: cover; display: block; }
  .panel > .visible { visibility: visible; }
  .panel::after { content: ''; position: absolute; inset: 0; background: #00000015; pointer-events: none; }
  .seam { position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #edeae285; z-index: 1; }
  .identity { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; color: #fffdf4; text-align: center; display: flex; flex-direction: column; align-items: center; width: 290px; text-shadow: 0 1px 8px #0008; }
  .identity::before { content: ''; position: absolute; inset: -26px -38px; background: #0002; filter: blur(25px); z-index: -1; pointer-events: none; }
  .identity p { margin: 0 0 19px; font-family: Georgia, serif; font-size: 14px; line-height: 1.25; }
  h1 { margin: 0 0 19px; line-height: 0; }
  h1 img { width: 180px; height: auto; filter: drop-shadow(0 1px 5px #0004); }
  .identity a { color: #fffdf4; font-family: Georgia, serif; font-size: 12px; line-height: 1.35; }
  .corner { position: absolute; top: 23px; color: #fffdf4; font-size: 10px; font-family: 'Opposit-Medium', sans-serif; text-shadow: 0 1px 5px #0009; }
  .top-left { left: 25px; } .top-right { right: 25px; }
  .caption { position: absolute; bottom: 24px; left: 25px; display: flex; flex-direction: column; gap: 4px; color: #fffdf4; font-family: 'Opposit-Medium', sans-serif; font-size: 12px; text-shadow: 0 1px 5px #0009; }
  .caption span + span { font-family: Georgia, serif; font-size: 12px; }
  .stage .explore { position: absolute; right: 25px; bottom: 19px; color: #fffdf4; text-shadow: 0 1px 5px #0009; }
  footer { height: 70px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; font-family: 'Opposit-Medium', sans-serif; font-size: 10px; position: relative; }
  .dash { margin: 0 12px; } .sequence { position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 24px; }
  .sequence button { padding: 10px; font-size: 18px; } .count { font-size: 11px; font-variant-numeric: tabular-nums; } .count span { opacity: .45; margin-left: 7px; }

  @media (max-width: 600px) {
    .landing { padding: 0 16px; min-height: 500px; }
    header { height: 66px; } nav { gap: 18px; left: auto; right: 0; transform: none; } .hello { display: none; }
    footer { height: 65px; } .edition { max-width: 92px; font-size: 9px; line-height: 1.6; } .dash { margin: 0 3px; }
    .sequence { gap: 5px; } .identity p { font-size: 12px; margin-bottom: 15px; } h1 img { width: 150px; } h1 { margin-bottom: 15px; }
    .identity a { font-size: 11px; } .corner { top: 15px; font-size: 8px; } .top-left { left: 13px; } .top-right { right: 13px; }
    .caption { left: 13px; bottom: 17px; font-size: 10px; max-width: 65%; } .caption span + span { font-size: 10px; }
    .stage .explore { right: 13px; bottom: 12px; font-size: 9px; }
  }
</style>
