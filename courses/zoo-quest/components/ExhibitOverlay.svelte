<script>
  // A walk-up display in the Discovery Center: a focus-trapped <dialog> that teaches one
  // theme about one savanna animal. Purely informational — no quiz, no collection, no
  // persistence; it just reveals the facts the keepers quiz on, so a player who reads the
  // room can earn the card. The `display` (from ANIMALS[animal].exhibit.displays[key])
  // carries the `type`, which picks the layout:
  //   poster / diet / specimen / map → an intro line + a short fact list (with type trimmings
  //                                    like a specimen caption or a range region).
  //   size                          → the same fact layout, framed as a comparison.
  //   touchscreen                   → a question with a "Reveal answer" button (interactive).
  // Mirrors SignOverlay's open/focus/Enter/close pattern (onResolve fires once on close so
  // the map can refocus the avatar). Facts/answers are author-authored constants — rendered
  // with {@html} for their inline <strong> emphasis, never user input.
  import { onMount } from 'svelte';
  import Animal from './Animal.svelte';

  let { animal, display, onResolve } = $props();

  const TYPE_LABEL = {
    poster: 'Exhibit',
    diet: 'Diet',
    size: 'Size',
    touchscreen: 'Touchscreen',
    specimen: 'Specimen',
    map: 'Habitat',
  };

  let dlg;
  let primaryBtn = $state(null);
  let revealed = $state(false); // touchscreen: has the answer been shown?

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
  <p class="kicker">{animal.name} · {TYPE_LABEL[display.type] ?? 'Exhibit'}</p>
  <h2 id="exhibit-info-title">{display.title}</h2>

  {#if display.specimen}
    <p class="tag">🔎 {display.specimen}</p>
  {/if}
  {#if display.region}
    <p class="tag">📍 {display.region}</p>
  {/if}

  {#if display.type === 'touchscreen'}
    <p class="question">{display.question}</p>
    {#if revealed}
      <p class="answer">{@html display.answer}</p>
    {:else}
      <button class="reveal" onclick={() => (revealed = true)}>Reveal answer</button>
    {/if}
  {:else}
    {#if display.intro}<p class="intro">{@html display.intro}</p>{/if}
    <ul class="facts">
      {#each display.facts as fact}
        <li>{@html fact}</li>
      {/each}
    </ul>
  {/if}

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
  .kicker {
    margin: 0.35rem 0 0;
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--zoo-text-light, #6b7280);
  }
  h2 {
    margin: 0.1rem 0 0.4rem;
    font-size: 1.4rem;
  }
  .tag {
    display: inline-block;
    margin: 0 0 0.6rem;
    padding: 0.25rem 0.7rem;
    background: var(--zoo-bg-secondary, #f3ede1);
    border: 1px solid var(--zoo-border, #e5e0d4);
    border-radius: 999px;
    font-size: 0.9rem;
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
  /* Touchscreen Q&A */
  .question {
    margin: 0.4rem auto 1rem;
    max-width: 40ch;
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.45;
  }
  .reveal {
    margin: 0 0 1.5rem;
    padding: 0.6rem 1.2rem;
    border: 2px dashed var(--zoo-accent-deep);
    border-radius: 10px;
    background: var(--zoo-bg-secondary, #f3ede1);
    color: var(--zoo-accent-deep);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
  .reveal:hover {
    filter: brightness(0.98);
  }
  .reveal:focus-visible {
    outline: 3px solid var(--zoo-accent);
    outline-offset: 2px;
  }
  .answer {
    margin: 0 auto 1.5rem;
    max-width: 44ch;
    padding: 0.85rem 1rem;
    background: var(--zoo-bg-secondary, #f3ede1);
    border-radius: 10px;
    line-height: 1.5;
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
