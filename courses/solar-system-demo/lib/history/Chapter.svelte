<script>
  let { id, title, eyebrow = '', children } = $props();
</script>

<section class="chapter" {id}>
  {#if eyebrow}<span class="eyebrow">{eyebrow}</span>{/if}
  <h2 class="chapter-title">{title}</h2>
  <div class="chapter-body">
    {@render children()}
  </div>
  <div class="chapter-divider" aria-hidden="true">
    <span></span>
    <span class="dot"></span>
    <span></span>
  </div>
</section>

<style>
  .chapter {
    margin-bottom: 5rem;
    scroll-margin-top: 4rem;
  }
  .eyebrow {
    display: inline-block;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    color: var(--planet-accent);
    margin-bottom: 0.5rem;
  }
  .chapter-title {
    font-size: clamp(1.6rem, 3.5vw, 2.25rem);
    font-weight: 300;
    line-height: 1.15;
    margin: 0 0 2rem;
    letter-spacing: -0.01em;
  }
  .chapter-body :global(p) {
    margin: 0 0 1.6rem;
    color: var(--tessera-text);
  }
  .chapter-body :global(h3.sub) {
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--planet-accent);
    margin: 2.5rem 0 0.75rem;
    line-height: 1.3;
  }
  .chapter-body :global(h3.sub:first-child) {
    margin-top: 0;
  }
  .chapter-body :global(.drop-cap p:first-of-type::first-letter) {
    font-size: 3.5em;
    float: left;
    font-weight: 300;
    line-height: 0.9;
    margin: 0.05em 0.1em 0 0;
    color: var(--planet-accent);
  }
  .chapter-divider {
    margin: 2.5rem auto 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: 320px;
  }
  .chapter-divider span:first-child,
  .chapter-divider span:last-child {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(122,162,255,0.3), transparent);
  }
  .chapter-divider .dot {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: var(--planet-accent);
    box-shadow: 0 0 8px var(--planet-accent);
    flex: 0 0 auto;
  }
</style>
