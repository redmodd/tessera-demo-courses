<script module>
  export const pageConfig = { title: 'Zoo Quest' };
</script>

<script>
  import { useNavigation } from 'tessera-learn';
  import Animal from '../../../components/Animal.svelte';
  const nav = useNavigation();

  // The collectable cast, looped for liveliness (alternating facing).
  const cast = ['lion', 'elephant', 'squirrel', 'lion', 'elephant', 'squirrel'];
</script>

<main class="splash">
  <div class="marquee" aria-hidden="true">
    {#each cast as kind, i}<Animal {kind} flip={i % 2 === 1} />{/each}
  </div>
  <h1 class="title">Zoo&nbsp;Quest</h1>
  <p class="subtitle">Explore the zoo. Fill your Zoodex.</p>
  <button class="start" onclick={() => nav.goTo('how-to-play')}>Press Start</button>
</main>

<style>
  .splash {
    min-height: 100dvh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1.5rem;
    text-align: center;
    background:
      radial-gradient(circle at 50% 30%, var(--zoo-grass), var(--tessera-bg) 70%);
    color: var(--zoo-ink);
  }
  .marquee {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: clamp(0.5rem, 2vw, 1.25rem);
  }
  .marquee :global(svg) {
    width: clamp(48px, 9vw, 78px);
    height: auto;
  }
  .title {
    margin: 0;
    font-size: clamp(2.8rem, 11vw, 6rem);
    line-height: 1;
    color: var(--zoo-bark);
    text-shadow: 0 3px 0 rgba(58, 51, 34, 0.15);
  }
  .subtitle {
    margin: 0 0 1rem;
    font-size: clamp(1rem, 3vw, 1.3rem);
    color: var(--zoo-ink);
  }
  .start {
    padding: 0.85rem 2.2rem;
    border: none;
    border-radius: 999px;
    background: var(--zoo-accent-deep);
    color: #fff;
    font: inherit;
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    cursor: pointer;
    box-shadow: 0 6px 0 rgba(58, 51, 34, 0.25);
    animation: pulse 1.8s ease-in-out infinite;
  }
  .start:hover {
    filter: brightness(1.07);
  }
  .start:focus-visible {
    outline: 4px solid var(--zoo-bark);
    outline-offset: 4px;
  }
  @keyframes pulse {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .start {
      animation: none;
    }
  }
</style>
