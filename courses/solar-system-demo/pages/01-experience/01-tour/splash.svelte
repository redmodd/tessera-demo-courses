<script module>
  export const pageConfig = { title: "Splash" };
</script>

<script>
  import { useNavigation } from 'tessera-learn';
  import Starfield from '../../../lib/Starfield.svelte';

  const nav = useNavigation();
</script>

<section class="splash">
  <Starfield density="dense" />

  <div class="content">
    <h1 class="title">Explore the<br />Solar System</h1>
    <p class="tagline">Eight worlds. One star. A whole lot to see.</p>
    <button class="begin" onclick={() => nav.next()}>
      <span>Begin</span>
      <span class="arrow" aria-hidden="true">→</span>
    </button>
  </div>
</section>

<style>
  .splash {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: radial-gradient(ellipse at center, #1a2050 0%, #060818 50%, #02030a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 2rem;
    animation: drift-in 1.4s ease-out;
  }

  @keyframes drift-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .title {
    font-size: clamp(2.5rem, 8vw, 5.5rem);
    font-weight: 200;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0 0 1.5rem;
    background: linear-gradient(180deg, #ffffff 0%, #a8c0ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 60px rgba(122, 162, 255, 0.3);
  }

  .tagline {
    font-size: clamp(1rem, 2.2vw, 1.25rem);
    color: var(--tessera-text-light);
    font-style: italic;
    margin: 0 0 3rem;
    letter-spacing: 0.02em;
  }

  .begin {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    background: rgba(122, 162, 255, 0.08);
    color: var(--tessera-text);
    border: 1px solid rgba(122, 162, 255, 0.4);
    padding: 1rem 2.25rem;
    border-radius: 999px;
    font-family: inherit;
    font-size: 1.05rem;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  }

  .begin:hover {
    background: rgba(122, 162, 255, 0.18);
    border-color: var(--tessera-primary);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(122, 162, 255, 0.25);
  }

  .begin .arrow {
    transition: transform 0.2s;
  }
  .begin:hover .arrow { transform: translateX(4px); }
</style>
