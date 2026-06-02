<script>
  import { useNavigation, useProgress, useCompletion, usePersistence } from 'tessera-learn';
  import { onMount, onDestroy } from 'svelte';
  import { planets } from '../planets.js';
  import Starfield from '../Starfield.svelte';
  import Icon from '../Icon.svelte';

  let { planet, chapters, keyDates, revealedCount, children } = $props();

  const completion = useCompletion();
  const visitedStore = usePersistence('explorer:visited');

  $effect(() => {
    if (!planet?.slug || !chapters) return;
    const total = chapters.length;
    if ((revealedCount ?? total) < total) return;
    const current = new Set(visitedStore.get()?.slugs ?? []);
    if (current.has(planet.slug)) return;
    current.add(planet.slug);
    visitedStore.set({ slugs: [...current] });
    if (current.size === planets.length) {
      completion.markComplete();
    }
  });
  const totalRevealed = $derived(revealedCount ?? chapters.length);

  const nav = useNavigation();
  const progress = useProgress();

  let activeId = $state('');
  $effect(() => {
    if (!activeId && chapters[0]?.id) activeId = chapters[0].id;
  });
  let dateRailOpen = $state(false);

  let activeDateIndex = $state(-1);

  let observer;
  let scrollFrame = 0;

  function updateActiveDate() {
    const triggerY = window.innerHeight * 0.3;
    let last = -1;
    for (let i = 0; i < keyDates.length; i++) {
      const el = document.getElementById(keyDates[i].anchor);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top < triggerY) last = i;
      else break;
    }
    activeDateIndex = last;
  }

  function onScroll() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updateActiveDate();
    });
  }

  onMount(() => {
    // IntersectionObserver drives the chapter pill highlight; scroll listener
    // drives the date rail. Observing keyDate anchors here would clobber
    // activeId with non-chapter ids and drop the pill highlight mid-scroll.
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) activeId = e.target.id;
        });
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
    );
    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateActiveDate();
  });

  onDestroy(() => {
    observer?.disconnect();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
  });

  // Chapters are revealed progressively, so the observer set up in onMount only
  // sees the chapters present at mount. Re-observe whenever more are revealed,
  // otherwise the nav pill highlight never advances past the first chapter.
  // observe() is idempotent, so re-observing existing elements is harmless.
  $effect(() => {
    if (!observer) return;
    for (let i = 0; i < totalRevealed && i < chapters.length; i++) {
      const el = document.getElementById(chapters[i].id);
      if (el) observer.observe(el);
    }
  });

  function jumpTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    activeId = id;
  }

  function backToExplorer() {
    nav.goTo('explorer');
  }
</script>

<article class="history" style="--planet-color: {planet.color}; --planet-accent: {planet.accent};">
  <Starfield density="sparse" />

  <header class="hero" style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(5,6,14,0.7) 100%);">
    <div class="hero-bg">
      <span class="hero-planet" class:rings={planet.hasRings}></span>
    </div>
    <div class="hero-content">
      <button class="back-link" onclick={backToExplorer}>← Solar system</button>
      <h1>{planet.name}</h1>
      <p class="hero-subtitle">{planet.subtitle}</p>

      <div class="hero-stats">
        {#each planet.stats as stat}
          <div class="hero-stat">
            <span class="hero-stat-value">{stat.value}</span>
            <span class="hero-stat-label">{stat.label}</span>
          </div>
        {/each}
      </div>
    </div>
  </header>

  <nav class="chapter-nav" aria-label="Chapter navigation">
    <div class="chapter-nav-inner">
      {#each chapters as c, i}
        {@const locked = i >= totalRevealed}
        <button
          class="pill"
          class:active={activeId === c.id}
          class:locked
          disabled={locked}
          aria-disabled={locked}
          onclick={() => !locked && jumpTo(c.id)}
        >
          <span class="pill-dot"></span>
          <span class="pill-text">{c.title}</span>
        </button>
      {/each}
    </div>
  </nav>

  <div class="layout">
    <main class="prose">
      {@render children()}
    </main>

    <aside class="rail" class:open={dateRailOpen}>
      <button class="rail-toggle" onclick={() => (dateRailOpen = !dateRailOpen)}>
        Key dates
        <span class="rail-toggle-arrow" class:rotated={dateRailOpen}>▾</span>
      </button>
      <div class="rail-inner">
        <div class="rail-line"></div>
        {#each keyDates as d, i}
          {@const locked = d.chapterIndex !== undefined && d.chapterIndex >= totalRevealed}
          <button
            class="rail-item"
            class:passed={i <= activeDateIndex}
            class:current={i === activeDateIndex}
            class:locked
            disabled={locked}
            aria-disabled={locked}
            onclick={() => !locked && jumpTo(d.anchor)}
          >
            <span class="rail-year">{d.year}</span>
            <span class="rail-event">{d.event}</span>
          </button>
        {/each}
      </div>
    </aside>
  </div>

  <footer class="footer">
    <button class="back-primary" onclick={backToExplorer}>
      ← Back to the solar system
    </button>
    <p class="cta">
      <span class="rocket"><Icon name="rocket" /></span>
      Try the <strong>Cosmic Challenge</strong>, tap the button in the corner.
    </p>
  </footer>
</article>

<style>
  .history {
    position: relative;
    color: var(--tessera-text);
  }

  :global(.rail-anchor) {
    display: block;
    height: 0;
    scroll-margin-top: 5rem;
  }

  :global(.history .name-grid) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.85rem;
    margin: 1.5rem 0 2rem;
  }

  .hero {
    position: relative;
    min-height: 60vh;
    padding: 4rem 1.5rem 3rem;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8%;
    pointer-events: none;
    overflow: hidden;
  }
  .hero-planet {
    display: block;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, var(--planet-accent), var(--planet-color) 70%, #1a1a2e 110%);
    box-shadow: 0 0 80px rgba(0,0,0,0.5), 0 0 120px rgba(122,162,255,0.1);
    opacity: 0.7;
    position: relative;
    animation: hero-drift 30s ease-in-out infinite;
  }
  .hero-planet.rings::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 220%;
    height: 32%;
    transform: translate(-50%, -50%) rotate(-18deg);
    border-radius: 50%;
    border-top: 4px solid rgba(243,220,160,0.5);
    border-bottom: 4px solid rgba(243,220,160,0.5);
  }
  @keyframes hero-drift {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-15px, 10px); }
  }

  @media (max-width: 800px) {
    .hero-planet { width: 220px; height: 220px; opacity: 0.4; }
    .hero-bg { padding-right: 0; justify-content: center; }
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
  }

  .back-link {
    background: none;
    border: 1px solid rgba(255,255,255,0.15);
    color: var(--tessera-text-light);
    padding: 0.4rem 0.85rem;
    border-radius: 999px;
    font-family: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    margin-bottom: 1.5rem;
    transition: color 0.15s, border-color 0.15s;
  }
  .back-link:hover { color: var(--tessera-text); border-color: rgba(122,162,255,0.4); }

  .hero h1 {
    font-size: clamp(3rem, 9vw, 6rem);
    font-weight: 200;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0 0 0.75rem;
    background: linear-gradient(180deg, #ffffff 0%, var(--planet-accent) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .hero-subtitle {
    font-size: clamp(1rem, 2vw, 1.25rem);
    color: var(--tessera-text-light);
    font-style: italic;
    margin: 0 0 2rem;
    max-width: 600px;
  }
  .hero-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.25rem;
    max-width: 900px;
  }
  .hero-stat {
    padding: 0.75rem 0;
    border-top: 1px solid rgba(122,162,255,0.2);
  }
  .hero-stat-value {
    display: block;
    font-size: clamp(1.1rem, 2.4vw, 1.5rem);
    font-weight: 500;
    color: var(--tessera-text);
    line-height: 1.2;
  }
  .hero-stat-label {
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--tessera-text-light);
    margin-top: 0.25rem;
  }

  .chapter-nav {
    position: sticky;
    top: 0;
    z-index: 500;
    background: rgba(5,6,14,0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(122,162,255,0.12);
  }
  .chapter-nav-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0.7rem 1.5rem;
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .chapter-nav-inner::-webkit-scrollbar { display: none; }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: 1px solid rgba(122,162,255,0.18);
    color: var(--tessera-text-light);
    padding: 0.4rem 0.85rem;
    border-radius: 999px;
    font-family: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
  }
  .pill:hover { color: var(--tessera-text); border-color: rgba(122,162,255,0.4); }
  .pill.active {
    color: var(--tessera-text);
    border-color: var(--planet-accent);
    background: rgba(255,255,255,0.04);
  }
  .pill-dot {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: var(--planet-accent);
    opacity: 0.4;
  }
  .pill.active .pill-dot { opacity: 1; box-shadow: 0 0 8px var(--planet-accent); }
  .pill.locked {
    opacity: 0.35;
    cursor: not-allowed;
    border-color: rgba(122,162,255,0.08);
  }
  .pill.locked:hover {
    color: var(--tessera-text-light);
    border-color: rgba(122,162,255,0.08);
  }
  .pill.locked .pill-dot { opacity: 0.2; }

  @media (max-width: 540px) {
    .pill-text { display: none; }
    .pill { padding: 0.5rem; }
    .pill-dot { width: 0.55rem; height: 0.55rem; }
  }

  .layout {
    max-width: 1100px;
    margin: 0 auto;
    padding: 3rem 1.5rem 2rem;
    display: grid;
    grid-template-columns: 1fr 220px;
    gap: 3rem;
  }

  .prose {
    font-size: 1.08rem;
    line-height: 1.85;
    min-width: 0;
  }
  .prose :global(p) {
    max-width: 60ch;
  }

  .rail {
    position: sticky;
    top: 4.5rem;
    align-self: flex-start;
    max-height: calc(100vh - 6rem);
    overflow-y: auto;
    padding: 0.5rem 0.75rem;
  }
  .rail-toggle {
    display: none;
    width: 100%;
    background: rgba(122,162,255,0.05);
    border: 1px solid rgba(122,162,255,0.2);
    color: var(--tessera-text);
    padding: 0.65rem 0.9rem;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
  .rail-toggle-arrow { transition: transform 0.2s; }
  .rail-toggle-arrow.rotated { transform: rotate(180deg); }

  .rail-inner {
    position: relative;
    padding-left: 1.5rem;
  }
  .rail-line {
    position: absolute;
    top: 0.5rem;
    bottom: 0.5rem;
    left: 0.4rem;
    width: 1px;
    background: linear-gradient(180deg, transparent, rgba(122,162,255,0.35), transparent);
  }
  .rail-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: none;
    border: none;
    color: var(--tessera-text-light);
    cursor: pointer;
    text-align: left;
    padding: 0.5rem 0;
    margin-bottom: 0.25rem;
    font-family: inherit;
    position: relative;
    opacity: 0.5;
    transition: color 0.2s, opacity 0.2s;
  }
  .rail-item::before {
    content: '';
    position: absolute;
    left: -1.32rem;
    top: 0.85rem;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: var(--planet-accent);
    opacity: 0.4;
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .rail-item:hover {
    color: var(--tessera-text);
    opacity: 1;
  }
  .rail-item:hover::before { opacity: 1; transform: scale(1.3); }

  .rail-item.passed {
    opacity: 1;
    color: var(--tessera-text);
  }
  .rail-item.passed::before {
    opacity: 1;
  }

  .rail-item.current::before {
    transform: scale(1.5);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08), 0 0 12px var(--planet-accent);
  }
  .rail-item.current .rail-year {
    color: #fff;
  }
  .rail-item.locked {
    opacity: 0.25;
    cursor: not-allowed;
  }
  .rail-item.locked:hover { opacity: 0.25; color: var(--tessera-text-light); }
  .rail-item.locked:hover::before { transform: none; }

  .rail-year {
    font-size: 0.8rem;
    color: var(--planet-accent);
    font-weight: 500;
    transition: color 0.2s;
  }
  .rail-event {
    font-size: 0.8rem;
    line-height: 1.35;
  }

  @media (max-width: 900px) {
    .layout { grid-template-columns: 1fr; gap: 1rem; }
    .rail {
      position: relative;
      top: auto;
      max-height: none;
      overflow: visible;
    }
    .rail-toggle { display: flex; }
    .rail-inner {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }
    .rail.open .rail-inner { max-height: 1000px; padding-top: 0.75rem; }
  }

  .footer {
    max-width: 1100px;
    margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
    text-align: center;
    border-top: 1px solid rgba(122,162,255,0.1);
  }
  .back-primary {
    background: var(--planet-color);
    color: #050a1c;
    border: none;
    padding: 0.95rem 2rem;
    border-radius: 999px;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .back-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }
  .cta {
    margin: 1.5rem 0 0;
    font-size: 0.9rem;
    color: var(--tessera-text-light);
  }
  .cta strong { color: var(--tessera-primary-light); }
  .cta .rocket { margin-right: 0.4rem; }
</style>
