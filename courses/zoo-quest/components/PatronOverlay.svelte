<script>
  // A friendly zoo patron. One quick line — a greeting or a "did you know" fact,
  // chosen 50/50 by pickChatter — in a focus-trapped <dialog>, then Continue. No
  // quiz and no LMS interaction; saying hello again shows a fresh line. The <dialog>
  // gives us the focus trap, inert background, and Escape-to-close for free; however
  // it closes, onResolve fires once so the map can return focus to the avatar.
  import { onMount } from 'svelte';
  import { pickChatter } from '../lib/people.js';
  import Patron from './Patron.svelte';

  let { patron, onResolve } = $props();

  // A patron may carry its own dialog pool (e.g. the gift-shop shopkeeper and
  // shopkeeper). Fall back to the shared savanna chatter when it doesn't.
  const line = patron.lines
    ? patron.lines[Math.floor(Math.random() * patron.lines.length)]
    : pickChatter();

  let dlg;
  let primaryBtn = $state(null);

  // Focus the dialog (not the Continue button) on open, so nothing looks tab-selected;
  // the dialog is tabindex="-1" so it's never a tab stop. Enter still advances via the
  // keydown handler below, which clicks whichever button is the current primary.
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

<dialog bind:this={dlg} class="patron zoo-modal" tabindex="-1" aria-labelledby="patron-title" onkeydown={onKeydown} onclose={() => onResolve()}>
  <div class="who" aria-hidden="true"><Patron {...patron.look} /></div>
  <h2 id="patron-title">{patron.name} says…</h2>
  <p class="line">{line}</p>
  <button class="continue" bind:this={primaryBtn} onclick={() => dlg.close()}>Continue →</button>
  <button class="zoo-modal-close" aria-label="Exit" onclick={() => dlg.close()}>✕</button>
</dialog>

<style>
  .patron {
    max-width: 30rem;
    padding: 1.5rem 1.5rem 1.75rem;
    text-align: center;
  }
  .who {
    margin: 0 0 0.25rem;
    line-height: 1;
  }
  .who :global(svg) {
    width: 64px;
    height: auto;
  }
  h2 {
    margin: 0.25rem 0 0.75rem;
    font-size: 1.2rem;
  }
  .line {
    margin: 0 0 1.5rem;
    line-height: 1.55;
  }
  .continue {
    padding: 0.7rem 1rem;
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
