<script>
  import { zooDialog } from '../lib/modal.js';
  import Icon from './Icon.svelte';

  // WORLD.signs supplies per-sign text; the staff-door dialog passes its own with icon="door".
  let { onResolve, title, body, icon = 'sign' } = $props();

  let dlg;
</script>

<dialog
  bind:this={dlg}
  use:zooDialog
  class="sign-info zoo-modal"
  tabindex="-1"
  aria-labelledby="sign-info-title"
  onclose={() => onResolve()}
>
  <div class="sign" aria-hidden="true"><Icon name={icon} size="44px" /></div>
  <h2 id="sign-info-title">{title}</h2>
  <p class="line">{body}</p>
  <button class="continue" onclick={() => dlg.close()}>OK</button>
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
  }
</style>
