<script>
  // Professor Quibble, the know-it-all rival. He boasts (intro), then quizzes the
  // learner one question at a time — no retries. The moment a choice is picked it
  // locks and earns a smug per-question jab: grudging on a right answer, gloating on a
  // wrong one. After the last question he reacts to the whole run — a sour "win" line
  // if every answer was right, a smug "lose" line otherwise. Bragging rights only:
  // nothing is awarded or persisted, so interacting again starts a fresh challenge.
  // Each pick is reported as an ungraded LMS interaction, mirroring KeeperOverlay, so
  // it shows up in cmi.interactions but stays out of the gradebook.
  import { onMount } from 'svelte';
  import { useQuestion } from 'tessera-learn';
  import { gradeRival, pickSmug } from '../lib/people.js';
  import Patron from './Patron.svelte';

  // `faced` is the player's past outcome with this rival ('won' | 'lost'), or null if
  // they've never finished a challenge. When set, we skip the quiz entirely and show a
  // single smug remark — no questions, no LMS interactions. `onComplete(outcome)` fires
  // once, the moment a fresh run reaches its result, so the parent can persist it.
  let { patron, onResolve, faced = null, onComplete } = $props();

  const questions = patron.quiz;
  const reactions = patron.reactions;

  // Snapshot the outcome once at mount. `faced` is a "as of when you opened him" fact —
  // it must NOT change during this overlay's life. Reading it live would let a fresh
  // run's own onComplete (which records the outcome) flip the open result screen into
  // the smug view, blanking the reaction. Capture here; the next open reads the update.
  const wasFaced = faced;
  const smugLine = wasFaced ? pickSmug(patron, wasFaced) : null;

  let dlg;
  let phase = $state('intro'); // 'intro' | 'quiz' | 'result'
  let qIndex = $state(0);
  let revealed = $state(false); // current question answered + locked?
  let picks = $state(questions.map(() => null)); // chosen option index per question

  // One ungraded standalone question per quiz item, reported on pick (like the keeper).
  // Skipped entirely once faced — a smug brush-off reports nothing.
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

  let primaryBtn = $state(null); // current Continue/advance button; null mid-question

  // Focus the dialog (not a button) on open so nothing looks tab-selected; tabindex="-1"
  // keeps it out of the tab order. Enter advances via onKeydown (clicks the current
  // primary). Refocus the dialog after each transition so Enter keeps working and the
  // just-clicked button doesn't keep a ring.
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

<dialog bind:this={dlg} class="rival zoo-modal" tabindex="-1" aria-labelledby="rival-title" onkeydown={onKeydown} onclose={() => onResolve()}>
  <div class="who" aria-hidden="true"><Patron {...patron.look} /></div>

  {#if wasFaced}
    <h2 id="rival-title">{patron.name}</h2>
    <p class="prompt result">{smugLine}</p>
    <button class="continue" bind:this={primaryBtn} onclick={() => dlg.close()}>Continue →</button>
  {:else if phase === 'intro'}
    <h2 id="rival-title">{patron.name}</h2>
    <p class="prompt intro">{patron.intro}</p>
    <button class="continue" bind:this={primaryBtn} onclick={startQuiz}>I’m ready →</button>
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
      <button class="continue" bind:this={primaryBtn} onclick={advance}>
        {qIndex < questions.length - 1 ? 'Next question →' : 'See how you did →'}
      </button>
    {/if}
  {:else}
    <h2 id="rival-title">{result.won ? 'You beat him!' : 'He got you this time'}</h2>
    <p class="prompt result">{result.won ? reactions.win : reactions.lose}</p>
    <p class="tally">You answered {result.correctCount} of {questions.length} correctly.</p>
    <button class="continue" bind:this={primaryBtn} onclick={() => dlg.close()}>Continue →</button>
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
  .choice.right {
    border-color: var(--zoo-accent-deep);
    background: var(--zoo-accent, #e7f0e7);
  }
  .choice.wrong {
    border-color: var(--zoo-error, #dc2626);
    background: #fbeaea;
  }
  .choice:disabled {
    cursor: default;
    opacity: 0.9;
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
