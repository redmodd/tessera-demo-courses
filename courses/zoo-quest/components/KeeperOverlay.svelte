<script>
  // The keeper standing in front of an enclosure. A focus-trapped <dialog> (focus
  // trap, inert background, Escape-to-close come for free) that quizzes the learner on
  // the animal, then — once every question is right — reveals the exhibit card and
  // adds it to the Zoodex. Each question goes through useQuestion(graded:false): the
  // answer is reported to the LMS as an interaction, but stays out of the gradebook
  // (so manual completion mode doesn't warn). Revisiting a collected keeper skips the
  // quiz and just shows the card.
  import { onMount } from 'svelte';
  import { useQuestion, usePersistence } from 'tessera-learn';
  import { collect, drawQuestions, KEEPERS } from '../lib/zoodex.js';
  import ZoodexCard from './ZoodexCard.svelte';
  import Keeper from './Keeper.svelte';
  import Icon from './Icon.svelte';

  let { animal, collected = false, onResolve } = $props();

  const store = usePersistence('zoodex');
  // Draw 10 random questions from this animal's 30-question bank. Computed once: the
  // overlay is re-created on each open, so leaving and returning re-rolls a fresh 10.
  const questions = drawQuestions(animal.quizBank, 10);

  let dlg;
  let phase = $state(collected ? 'done' : 'quiz'); // 'quiz' | 'done'
  let qIndex = $state(0);
  let feedback = $state(null); // null | 'wrong' | 'correct'
  let picks = $state(questions.map(() => null)); // selected option index per question

  // One standalone question per quiz item, reported as an LMS interaction on submit.
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

  let primaryBtn = $state(null); // the "Next"/Continue button when shown; else null

  // Focus the dialog (not a button) on open so nothing looks tab-selected; tabindex="-1"
  // keeps it out of the tab order. Enter advances via onKeydown (clicks the current
  // primary). On a correct answer / page change we refocus the dialog so Enter keeps
  // working; a wrong answer leaves focus on the choices so they can pick again.
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

<dialog bind:this={dlg} class="keeper zoo-modal" tabindex="-1" aria-labelledby="keeper-title" onkeydown={onKeydown} onclose={() => onResolve()}>
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
      <button class="continue" bind:this={primaryBtn} onclick={advance}>
        {qIndex < questions.length - 1 ? 'Next question →' : 'See your card →'}
      </button>
    {/if}
  {:else}
    <p class="who" aria-hidden="true"><Icon name={collected ? 'notebook' : 'party'} /></p>
    <h2 id="keeper-title">
      {collected ? `${animal.name} is in your Zoodex` : `${animal.name} added to your Zoodex!`}
    </h2>
    <ZoodexCard {animal} />
    <button class="continue" bind:this={primaryBtn} onclick={() => dlg.close()}>Continue →</button>
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
  .choice,
  .continue {
    padding: 0.7rem 1rem;
    border: 2px solid var(--zoo-bark);
    border-radius: 10px;
    background: #fff;
    color: var(--zoo-ink);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
  .choice.picked {
    background: var(--zoo-ground);
  }
  .choice:disabled {
    cursor: default;
    opacity: 0.85;
  }
  .continue {
    margin-top: 1.25rem;
    background: var(--zoo-accent-deep);
    color: #fff;
    border-color: transparent;
  }
  .choice:hover:not(:disabled),
  .continue:hover {
    filter: brightness(0.97);
  }
  .choice:focus-visible,
  .continue:focus-visible {
    outline: 3px solid var(--zoo-accent);
    outline-offset: 2px;
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
