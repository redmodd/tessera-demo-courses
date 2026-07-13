<script>
  // Bragging rights only: nothing is awarded, and each pick is an ungraded LMS interaction.
  import { useQuestion } from 'tessera-learn';
  import { gradeRival, pickSmug } from '../lib/people.js';
  import { zooDialog } from '../lib/modal.js';
  import Patron from './Patron.svelte';

  // `faced` is the past outcome ('won' | 'lost') or null. When set, we skip the quiz and
  // show a smug remark. `onComplete(outcome)` fires once, when a fresh run reaches its result.
  let { patron, onResolve, faced = null, onComplete } = $props();

  const questions = patron.quiz;
  const reactions = patron.reactions;

  // Snapshot at mount: read live, a fresh run's own onComplete would flip the open result
  // screen into the smug view.
  const wasFaced = faced;
  const smugLine = wasFaced ? pickSmug(patron, wasFaced) : null;

  let dlg;
  let phase = $state('intro'); // 'intro' | 'quiz' | 'result'
  let qIndex = $state(0);
  let revealed = $state(false); // current question answered + locked?
  let picks = $state(questions.map(() => null)); // chosen option index per question

  const handles = wasFaced
    ? []
    : questions.map((q, i) =>
        useQuestion({
          id: `rival-${patron.id}-q${i + 1}`,
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

  const result = $derived(gradeRival(picks, questions));

  function startQuiz() {
    phase = 'quiz';
    dlg.focus();
  }

  function choose(i) {
    if (revealed) return; // locked — no retries
    picks[qIndex] = i;
    const h = handles[qIndex];
    h.setAnswer(i);
    h.submit(); // reports the interaction
    revealed = true;
    dlg.focus();
  }

  function advance() {
    revealed = false;
    if (qIndex < questions.length - 1) qIndex += 1;
    else {
      phase = 'result';
      onComplete?.(result.won ? 'won' : 'lost'); // persist the finished run once
    }
    dlg.focus();
  }
</script>

<dialog bind:this={dlg} use:zooDialog class="rival zoo-modal" tabindex="-1" aria-labelledby="rival-title" onclose={() => onResolve()}>
  <div class="who" aria-hidden="true"><Patron {...patron.look} /></div>

  {#if wasFaced}
    <h2 id="rival-title">{patron.name}</h2>
    <p class="prompt result">{smugLine}</p>
    <button class="continue" onclick={() => dlg.close()}>Continue →</button>
  {:else if phase === 'intro'}
    <h2 id="rival-title">{patron.name}</h2>
    <p class="prompt intro">{patron.intro}</p>
    <button class="continue" onclick={startQuiz}>I’m ready →</button>
  {:else if phase === 'quiz'}
    {@const q = questions[qIndex]}
    <h2 id="rival-title">{patron.name}</h2>
    <p class="prompt">
      <span class="count">Question {qIndex + 1} of {questions.length}</span>
      {q.question}
    </p>

    <div class="choices">
      {#each q.options as opt, i}
        <button
          class="choice"
          class:picked={picks[qIndex] === i}
          class:right={revealed && i === q.correct}
          class:wrong={revealed && picks[qIndex] === i && i !== q.correct}
          aria-pressed={picks[qIndex] === i}
          disabled={revealed}
          onclick={() => choose(i)}
        >
          {opt}
        </button>
      {/each}
    </div>

    {#if revealed}
      {@const right = picks[qIndex] === q.correct}
      <p class="fb {right ? 'right' : 'wrong'}" role="status">
        {right ? reactions.right : reactions.wrong}
      </p>
      <button class="continue" onclick={advance}>
        {qIndex < questions.length - 1 ? 'Next question →' : 'See how you did →'}
      </button>
    {/if}
  {:else}
    <h2 id="rival-title">{result.won ? 'You beat him!' : 'He got you this time'}</h2>
    <p class="prompt result">{result.won ? reactions.win : reactions.lose}</p>
    <p class="tally">You answered {result.correctCount} of {questions.length} correctly.</p>
    <button class="continue" onclick={() => dlg.close()}>Continue →</button>
  {/if}
  <button class="zoo-modal-close" aria-label="Exit" onclick={() => dlg.close()}>✕</button>
</dialog>

<style>
  .rival {
    max-width: 32rem;
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
    font-size: 1.3rem;
  }
  .prompt {
    margin: 0 0 1.25rem;
    line-height: 1.5;
    font-weight: 600;
  }
  .prompt.intro,
  .prompt.result {
    font-style: italic;
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
  .choice.right {
    border-color: var(--zoo-accent-deep);
    background: var(--zoo-accent, #e7f0e7);
  }
  .choice.wrong {
    border-color: var(--zoo-error, #dc2626);
    background: #fbeaea;
  }
  .continue {
    margin-top: 1.25rem;
  }
  .fb {
    margin: 1rem 0 0;
    font-weight: 700;
    font-style: italic;
  }
  .fb.wrong {
    color: var(--zoo-bark);
  }
  .fb.right {
    color: var(--zoo-accent-deep);
  }
  .tally {
    margin: 0.5rem 0 0;
    font-size: 0.9rem;
    color: var(--zoo-text-light, #6b7280);
  }
</style>
