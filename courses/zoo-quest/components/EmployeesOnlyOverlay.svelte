<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';

  let { onResolve } = $props();

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
  class="staff-only zoo-modal"
  tabindex="-1"
  aria-labelledby="staff-only-title"
  onkeydown={onKeydown}
  onclose={() => onResolve()}
>
  <div class="door" aria-hidden="true"><Icon name="door" size="44px" /></div>
  <h2 id="staff-only-title">Staff Only</h2>
  <p class="line">Sorry, this area’s for zoo staff only!</p>
  <button class="continue" bind:this={primaryBtn} onclick={() => dlg.close()}>OK</button>
  <button class="zoo-modal-close" aria-label="Close" onclick={() => dlg.close()}>✕</button>
</dialog>

<style>
  .staff-only {
    max-width: 26rem;
    padding: 1.5rem 1.5rem 1.75rem;
    text-align: center;
  }
  .door {
    margin: 0 0 0.25rem;
    line-height: 1;
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
