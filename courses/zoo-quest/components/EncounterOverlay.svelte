<script>
  // Collection happens on completing a branch, not on close, so fleeing (Escape) earns
  // nothing and leaves the animal findable again.
  import { usePersistence } from 'tessera-learn';
  import { collect, readStore } from '../lib/zoodex.js';
  import { zooDialog } from '../lib/modal.js';
  import ZoodexCard from './ZoodexCard.svelte';
  import Animal from './Animal.svelte';
  import Icon from './Icon.svelte';

  let { encounter, onResolve } = $props();

  const store = usePersistence('zoodex');
  // Captured before collect() runs: encounters repeat, so a re-find celebrates the sighting
  // rather than announcing a new card.
  const alreadyHad = readStore(store).collected.includes(encounter.id);

  let dlg;
  let chosen = $state(null); // index of the picked branch, or null before choosing
  let phase = $state('choose'); // 'choose' | 'reply' | 'card'

  function pick(i) {
    chosen = i;
    phase = 'reply';
    dlg.focus();
  }

  function reveal() {
    collect(store, encounter.id); // add the hidden animal to the Zoodex (no region badge)
    phase = 'card';
    dlg.focus();
  }
</script>

<dialog
  bind:this={dlg}
  use:zooDialog
  class="encounter zoo-modal"
  tabindex="-1"
  aria-labelledby="enc-title"
  onclose={() => onResolve()}
>
  {#if phase === 'card'}
    <p class="emoji celebrate" aria-hidden="true"><Icon name="party" /></p>
    <h2 id="enc-title">
      {alreadyHad
        ? `You spotted the ${encounter.name} again!`
        : `${encounter.name} added to your Zoodex!`}
    </h2>
    <ZoodexCard animal={encounter} />
    <button class="continue" onclick={() => dlg.close()}>Continue →</button>
  {:else}
    <p class="emoji" aria-hidden="true"><Animal kind={encounter.id} /></p>
    <h2 id="enc-title">A wild {encounter.name} appears!</h2>

    {#if phase === 'choose'}
      <p class="setup">{encounter.setup}</p>
      <div class="choices">
        {#each encounter.choices as choice, i}
          <button class="choice" onclick={() => pick(i)}>{choice.label}</button>
        {/each}
      </div>
    {:else}
      <p class="reply">{@html encounter.choices[chosen].reply}</p>
      <button class="continue" onclick={reveal}>Continue →</button>
    {/if}
  {/if}
  <button class="zoo-modal-close" aria-label="Exit" onclick={() => dlg.close()}>✕</button>
</dialog>

<style>
  .encounter {
    max-width: 30rem;
    padding: 1.5rem 1.5rem 1.75rem;
    text-align: center;
  }
  .emoji {
    margin: 0;
    line-height: 1;
  }
  .emoji :global(svg) {
    width: 72px;
    height: 60px;
  }
  .emoji.celebrate :global(svg) {
    width: 56px;
    height: 56px;
  }
  h2 {
    margin: 0.25rem 0 0.75rem;
    font-size: 1.3rem;
  }
  .setup {
    margin: 0 0 1.25rem;
    line-height: 1.5;
  }
  .reply {
    margin: 0 0 1.5rem;
    line-height: 1.55;
    text-align: left;
  }
  .choices {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
</style>
