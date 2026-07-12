<script>
  // Read-only view over the 'zoodex' store: collected entries render as a clickable tile,
  // uncollected ones as a silhouette.
  import { onMount } from 'svelte';
  import { usePersistence } from 'tessera-learn';
  import { readStore, onStoreChange, ALL_CARDS, TOTAL_ANIMALS } from '../lib/zoodex.js';
  import ZoodexCard from './ZoodexCard.svelte';
  import Animal from './Animal.svelte';
  import Icon from './Icon.svelte';

  const store = usePersistence('zoodex');

  let dlg;
  let dex = $state(readStore(store));
  let phase = $state('list'); // 'list' | 'detail'
  let selectedId = $state(null);

  // Keep the grid live: re-read when a card is collected while the modal is open.
  onMount(() => onStoreChange(() => (dex = readStore(store))));

  const collected = $derived(new Set(dex.collected));
  const selected = $derived(ALL_CARDS.find((c) => c.id === selectedId) ?? null);

  function open() {
    phase = 'list';
    dlg.showModal();
    // showModal() would auto-focus the ✕ button, which then looks tab-selected.
    dlg.focus();
  }

  function openDetail(id) {
    selectedId = id;
    phase = 'detail';
  }
</script>

<button class="fab" aria-label="Open Zoodex" onclick={open}>
  <Icon name="notebook" />
</button>

<dialog
  bind:this={dlg}
  class="zoodex zoo-modal"
  tabindex="-1"
  aria-label={phase === 'detail' && selected ? `${selected.name} details` : 'Zoodex'}
  onclose={() => (phase = 'list')}
>
  {#if phase === 'detail' && selected}
    <div class="bar">
      <button class="back" onclick={() => (phase = 'list')}>← Back</button>
      <button class="close" aria-label="Close Zoodex" onclick={() => dlg.close()}>✕</button>
    </div>
    <ZoodexCard animal={selected} />
  {:else}
    <header class="bar">
      <h2>Zoodex</h2>
      <span class="count">{collected.size}/{TOTAL_ANIMALS}</span>
      <button class="close" aria-label="Close Zoodex" onclick={() => dlg.close()}>✕</button>
    </header>

    <div class="grid">
      {#each ALL_CARDS as card}
        {#if collected.has(card.id)}
          <button class="tile" onclick={() => openDetail(card.id)}>
            <span class="emoji" aria-hidden="true"><Animal kind={card.id} /></span>
            <span class="dex">#{card.dex}</span>
            <span class="name">{card.name}</span>
          </button>
        {:else}
          <div class="tile locked" aria-label="Animal #{card.dex}, not yet collected">
            <span class="emoji silhouette" aria-hidden="true"><Animal kind={card.id} /></span>
            <span class="dex">#{card.dex}</span>
            <span class="name">??????</span>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</dialog>

<style>
  .fab {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 6;
    width: 88px;
    height: 88px;
    border: none;
    border-radius: 50%;
    background: var(--zoo-ground);
    color: var(--zoo-ink);
    box-shadow: 0 6px 18px rgba(58, 51, 34, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .fab :global(svg) {
    width: 48px;
    height: 48px;
  }
  .fab:hover {
    filter: brightness(1.08);
  }
  .fab:focus-visible {
    outline: 3px solid var(--zoo-accent);
    outline-offset: 3px;
  }

  .zoodex {
    max-width: 40rem;
    max-height: 85vh;
    overflow: auto;
    padding: 1.25rem 1.5rem 1.5rem;
  }

  .bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.1rem;
  }
  .bar h2 {
    margin: 0;
    font-size: 1.4rem;
  }
  .count {
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--zoo-bark);
  }
  .close {
    margin-left: auto;
    border: 2px solid var(--zoo-bark);
    border-radius: 8px;
    background: #fff;
    color: var(--zoo-ink);
    font: inherit;
    font-weight: 700;
    line-height: 1;
    padding: 0.3rem 0.55rem;
    cursor: pointer;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
  }

  .tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    border: 2px solid var(--zoo-bark);
    border-radius: 12px;
    background: #fff;
    color: var(--zoo-ink);
    font: inherit;
    padding: 0.85rem 0.5rem;
    cursor: pointer;
    text-align: center;
  }
  .tile:hover {
    filter: brightness(0.97);
  }
  .tile:focus-visible {
    outline: 3px solid var(--zoo-accent);
    outline-offset: 2px;
  }
  .tile.locked {
    border-style: dashed;
    border-color: #b3a574;
    background: #f2ead4;
    color: #8a7a52;
    cursor: default;
  }

  .emoji {
    line-height: 1;
  }
  .emoji :global(svg) {
    width: 56px;
    height: 47px;
  }
  .emoji.silhouette :global(svg) {
    filter: brightness(0);
    opacity: 0.85;
  }
  .dex {
    font-weight: 700;
    letter-spacing: 0.06em;
    font-size: 0.75rem;
    color: var(--zoo-bark);
  }
  .tile.locked .dex {
    color: #b3a574;
  }
  .name {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .back {
    border: 2px solid var(--zoo-bark);
    border-radius: 8px;
    background: #fff;
    color: var(--zoo-ink);
    font: inherit;
    font-weight: 600;
    padding: 0.35rem 0.75rem;
    cursor: pointer;
  }
  .back:hover {
    filter: brightness(0.97);
  }
  .back:focus-visible {
    outline: 3px solid var(--zoo-accent);
    outline-offset: 2px;
  }
</style>
