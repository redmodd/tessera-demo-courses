<script module>
  export const pageConfig = { title: "Introduction" };
</script>

<script>
  import { useNavigation } from 'tessera-learn';
  import Starfield from '../../../lib/Starfield.svelte';

  const nav = useNavigation();
</script>

<section class="intro">
  <Starfield density="sparse" />

  <article class="card">
    <span class="eyebrow">An invitation</span>
    <h1>How this works</h1>

    <p class="lede">
      Our solar system is one star and the worlds that fall under its gravity. Eight planets, dozens of moons,
      and, around the edge, a long, slow drift of icy bodies most of us will never see.
    </p>

    <p>
      In a moment you'll meet all eight planets in a single view. 
      Just <em>click any planet to learn about it</em>, and open
      its history page for the full story. Visit all planets to complete the module!
    </p>

    <p>
      Some planets we've known about for thousands of years. Others were found
      with telescopes, and one of them was discovered through pure mathematics
      before anyone ever saw it. Wherever you start, follow what catches your eye.
    </p>

    <div class="hint">
      <span class="dot"></span>
      The Cosmic Challenge button appears once you reach the explorer page.
      Tap it any time for ten random questions drawn from across the eight planets
      to earn your Cosmic Challenge badge!
    </div>

    <button class="continue" onclick={() => nav.next()}>
      <span>Continue to the explorer</span>
      <span class="arrow" aria-hidden="true">→</span>
    </button>
  </article>
</section>

<style>
  .intro {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    overflow: hidden;
  }

  .card {
    position: relative;
    z-index: 2;
    max-width: 640px;
    padding: 3rem 2.5rem;
    background: rgba(12, 16, 36, 0.6);
    border: 1px solid rgba(122, 162, 255, 0.18);
    border-radius: 18px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    animation: rise 0.9s ease-out;
  }

  @keyframes rise {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .eyebrow {
    display: inline-block;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    color: var(--tessera-primary);
    margin-bottom: 0.75rem;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 300;
    margin: 0 0 1.75rem;
    line-height: 1.1;
    letter-spacing: -0.01em;
  }

  p {
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--tessera-text);
    margin: 0 0 1.25rem;
  }
  .lede {
    font-size: 1.15rem;
    color: var(--tessera-text);
  }

  em {
    color: var(--tessera-primary-light);
    font-style: normal;
    background: linear-gradient(transparent 65%, rgba(122,162,255,0.18) 65%);
    padding: 0 0.15em;
  }

  .hint {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin: 2rem 0;
    padding: 0.95rem 1.1rem;
    background: rgba(122,162,255,0.05);
    border-left: 3px solid var(--tessera-primary);
    border-radius: 6px;
    font-size: 0.95rem;
    color: var(--tessera-text-light);
    line-height: 1.55;
  }
  .hint .dot {
    width: 0.6rem;
    height: 0.6rem;
    margin-top: 0.5rem;
    border-radius: 50%;
    background: var(--tessera-primary);
    box-shadow: 0 0 12px var(--tessera-primary);
    flex-shrink: 0;
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  .continue {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    margin-top: 1rem;
    background: var(--tessera-primary);
    color: #050a1c;
    border: none;
    padding: 0.95rem 1.75rem;
    border-radius: 999px;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .continue:hover {
    background: var(--tessera-primary-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(122,162,255,0.35);
  }
  .continue .arrow { transition: transform 0.2s; }
  .continue:hover .arrow { transform: translateX(4px); }
</style>
