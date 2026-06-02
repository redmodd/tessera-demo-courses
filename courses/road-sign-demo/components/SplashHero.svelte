<script>
  import { useNavigation, usePersistence } from 'tessera-learn';
  import SignCard from './SignCard.svelte';
  import { sfx } from './sfx.js';

  const nav = useNavigation();
  const leaderboardStore = usePersistence('roadsign-leaderboard');

  const entries = leaderboardStore.get() ?? [];
  const personalBest = entries.reduce((m, e) => Math.max(m, e.points ?? 0), 0);

  const driftingSigns = [
    'stop', 'yield', 'speed-limit', 'curve', 'school-zone',
    'pedestrian', 'merge', 'do-not-enter', 'railroad-crossing', 'gas',
    'turn', 'hospital',
  ];

  function enter() {
    sfx.unlock();
    nav.next();
  }
</script>

<section class="splash" aria-labelledby="splash-title">
  <div class="drift-layer" aria-hidden="true">
    {#each driftingSigns as id, i}
      <div class="drift-sign drift-sign--{i}">
        <SignCard symbol={id} decorative />
      </div>
    {/each}
  </div>

  <div class="splash-card">
    <p class="splash-eyebrow">Road Sign Match</p>
    <h1 id="splash-title" class="splash-title">Know your signs.<br />Beat the clock.</h1>
    <p class="splash-tag">A fifteen-round road-sign match game. Answer fast for more points.</p>

    {#if personalBest > 0}
      <p class="best">Personal best: <strong>{personalBest.toLocaleString()}</strong> pts</p>
    {/if}

    <button class="rs-btn rs-btn--enter" type="button" onclick={enter}>Enter the module</button>
  </div>
</section>

<style>
  .splash {
    position: relative;
    min-height: 100dvh;
    display: grid;
    place-items: center;
    overflow: hidden;
    background: var(--rs-bg-amber-gradient);
    isolation: isolate;
  }

  .drift-layer {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
  .drift-sign {
    position: absolute;
    width: 88px;
    opacity: 0.18;
    animation: drift 28s linear infinite;
  }
  .drift-sign--0  { top:  5%; left:  6%; animation-duration: 32s; }
  .drift-sign--1  { top: 12%; left: 70%; animation-duration: 38s; animation-direction: reverse; }
  .drift-sign--2  { top: 25%; left: 30%; animation-duration: 42s; }
  .drift-sign--3  { top: 38%; left: 84%; animation-duration: 30s; animation-direction: reverse; }
  .drift-sign--4  { top: 55%; left: 12%; animation-duration: 36s; }
  .drift-sign--5  { top: 62%; left: 60%; animation-duration: 44s; animation-direction: reverse; }
  .drift-sign--6  { top: 78%; left: 22%; animation-duration: 34s; }
  .drift-sign--7  { top: 84%; left: 75%; animation-duration: 40s; animation-direction: reverse; }
  .drift-sign--8  { top: 18%; left: 50%; animation-duration: 46s; }
  .drift-sign--9  { top: 70%; left: 42%; animation-duration: 38s; animation-direction: reverse; }
  .drift-sign--10 { top: 45%; left: 55%; animation-duration: 50s; }
  .drift-sign--11 { top: 90%; left:  8%; animation-duration: 28s; animation-direction: reverse; }

  @keyframes drift {
    from { transform: translate(0, 0) rotate(0deg); }
    50%  { transform: translate(30px, -20px) rotate(8deg); }
    to   { transform: translate(0, 0) rotate(0deg); }
  }

  .splash-card {
    position: relative;
    z-index: 1;
    text-align: center;
    background: rgba(255, 255, 255, 0.85);
    padding: 3rem 3.5rem;
    border-radius: var(--rs-radius-panel);
    backdrop-filter: blur(8px);
    box-shadow: var(--rs-shadow-panel);
    max-width: 540px;
    margin: 1rem;
    animation: splash-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .splash-eyebrow {
    margin: 0 0 0.5rem;
    font-size: 0.85rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--rs-warning-amber-deep);
    font-weight: 700;
  }
  .splash-title {
    margin: 0 0 1rem;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    line-height: 1.15;
    color: var(--rs-text);
  }
  .splash-tag {
    margin: 0 0 2rem;
    color: var(--rs-text-muted);
    font-size: 1rem;
  }
  .best {
    margin: -1rem 0 1.5rem;
    font-size: 0.95rem;
    color: var(--rs-warning-amber-deep);
  }
  @keyframes splash-rise {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .drift-sign, .splash-card { animation: none; }
  }
</style>
