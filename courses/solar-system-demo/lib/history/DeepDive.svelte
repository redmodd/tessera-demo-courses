<script>
  let { title, teaser, children } = $props();
  let open = $state(false);
  const panelId = `deep-dive-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div class="deep" class:open>
  <button class="trigger" onclick={() => (open = !open)} aria-expanded={open} aria-controls={panelId}>
    <span class="badge">Deep dive</span>
    <span class="title">{title}</span>
    <span class="teaser">{teaser}</span>
    <span class="cta">{open ? 'Hide' : 'Read more →'}</span>
  </button>
  {#if open}
    <div class="body" id={panelId}>
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .deep {
    margin: 2rem 0;
    border: 1px solid rgba(122,162,255,0.2);
    border-radius: 12px;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(122,162,255,0.04), transparent);
  }
  .trigger {
    width: 100%;
    background: none;
    border: none;
    color: var(--tessera-text);
    font-family: inherit;
    cursor: pointer;
    padding: 1rem 1.25rem;
    text-align: left;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas:
      "badge title cta"
      "teaser teaser teaser";
    gap: 0.5rem 0.85rem;
    align-items: center;
    transition: background 0.15s;
  }
  .trigger:hover { background: rgba(122,162,255,0.06); }
  .badge {
    grid-area: badge;
    display: inline-block;
    padding: 0.15rem 0.55rem;
    border-radius: 999px;
    background: var(--planet-accent);
    color: #050a1c;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .title {
    grid-area: title;
    font-weight: 600;
  }
  .teaser {
    grid-area: teaser;
    font-size: 0.9rem;
    color: var(--tessera-text-light);
    line-height: 1.5;
  }
  .cta {
    grid-area: cta;
    font-size: 0.85rem;
    color: var(--planet-accent);
    white-space: nowrap;
  }
  .body {
    padding: 1rem 1.25rem 1.25rem;
    border-top: 1px solid rgba(122,162,255,0.15);
    font-size: 0.95rem;
    line-height: 1.65;
  }
  .body :global(p) { margin: 0 0 0.85rem; }
  .body :global(p:last-child) { margin-bottom: 0; }

  @media (max-width: 540px) {
    .trigger { grid-template-areas: "badge cta" "title title" "teaser teaser"; grid-template-columns: 1fr auto; }
  }
</style>
