<script>
  import { planets } from './planets.js';
  import Icon from './Icon.svelte';
  import Modal from './Modal.svelte';

  let { open = $bindable(false) } = $props();

  let exited = $state(false);

  function exitModule() {
    // Attempt to close the launcher window. In an LMS iframe this is a no-op
    // (and harmless); the SCORM/cmi5 adapter's Terminate path still owns
    // shutdown sequencing. We do NOT replace document.body, which would
    // destroy the Svelte root before onDestroy hooks flush the adapter.
    window.close();
    exited = true;
  }
</script>

<Modal
  bind:open
  label="Module complete"
  maxWidth="520px"
  centered
  closable={!exited}
>
  {#snippet children({ close })}
    {#if exited}
      <h2 id="module-complete-title">You may now close this tab.</h2>
      <p class="lede">Thanks for exploring the solar system.</p>
    {:else}
      <div class="emoji"><Icon name="firework" /></div>
      <h2 id="module-complete-title">Module complete</h2>
      <p class="lede">
        You've visited every planet in the solar system. {planets.length} worlds, one star,
        and a few hundred years of human curiosity later: congratulations.
      </p>
      <p class="hint">
        Stay and keep exploring (the Cosmic Challenge always has something new),
        or close the module if you're done.
      </p>
      <div class="buttons">
        <button class="primary" onclick={close}>Keep exploring</button>
        <button class="ghost" onclick={exitModule}>Exit module</button>
      </div>
    {/if}
  {/snippet}
</Modal>

<style>
  .emoji {
    font-size: 3.5rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 300;
    margin: 0 0 1rem;
    letter-spacing: 0.01em;
  }

  .lede {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--tessera-text);
    margin: 0 0 1rem;
  }

  .hint {
    font-size: 0.9rem;
    line-height: 1.55;
    color: var(--tessera-text-light);
    margin: 0 0 1.5rem;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .primary, .ghost {
    font-family: inherit;
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
    border-radius: 999px;
    cursor: pointer;
    border: none;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .primary {
    background: var(--tessera-primary);
    color: #050a1c;
    font-weight: 600;
  }
  .primary:hover { background: var(--tessera-primary-light); }

  .ghost {
    background: transparent;
    color: var(--tessera-text-light);
    border: 1px solid rgba(122,162,255,0.3);
  }
  .ghost:hover { color: var(--tessera-text); border-color: var(--tessera-primary); }
</style>
