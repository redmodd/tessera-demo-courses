<script module>
  export const pageConfig = { title: "Explorer" };
</script>

<script>
  import { useNavigation, usePersistence } from 'tessera-learn';
  import { planets } from '../../../lib/planets.js';
  import Starfield from '../../../lib/Starfield.svelte';

  const nav = useNavigation();

  const visitedStore = usePersistence('explorer:visited');
  let visited = $state(new Set(visitedStore.get()?.slugs ?? []));

  let selected = $state(null);
  let hovered = $state(null);
  let panel = $state(null);
  let panelReturnFocus = null;

  function openPanel(slug) {
    panelReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    selected = slug;
  }

  function closePanel() {
    selected = null;
    if (panelReturnFocus) {
      const target = panelReturnFocus;
      panelReturnFocus = null;
      queueMicrotask(() => target.focus?.());
    }
  }

  function readHistory(slug) {
    // Skip focus restoration — we're navigating away.
    selected = null;
    panelReturnFocus = null;
    nav.goTo(slug);
  }

  function panelFocusables() {
    if (!panel) return [];
    const sel = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(panel.querySelectorAll(sel)).filter((el) => el.offsetParent !== null);
  }

  function onKeydown(e) {
    if (!selected) return;
    if (e.key === 'Escape') {
      closePanel();
      return;
    }
    if (e.key === 'Tab') {
      const items = panelFocusables();
      if (items.length === 0) { e.preventDefault(); panel?.focus(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  $effect(() => {
    if (selected) {
      queueMicrotask(() => {
        const items = panelFocusables();
        (items[0] ?? panel)?.focus();
      });
    }
  });

  const selectedPlanet = $derived(
    selected ? planets.find((p) => p.slug === selected) : null
  );

  const startOffsets = planets.map((p) => -Math.random() * p.duration);

  let panX = $state(0);
  let panY = $state(0);
  let dragging = $state(false);
  let dragStart = null;

  function startPan(e) {
    if (e.target.closest('.planet')) return;
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true;
    dragStart = { x: e.clientX, y: e.clientY, panX, panY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function movePan(e) {
    if (!dragging || !dragStart) return;
    panX = dragStart.panX + (e.clientX - dragStart.x);
    panY = dragStart.panY + (e.clientY - dragStart.y);
  }

  function endPan(e) {
    if (!dragging) return;
    dragging = false;
    dragStart = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  }

  function resetPan() {
    panX = 0;
    panY = 0;
  }

  const PAN_STEP = 32;
  function onStageKeydown(e) {
    switch (e.key) {
      case 'ArrowLeft':  panX += PAN_STEP; e.preventDefault(); break;
      case 'ArrowRight': panX -= PAN_STEP; e.preventDefault(); break;
      case 'ArrowUp':    panY += PAN_STEP; e.preventDefault(); break;
      case 'ArrowDown':  panY -= PAN_STEP; e.preventDefault(); break;
      case 'Home':       resetPan();       e.preventDefault(); break;
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<section class="explorer">
  <Starfield density="dense" />

  <div class="header">
    <h1>The Solar System</h1>
    <p>{visited.size} of {planets.length} worlds visited.</p>
  </div>

  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="system-stage"
    class:dragging
    role="application"
    aria-label="Solar system view. Drag with the mouse, or use arrow keys to pan and Home to reset."
    tabindex="0"
    onpointerdown={startPan}
    onpointermove={movePan}
    onpointerup={endPan}
    onpointercancel={endPan}
    onkeydown={onStageKeydown}
  >
  <div
    class="system"
    class:dimmed={selected !== null}
    style="--pan-x: {panX}px; --pan-y: {panY}px;"
    aria-label="Interactive solar system"
  >
    <button
      type="button"
      class="sun"
      aria-label="The Sun. Our star, 99.8% of the solar system's mass."
    >
      <span class="sun-tooltip" aria-hidden="true">Our star. 99.8% of the solar system's mass.</span>
    </button>

    {#each planets as p, i}
      <div
        class="orbit"
        style="
          --orbit-size: {p.orbit * 2}px;
          --orbit-duration: {p.duration}s;
          --orbit-delay: {startOffsets[i]}s;
          --static-angle: {(i * 45) % 360}deg;
        "
      >
        <button
          class="planet"
          class:visited={visited.has(p.slug)}
          class:active={selected === p.slug}
          style="
            --planet-size: {p.size}px;
            --planet-color: {p.color};
            --planet-accent: {p.accent};
          "
          onclick={() => openPanel(p.slug)}
          onmouseenter={() => (hovered = p.slug)}
          onmouseleave={() => (hovered = null)}
          onfocus={() => (hovered = p.slug)}
          onblur={() => (hovered = null)}
          aria-label={`Open ${p.name}${visited.has(p.slug) ? ' (visited)' : ''}`}
        >
          <span class="planet-body" class:rings={p.hasRings}></span>
          {#if visited.has(p.slug)}
            <span class="visited-badge" aria-hidden="true">✓</span>
          {/if}
          <span class="planet-label" class:show={hovered === p.slug}>
            {p.name}{#if visited.has(p.slug)}<span class="label-check" aria-hidden="true"> ✓</span>{/if}
          </span>
        </button>
      </div>
    {/each}
  </div>
  </div>

  <div class="legend">
    <span class="dot"></span>
    Click any planet. Drag the space around to pan the view. Visited worlds are marked with a ✓.
    <button
      class="reset"
      onclick={resetPan}
      disabled={panX === 0 && panY === 0}
    >Recentre</button>
  </div>
</section>

{#if selected && selectedPlanet}
  <div class="scrim" onclick={closePanel} role="presentation"></div>
  <div
    class="panel"
    role="dialog"
    aria-modal="true"
    aria-labelledby="panel-title"
    bind:this={panel}
    tabindex="-1"
  >
    <button class="panel-close" onclick={closePanel} aria-label="Close panel">×</button>
    <div
      class="hero-art"
      style="--planet-color: {selectedPlanet.color}; --planet-accent: {selectedPlanet.accent};"
    >
      <span class="hero-planet" class:rings={selectedPlanet.hasRings}></span>
    </div>
    <h2 id="panel-title">{selectedPlanet.name}</h2>
    <p class="subtitle">{selectedPlanet.subtitle}</p>
    <p class="blurb">{selectedPlanet.blurb}</p>

    <div class="stats">
      {#each selectedPlanet.stats as stat}
        <div class="stat">
          <span class="stat-label">{stat.label}</span>
          <span class="stat-value">{stat.value}</span>
        </div>
      {/each}
    </div>

    <button class="read-more" onclick={() => readHistory(selectedPlanet.slug)}>
      Read the full history
      <span class="arrow" aria-hidden="true">→</span>
    </button>
  </div>
{/if}

<style>
  .explorer {
    position: fixed;
    inset: 0;
    overflow: hidden;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    background:
      radial-gradient(ellipse at center, #0a1030 0%, #05060e 60%, #02030a 100%);
  }

  .header {
    position: relative;
    z-index: 2;
    text-align: center;
    flex-shrink: 0;
  }
  .header h1 {
    font-size: clamp(1.5rem, 3.5vw, 2rem);
    font-weight: 300;
    margin: 0 0 0.25rem;
    letter-spacing: 0.02em;
  }
  .header p {
    font-size: 0.85rem;
    color: var(--tessera-text-light);
    margin: 0;
  }

  .system-stage {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    min-height: 0;
  }
  .system-stage.dragging { cursor: grabbing; }

  .system {
    position: relative;
    width: 1000px;
    height: 1000px;
    flex-shrink: 0;
    transition: opacity 0.35s ease;
    --system-scale: 1;
    transform: translate(var(--pan-x, 0px), var(--pan-y, 0px)) scale(var(--system-scale));
    transform-origin: center center;
  }
  .system.dimmed {
    opacity: 0.35;
    filter: blur(2px);
  }

  @media (max-width: 1100px) {
    .system { --system-scale: 0.78; }
  }
  @media (max-width: 800px) {
    .system { --system-scale: 0.55; }
  }
  @media (max-width: 540px) {
    .system { --system-scale: 0.4; }
  }

  .sun {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90px;
    height: 90px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: none;
    padding: 0;
    cursor: pointer;
    background: radial-gradient(circle at 35% 35%, #fff7c2 0%, #ffd966 30%, #ff9933 70%, #ff5500 100%);
    box-shadow:
      0 0 60px rgba(255, 200, 80, 0.7),
      0 0 120px rgba(255, 150, 50, 0.4),
      0 0 200px rgba(255, 100, 30, 0.25);
    z-index: 1;
    animation: sun-pulse 6s ease-in-out infinite;
  }
  .sun:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
  .sun:focus-visible .sun-tooltip,
  .sun:hover .sun-tooltip { opacity: 1; }
  @keyframes sun-pulse {
    0%, 100% { box-shadow: 0 0 60px rgba(255,200,80,0.7), 0 0 120px rgba(255,150,50,0.4), 0 0 200px rgba(255,100,30,0.25); }
    50% { box-shadow: 0 0 80px rgba(255,210,90,0.85), 0 0 160px rgba(255,160,50,0.5), 0 0 240px rgba(255,110,30,0.3); }
  }

  .sun-tooltip {
    position: absolute;
    top: 110%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(12,16,36,0.95);
    border: 1px solid rgba(255,200,80,0.3);
    color: var(--tessera-text);
    padding: 0.4rem 0.7rem;
    border-radius: 6px;
    font-size: 0.75rem;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  .orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--orbit-size);
    height: var(--orbit-size);
    margin-top: calc(var(--orbit-size) / -2);
    margin-left: calc(var(--orbit-size) / -2);
    border-radius: 50%;
    border: 1px solid rgba(122, 162, 255, 0.14);
    animation: orbit var(--orbit-duration) linear infinite;
    animation-delay: var(--orbit-delay, 0s);
    pointer-events: none;
    transition: border-color 0.2s;
  }
  .orbit:has(.planet:hover),
  .orbit:has(.planet:focus-visible) {
    border-color: rgba(255, 255, 255, 0.55);
  }

  @keyframes orbit {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .planet {
    position: absolute;
    top: 0;
    left: 50%;
    width: var(--planet-size);
    height: var(--planet-size);
    transform: translate(-50%, -50%);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    pointer-events: auto;
    animation: counter-orbit var(--orbit-duration) linear infinite;
    animation-delay: var(--orbit-delay, 0s);
  }
  @keyframes counter-orbit {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(-360deg); }
  }

  /* The global reduced-motion rule clamps animation-duration to ~0ms but
     keeps the animation, which would land every planet on the same starting
     angle (0deg, top of orbit). Stop the animations entirely and stagger the
     planets around their orbits with a per-index static rotation instead. */
  @media (prefers-reduced-motion: reduce) {
    .orbit, .planet, .sun {
      animation: none !important;
    }
    .orbit { transform: rotate(calc(var(--static-angle, 0deg))); }
    .planet { transform: translate(-50%, -50%) rotate(calc(-1 * var(--static-angle, 0deg))); }
  }

  .planet-body {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, var(--planet-accent), var(--planet-color) 70%, #1a1a2e 110%);
    box-shadow: 0 0 18px rgba(0,0,0,0.5), inset -2px -2px 8px rgba(0,0,0,0.4);
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s, filter 0.2s;
    position: relative;
  }

  .planet:not(.visited):not(.active) .planet-body {
    opacity: 0.72;
    filter: saturate(0.85);
  }

  .planet.visited .planet-body {
    box-shadow:
      0 0 18px rgba(0,0,0,0.5),
      0 0 0 3px var(--planet-accent),
      0 0 22px color-mix(in oklab, var(--planet-accent) 70%, transparent),
      inset -2px -2px 8px rgba(0,0,0,0.4);
  }

  .planet:hover .planet-body,
  .planet:focus-visible .planet-body {
    transform: scale(1.25);
    box-shadow: 0 0 28px rgba(255,255,255,0.4), 0 0 0 2px rgba(255,255,255,0.55), inset -2px -2px 8px rgba(0,0,0,0.4);
    opacity: 1;
    filter: none;
  }

  .visited-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 14px;
    height: 14px;
    padding: 0 3px;
    border-radius: 999px;
    background: #4ade80;
    color: #04140a;
    border: 2px solid #050a1c;
    font-size: 9px;
    font-weight: 800;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 8px rgba(74, 222, 128, 0.55);
    pointer-events: none;
    z-index: 2;
  }
  .planet:hover .visited-badge,
  .planet:focus-visible .visited-badge {
    transform: scale(0.85);
  }

  .planet-body.rings::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 180%;
    height: 30%;
    transform: translate(-50%, -50%) rotate(-18deg);
    border-radius: 50%;
    border-top: 2px solid rgba(243, 220, 160, 0.55);
    border-bottom: 2px solid rgba(243, 220, 160, 0.55);
    box-shadow: 0 0 8px rgba(243, 220, 160, 0.15);
  }

  .planet-label {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    color: var(--tessera-text);
    background: rgba(8, 12, 28, 0.85);
    padding: 0.15rem 0.55rem;
    border-radius: 999px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s;
    border: 1px solid rgba(122,162,255,0.2);
  }
  .planet-label.show { opacity: 1; }
  .label-check {
    color: #4ade80;
    font-weight: 700;
    margin-left: 0.15rem;
  }

  .legend {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    font-size: 0.85rem;
    color: var(--tessera-text-light);
    flex-shrink: 0;
    flex-wrap: wrap;
    text-align: center;
    padding-top: 0.75rem;
  }
  .legend .dot {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--tessera-primary);
    box-shadow: 0 0 0 2px rgba(122,162,255,0.3);
  }
  .legend .reset {
    background: rgba(122,162,255,0.1);
    border: 1px solid rgba(122,162,255,0.3);
    color: var(--tessera-text);
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    font-family: inherit;
    font-size: 0.78rem;
    cursor: pointer;
    margin-left: 0.5rem;
    transition: background 0.15s, border-color 0.15s;
  }
  .legend .reset:hover {
    background: rgba(122,162,255,0.2);
    border-color: var(--tessera-primary);
  }
  .legend .reset:disabled {
    opacity: 0;
    pointer-events: none;
    cursor: default;
    transition: opacity 0.15s;
  }

  .scrim {
    position: fixed;
    inset: 0;
    background: rgba(2,4,16,0.5);
    backdrop-filter: blur(2px);
    z-index: 600;
    animation: fade 0.25s ease-out;
  }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }

  .panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(440px, 100vw);
    background: linear-gradient(160deg, #0c1130 0%, #060818 100%);
    border-left: 1px solid rgba(122,162,255,0.25);
    z-index: 700;
    padding: 2.5rem 2rem;
    overflow-y: auto;
    box-shadow: -20px 0 60px rgba(0,0,0,0.5);
    animation: slide-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  @keyframes slide-in {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  .panel-close {
    position: absolute;
    top: 0.75rem;
    right: 1rem;
    background: none;
    border: none;
    color: var(--tessera-text-light);
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
  }
  .panel-close:hover { color: var(--tessera-text); }

  .hero-art {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
  }
  .hero-planet {
    display: block;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, var(--planet-accent), var(--planet-color) 70%, #1a1a2e 110%);
    box-shadow:
      0 0 30px rgba(0,0,0,0.5),
      0 0 0 1px rgba(122,162,255,0.15),
      inset -4px -4px 16px rgba(0,0,0,0.4);
    position: relative;
  }
  .hero-planet.rings::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200%;
    height: 32%;
    transform: translate(-50%, -50%) rotate(-18deg);
    border-radius: 50%;
    border-top: 3px solid rgba(243,220,160,0.6);
    border-bottom: 3px solid rgba(243,220,160,0.6);
  }

  .panel h2 {
    font-size: 2.25rem;
    font-weight: 300;
    margin: 0 0 0.5rem;
    letter-spacing: -0.01em;
  }
  .subtitle {
    font-size: 0.9rem;
    color: var(--tessera-primary-light);
    font-style: italic;
    margin: 0 0 1.25rem;
    line-height: 1.5;
  }
  .blurb {
    font-size: 1rem;
    line-height: 1.65;
    color: var(--tessera-text);
    margin: 0 0 1.5rem;
  }

  .stats {
    display: grid;
    gap: 0.6rem;
    margin-bottom: 1.75rem;
    padding: 1rem;
    background: rgba(122,162,255,0.05);
    border-radius: 10px;
    border: 1px solid rgba(122,162,255,0.1);
  }
  .stat {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    font-size: 0.9rem;
  }
  .stat-label { color: var(--tessera-text-light); }
  .stat-value { color: var(--tessera-text); font-weight: 500; text-align: right; }

  .read-more {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    justify-content: center;
    background: var(--tessera-primary);
    color: #050a1c;
    border: none;
    padding: 0.95rem 1.5rem;
    border-radius: 999px;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }
  .read-more:hover {
    background: var(--tessera-primary-light);
    transform: translateY(-2px);
  }
  .read-more .arrow { transition: transform 0.2s; }
  .read-more:hover .arrow { transform: translateX(4px); }

  @media (max-width: 640px) {
    .panel {
      top: auto;
      width: 100vw;
      max-height: 80vh;
      border-left: none;
      border-top: 1px solid rgba(122,162,255,0.25);
      border-radius: 18px 18px 0 0;
      animation: slide-up 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    @keyframes slide-up {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  }
</style>
