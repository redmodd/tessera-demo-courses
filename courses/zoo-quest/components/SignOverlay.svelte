<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';

  // WORLD.signs supplies per-sign text; the defaults are the gift-shop copy.
  let {
    onResolve,
    title = 'Gift Shop',
    body = 'Welcome! Step inside for plush toys, mugs, tees, and souvenirs.',
  } = $props();

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
  class="sign-info zoo-modal"
  tabindex="-1"
  aria-labelledby="sign-info-title"
  onkeydown={onKeydown}
  onclose={() => onResolve()}
>
  <div class="sign" aria-hidden="true"><Icon name="sign" size="44px" /></div>
  <h2 id="sign-info-title">{title}</h2>
  <p class="line">{body}</p>
  <button class="continue" bind:this={primaryBtn} onclick={() => dlg.close()}>OK</button>
  <button class="zoo-modal-close" aria-label="Close" onclick={() => dlg.close()}>✕</button>
</dialog>

<style>
  .sign-info {
    max-width: 26rem;
    padding: 1.5rem 1.5rem 1.75rem;
    text-align: center;
  }
  .sign {
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
