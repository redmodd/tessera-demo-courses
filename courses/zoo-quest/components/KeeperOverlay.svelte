<script>
  // Each question is useQuestion(graded:false): reported to the LMS as an interaction, but
  // out of the gradebook, so manual completion mode doesn't warn.
  import { useQuestion, usePersistence } from 'tessera-learn';
  import { collect, drawQuestions, KEEPERS } from '../lib/zoodex.js';
  import { zooDialog } from '../lib/modal.js';
  import ZoodexCard from './ZoodexCard.svelte';
  import Keeper from './Keeper.svelte';
  import Icon from './Icon.svelte';

  let { animal, collected = false, onResolve } = $props();

  const store = usePersistence('zoodex');
  // Computed once; the overlay is re-created per open, so returning re-rolls a fresh 10.
  const questions = drawQuestions(animal.quizBank, 10);

  let dlg;
  let phase = $state(collected ? 'done' : 'quiz'); // 'quiz' | 'done'
  let qIndex = $state(0);
  let feedback = $state(null); // null | 'wrong' | 'correct'
  let picks = $state(questions.map(() => null)); // selected option index per question

  const handles = questions.map((q, i) =>
    useQuestion({
      id: `keeper-${animal.id}-q${q.n}`,
      graded: false,
      response: () => ({
        type: 'choice',
        response: picks[i] == null ? [] : [q.options[picks[i]]],
        correct: [q.options[q.correct]],
        options: q.options,
      }),
      reset: () => {
        picks[i] = null;
      },
    }),
  );

  function choose(i) {
    if (feedback === 'correct') return; // locked while the "Next" prompt is showing
    picks[qIndex] = i;
    const h = handles[qIndex];
    h.setAnswer(i);
    h.submit(); // reports the interaction + computes correctness
    if (h.correct) {
      feedback = 'correct';
      dlg.focus(); // move off the choice so the Next button becomes the Enter target
    } else {
      feedback = 'wrong';
      h.retry(); // unlock so they can pick again
    }
  }

  function advance() {
    feedback = null;
    if (qIndex < questions.length - 1) {
      qIndex += 1;
    } else {
      collect(store, animal.id); // adds the card (and the region badge if complete)
      phase = 'done';
    }
    dlg.focus();
  }
</script>

<dialog bind:this={dlg} use:zooDialog class="keeper zoo-modal" tabindex="-1" aria-labelledby="keeper-title" onclose={() => onResolve()}>
  {#if phase === 'quiz'}
    {@const q = questions[qIndex]}
    <div class="who" aria-hidden="true"><Keeper {...KEEPERS[animal.id]} /></div>
    <h2 id="keeper-title">The {animal.name} Keeper</h2>
    <p class="prompt">
      <span class="count">Question {qIndex + 1} of {questions.length}</span>
      {q.question}
    </p>

    <div class="choices">
      {#each q.options as opt, i}
        <button
          class="choice"
          class:picked={picks[qIndex] === i}
          aria-pressed={picks[qIndex] === i}
          disabled={feedback === 'correct'}
          onclick={() => choose(i)}
        >
          {opt}
        </button>
      {/each}
    </div>

    {#if feedback === 'wrong'}
      <p class="fb wrong" role="status">Not quite — give it another try.</p>
    {:else if feedback === 'correct'}
      <p class="fb correct" role="status">Correct! <Icon name="party" /></p>
      <button class="continue" onclick={advance}>
        {qIndex < questions.length - 1 ? 'Next question →' : 'See your card →'}
      </button>
    {/if}
  {:else}
    <p class="who" aria-hidden="true"><Icon name={collected ? 'notebook' : 'party'} /></p>
    <h2 id="keeper-title">
      {collected ? `${animal.name} is in your Zoodex` : `${animal.name} added to your Zoodex!`}
    </h2>
    <ZoodexCard {animal} />
    <button class="continue" onclick={() => dlg.close()}>Continue →</button>
  {/if}
  <button class="zoo-modal-close" aria-label="Exit" onclick={() => dlg.close()}>✕</button>
</dialog>

<style>
  .keeper {
    max-width: 32rem;
    padding: 1.5rem 1.5rem 1.75rem;
    text-align: center;
  }
  .who {
    font-size: 3rem;
    margin: 0;
    line-height: 1;
  }
  .who :global(svg) {
    width: 64px;
    height: auto;
  }
  h2 {
    margin: 0.25rem 0 0.75rem;
    font-size: 1.3rem;
  }
  .prompt {
    margin: 0 0 1.25rem;
    line-height: 1.5;
    font-weight: 600;
  }
  .count {
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--zoo-bark);
    margin-bottom: 0.35rem;
  }
  .choices {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .continue {
    margin-top: 1.25rem;
  }
  .fb {
    margin: 1rem 0 0;
    font-weight: 700;
  }
  .fb.wrong {
    color: var(--zoo-bark);
  }
  .fb.correct {
    color: var(--zoo-accent-deep);
  }
</style>
