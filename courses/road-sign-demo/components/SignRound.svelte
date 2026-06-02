<script>
  import { onMount, untrack } from 'svelte';
  import { useQuestion } from 'tessera-learn';
  import SignCard from './SignCard.svelte';

  let { round } = $props();

  let selected = $state(null);

  const q = useQuestion({
    id: untrack(() => `roadsign-round-${round.index}`),
    response: () => ({
      type: 'choice',
      response: selected ? [selected] : [],
      correct: [round.target.id],
      options: round.cards.map((c) => c.id),
    }),
    reset: () => {
      selected = null;
    },
  });

  onMount(() => q.setRender(renderRound));

  function pick(cardId) {
    if (q.locked) return;
    selected = cardId;
    q.setAnswer(cardId);
    q.commit();
  }

  function cardState(cardId) {
    if (!q.feedbackVisible) {
      return selected === cardId ? 'selected' : '';
    }
    if (cardId === round.target.id) return 'correct';
    if (cardId === q.answer) return 'incorrect';
    return '';
  }
</script>

{#snippet renderRound()}
  <div class="round">
    <div class="prompt" data-mode={round.mode}>
      {#if round.prompt.kind === 'sign'}
        <div class="prompt-sign">
          <SignCard symbol={round.prompt.sign.id} size="lg" decorative />
        </div>
        <p class="prompt-caption">What is this sign?</p>
      {:else}
        <p class="prompt-text">{round.prompt.text}</p>
      {/if}
    </div>

    <div class="cards" role="radiogroup" aria-label="Choices">
      {#each round.cards as card (card.id)}
        {@const state = cardState(card.id)}
        <button
          type="button"
          role="radio"
          class="card card--{round.cardKind} {state}"
          onclick={() => pick(card.id)}
          aria-label={card.name}
          aria-checked={selected === card.id}
          disabled={q.locked}
        >
          {#if round.cardKind === 'sign'}
            <SignCard symbol={card.id} decorative />
          {:else}
            <span class="card-name">{card.name}</span>
          {/if}
        </button>
      {/each}
    </div>

    {#if q.feedbackVisible}
      <p class="round-feedback" aria-live="polite">
        {#if q.answer === round.target.id}
          <strong>Correct.</strong> {round.target.blurb}
        {:else}
          <strong>{round.target.name}.</strong> {round.target.blurb}
        {/if}
      </p>
    {/if}
  </div>
{/snippet}
