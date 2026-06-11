<script>
  // A walk-up exhibit kiosk in the Discovery Center: a focus-trapped <dialog> that teaches
  // one savanna animal. Purely informational — no quiz, no collection, no persistence; it
  // just reveals the facts the keepers quiz on, so a player who reads it can earn the card.
  // Mirrors SignOverlay's open/focus/Enter/close pattern (onResolve fires once on close so
  // the map can refocus the avatar). Facts are author-authored constants — rendered with
  // {@html} for their inline <strong> emphasis, never user input.
  import { onMount } from 'svelte';
  import Animal from './Animal.svelte';

  let { animal, onResolve } = $props();

  let dlg;
  let primaryBtn = $state(null);

  onMount(() => {
    dlg.showModal();
    dlg.focus();
  });

  function onKeydown(e) {
    if (e.key === 'Enter' && e.target === dlg && primaryBtn) {
      e.preventDefault();
      primaryBtn.click();
    }
  }
</script>

<dialog
  bind:this={dlg}
  class="exhibit-info zoo-modal"
  tabindex="-1"
  aria-labelledby="exhibit-info-title"
  onkeydown={onKeydown}
  onclose={() => onResolve()}
>
  <div class="sprite" aria-hidden="true"><Animal kind={animal.id} /></div>
  <h2 id="exhibit-info-title">{animal.name}</h2>
  <p class="stats">{animal.stats}</p>
  <p class="intro">{animal.exhibit.intro}</p>

  <ul class="facts">
    {#each animal.exhibit.facts as fact}
      <li>{@html fact}</li>
    {/each}
  </ul>

  <button class="continue" bind:this={primaryBtn} onclick={() => dlg.close()}>Got it</button>
  <button class="zoo-modal-close" aria-label="Close" onclick={() => dlg.close()}>✕</button>
</dialog>

<style>
  .exhibit-info {
    max-width: 34rem;
    padding: 1.5rem 1.5rem 1.75rem;
    text-align: center;
  }
  .sprite {
    line-height: 1;
  }
  .sprite :global(svg) {
    width: 104px;
    height: 86px;
  }
  h2 {
    margin: 0.35rem 0 0.2rem;
    font-size: 1.4rem;
  }
  .stats {
    margin: 0 0 0.85rem;
    font-style: italic;
    color: var(--zoo-bark);
  }
  .intro {
    margin: 0 auto 1rem;
    max-width: 44ch;
    line-height: 1.5;
  }
  .facts {
    display: inline-block;
    text-align: left;
    max-width: 46ch;
    margin: 0 auto 1.5rem;
    padding-left: 1.2rem;
  }
  .facts li {
    margin: 0.5rem 0;
    line-height: 1.55;
  }
  .continue {
    padding: 0.7rem 1.4rem;
    border: 2px solid transparent;
    border-radius: 10px;
    background: var(--zoo-accent-deep);
    color: #fff;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
  .continue:hover {
    filter: brightness(0.97);
  }
  .continue:focus-visible {
    outline: 3px solid var(--zoo-accent);
    outline-offset: 2px;
  }
</style>
