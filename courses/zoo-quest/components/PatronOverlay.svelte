<script>
  import { pickChatter } from '../lib/people.js';
  import { zooDialog } from '../lib/modal.js';
  import Patron from './Patron.svelte';
  import Keeper from './Keeper.svelte';

  let { patron, onResolve } = $props();

  // A patron may carry its own line pool; fall back to the shared chatter.
  const line = patron.lines
    ? patron.lines[Math.floor(Math.random() * patron.lines.length)]
    : pickChatter();

  let dlg;
</script>

<dialog bind:this={dlg} use:zooDialog class="patron zoo-modal" tabindex="-1" aria-labelledby="patron-title" onclose={() => onResolve()}>
  <div class="who" aria-hidden="true">
    {#if patron.sprite === 'keeper'}<Keeper {...patron.look} />{:else}<Patron {...patron.look} />{/if}
  </div>
  <h2 id="patron-title">{patron.name} says…</h2>
  <p class="line">{line}</p>
  <button class="continue" onclick={() => dlg.close()}>Continue →</button>
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
</style>
