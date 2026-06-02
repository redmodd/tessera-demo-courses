<script>
  let { name, agency, dates, summary = '', children } = $props();
  let open = $state(false);
  const panelId = `mission-${Math.random().toString(36).slice(2, 9)}`;
</script>

{#if children}
  <button
    class="card expandable"
    class:open
    onclick={() => (open = !open)}
    aria-expanded={open}
    aria-controls={panelId}
  >
    <div class="patch" aria-hidden="true">
      <span class="patch-inner">{name.charAt(0)}</span>
    </div>
    <div class="info">
      <strong>{name}</strong>
      <div class="line">
        <span class="agency">{agency}</span>
        <span class="dates">{dates}</span>
      </div>
      {#if summary}<p class="summary">{summary}</p>{/if}
    </div>
    <span class="chev" class:rotated={open} aria-hidden="true">▾</span>
  </button>
  {#if open}
    <div class="expanded" id={panelId}>
      {@render children()}
    </div>
  {/if}
{:else}
  <div class="card">
    <div class="patch" aria-hidden="true">
      <span class="patch-inner">{name.charAt(0)}</span>
    </div>
    <div class="info">
      <strong>{name}</strong>
      <div class="line">
        <span class="agency">{agency}</span>
        <span class="dates">{dates}</span>
      </div>
      {#if summary}<p class="summary">{summary}</p>{/if}
    </div>
  </div>
{/if}

<style>
  .card {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    width: 100%;
    text-align: left;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(122,162,255,0.15);
    border-radius: 10px;
    padding: 0.95rem 1rem;
    font-family: inherit;
    color: var(--tessera-text);
    transition: background 0.15s, border-color 0.15s;
  }
  .card.expandable { cursor: pointer; }
  .card.expandable:hover { background: rgba(255,255,255,0.04); border-color: rgba(122,162,255,0.3); }
  .card.open { border-color: var(--planet-accent); }

  .patch {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, var(--planet-accent), var(--planet-color));
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 8px rgba(0,0,0,0.4);
  }
  .patch-inner {
    color: #050a1c;
    font-weight: 700;
    font-size: 1.1rem;
  }
  .info {
    flex: 1;
    min-width: 0;
  }
  .info strong { display: block; margin-bottom: 0.15rem; }
  .line {
    display: flex;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--tessera-text-light);
    margin-bottom: 0.25rem;
  }
  .line .agency { color: var(--planet-accent); }
  .summary {
    font-size: 0.9rem;
    color: var(--tessera-text-light);
    margin: 0;
    line-height: 1.5;
  }
  .chev {
    color: var(--tessera-text-light);
    font-size: 1rem;
    transition: transform 0.2s;
    margin-top: 0.4rem;
    flex-shrink: 0;
  }
  .chev.rotated { transform: rotate(180deg); }

  .expanded {
    margin: 0.5rem 0 1rem;
    padding: 1rem 1.1rem;
    background: rgba(122,162,255,0.04);
    border-left: 3px solid var(--planet-accent);
    border-radius: 0 6px 6px 0;
    font-size: 0.95rem;
    line-height: 1.65;
    color: var(--tessera-text-light);
  }
  .expanded :global(p) { margin: 0 0 0.75rem; }
  .expanded :global(p:last-child) { margin-bottom: 0; }
</style>
