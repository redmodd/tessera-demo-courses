<script>
  import { onDestroy, tick } from 'svelte';
  import { useQuiz, useNavigation, usePersistence } from 'tessera-learn';
  import { game } from './components/game-state.svelte.js';
  import CountdownRing from './components/CountdownRing.svelte';
  import Leaderboard from './components/Leaderboard.svelte';
  import Confetti from './components/Confetti.svelte';
  import { sfx } from './components/sfx.js';
  import courseConfig from './course.config.js';

  let { children } = $props();

  let host = $state(null);
  const quiz = useQuiz({ element: () => host });
  const nav = useNavigation();
  const leaderboardStore = usePersistence('roadsign-leaderboard');

  const DWELL_MS = 1200;
  const LEADERBOARD_CAP = 10;

  // ---------- Game state ----------
  let currentIndex = $state(0);
  let roundStartedAt = $state(0);
  let elapsedMs = $state(0);
  let totalPoints = $state(0);
  let streak = $state(0);
  let bestStreak = $state(0);
  let dwelling = $state(false);
  let lastPoints = $state(0);
  let rafId = null;
  let dwellTimer = null;

  // Reactive helpers
  const round = $derived(game.rounds[currentIndex]);
  const totalRoundMs = $derived((round?.seconds ?? 0) * 1000);
  const remainingMs = $derived(Math.max(0, totalRoundMs - elapsedMs));
  const totalQuestions = $derived(quiz.questions.length);
  const currentQuestion = $derived(quiz.questions[currentIndex]);
  const correctCount = $derived(quiz.questions.reduce((s, q) => s + (q.correct ? 1 : 0), 0));
  const passed = $derived(quiz.score >= quiz.passingScore);

  let entries = $state(leaderboardStore.get() ?? []);
  let attemptWritten = false;
  let confettiToken = $state(0);
  let flashKind = $state(null);
  let timeAnnouncement = $state('');
  let announcedMilestones = new Set();

  // ---------- Timer loop ----------
  $effect(() => {
    // Re-arm whenever currentIndex changes OR the quiz state returns to
    // 'answering' (start, retry).
    const idx = currentIndex;
    if (quiz.state !== 'answering') {
      if (rafId) cancelAnimationFrame(rafId);
      return;
    }
    if (!game.rounds.length) return;
    if (!game.rounds[idx]) return;

    dwelling = false;
    flashKind = null;
    roundStartedAt = performance.now();
    elapsedMs = 0;
    timeAnnouncement = '';
    announcedMilestones = new Set();

    focusActiveRound();
    sfx.play('deal');

    const loop = () => {
      elapsedMs = performance.now() - roundStartedAt;
      if (!dwelling && elapsedMs >= totalRoundMs) {
        elapsedMs = totalRoundMs;
        onTimeout();
        return;
      }
      // Last-3s tick cue
      if (!dwelling && remainingMs > 0 && remainingMs < 3000) {
        sfx.tick();
      }
      if (!dwelling) {
        const secsLeft = Math.ceil(remainingMs / 1000);
        for (const ms of [10, 5]) {
          if (secsLeft === ms && !announcedMilestones.has(ms)) {
            announcedMilestones.add(ms);
            timeAnnouncement = `${ms} seconds remaining`;
          }
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    };
  });

  // ---------- Watch for answer ----------
  $effect(() => {
    if (quiz.state !== 'answering') return;
    if (dwelling) return;
    const cq = currentQuestion;
    if (!cq) return;
    const answer = cq.answer;
    if (answer !== undefined && answer !== '__timeout__') {
      onAnswered(answer);
    }
  });

  function onAnswered(answer) {
    dwelling = true;
    if (rafId) cancelAnimationFrame(rafId);
    const elapsed = performance.now() - roundStartedAt;
    const isCorrect = answer === round.target.id;
    const pts = isCorrect ? Math.max(100, Math.round(1000 - elapsed / 15)) : 0;
    const streakBonus = isCorrect && streak >= 2 ? Math.min(streak * 25, 250) : 0;
    const total = pts + streakBonus;

    totalPoints += total;
    streak = isCorrect ? streak + 1 : 0;
    bestStreak = Math.max(bestStreak, streak);
    lastPoints = total;
    flashKind = isCorrect ? 'correct' : 'wrong';
    if (isCorrect) {
      sfx.play('correct');
      confettiToken++;
    } else {
      sfx.play('wrong');
    }
    quiz.revealFeedback(currentQuestion);
    dwellTimer = setTimeout(advance, DWELL_MS);
  }

  function onTimeout() {
    dwelling = true;
    if (rafId) cancelAnimationFrame(rafId);
    currentQuestion?.setAnswer('__timeout__');
    currentQuestion?.commit();
    streak = 0;
    lastPoints = 0;
    flashKind = 'wrong';
    sfx.play('wrong');
    quiz.revealFeedback(currentQuestion);
    dwellTimer = setTimeout(advance, DWELL_MS);
  }

  async function focusActiveRound() {
    if (!host) return;
    await tick();
    // Keyboard users would otherwise land on <body> when the previous
    // round's card is hidden via display:none.
    const target = host.querySelector('.round-wrapper.active [role="radio"]');
    if (target && document.activeElement !== target) {
      target.focus({ preventScroll: true });
    }
  }

  function advance() {
    flashKind = null;
    if (currentIndex < totalQuestions - 1) {
      currentIndex++;
    } else {
      quiz.submit();
    }
  }

  function handleRetry() {
    if (dwellTimer) clearTimeout(dwellTimer);
    if (rafId) cancelAnimationFrame(rafId);
    game.reroll();
    currentIndex = 0;
    totalPoints = 0;
    streak = 0;
    bestStreak = 0;
    lastPoints = 0;
    flashKind = null;
    dwelling = false;
    attemptWritten = false;
    quiz.retry();
  }

  // ---------- Leaderboard write on submit ----------
  $effect(() => {
    if (quiz.state === 'submitted' && !attemptWritten) {
      attemptWritten = true;
      const entry = {
        attempt: entries.reduce((m, e) => Math.max(m, e.attempt ?? 0), 0) + 1,
        finishedAt: Date.now(),
        correct: correctCount,
        total: totalQuestions,
        scorePct: quiz.score,
        points: totalPoints,
        bestStreak,
        passed,
        latest: true,
      };
      // Keep top-N by points; always preserve the latest attempt even if it fell off.
      const previous = entries.map((e) => ({ ...e, latest: false }));
      const top = [...previous, entry]
        .sort((a, b) => b.points - a.points)
        .slice(0, LEADERBOARD_CAP);
      if (!top.includes(entry)) top.push(entry);
      entries = top;
      leaderboardStore.set(entries);
      if (passed) sfx.play('win');
    }
    if (quiz.state === 'answering') attemptWritten = false;
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
    if (dwellTimer) clearTimeout(dwellTimer);
  });

  function quitToStart() {
    if (dwellTimer) clearTimeout(dwellTimer);
    if (rafId) cancelAnimationFrame(rafId);
    nav.goTo('splash');
  }

  const showExit = courseConfig.export?.standard !== 'web';

  function exitCourse() {
    window.close();
  }
</script>

<div bind:this={host} class="game-shell" class:submitted={quiz.state === 'submitted'} role="region" aria-label="Road Sign Match game">
  <h1 class="sr-only">Road Sign Match</h1>
  {#if quiz.state === 'answering' && round}
    <header class="game-header">
      <div class="header-left">
        <span class="round-pill">Round {currentIndex + 1} / {totalQuestions}</span>
        <span class="tier-pill tier-{round.tier}">Tier {round.tier + 1}</span>
      </div>
      <div class="header-center">
        <CountdownRing remainingMs={dwelling ? totalRoundMs : remainingMs} totalMs={totalRoundMs} />
      </div>
      <div class="header-right">
        <div class="points-tally">
          <span class="points-num" aria-hidden="true">{totalPoints.toLocaleString()}</span>
          <span class="points-label" aria-hidden="true">pts</span>
          <span class="sr-only" aria-live="polite" aria-atomic="true">
            {totalPoints.toLocaleString()} points
          </span>
        </div>
        {#if streak >= 2}
          <span class="streak-pill" aria-label={`Streak bonus: ${streak} in a row`}>
            <span aria-hidden="true">🔥 {streak}</span>
          </span>
        {/if}
        <button class="quit-link" type="button" onclick={quitToStart}>Quit to start</button>
      </div>
    </header>

    <div class="rounds-stack {flashKind ? `flash-${flashKind}` : ''}">
      {#each quiz.questions as q, i (q.id)}
        <div class="round-wrapper" class:active={i === currentIndex}>
          {#if q.render}{@render q.render()}{/if}
        </div>
      {/each}
      {#if lastPoints > 0 && flashKind === 'correct'}
        <div class="points-fly" aria-hidden="true">+{lastPoints}</div>
      {/if}
    </div>

    <Confetti trigger={confettiToken} />
    <div class="sr-only" aria-live="polite" aria-atomic="true">{timeAnnouncement}</div>
  {:else if quiz.state === 'submitted'}
    <div class="results" class:results-passed={passed} class:results-failed={!passed}>
      <p class="results-eyebrow">{passed ? 'Module complete' : 'Try again'}</p>
      <h2 class="results-title">{passed ? 'You passed!' : 'Not quite. Give it another go.'}</h2>
      <div class="score-row">
        <div class="score-block">
          <span class="score-num">{quiz.score}%</span>
          <span class="score-cap">{correctCount} of {totalQuestions} correct</span>
        </div>
        <div class="score-block">
          <span class="score-num">{totalPoints.toLocaleString()}</span>
          <span class="score-cap">points · best streak {bestStreak}</span>
        </div>
      </div>

      <Leaderboard {entries} />

      <div class="results-actions">
        <button class="rs-btn rs-btn--start" type="button" onclick={handleRetry}>Play again</button>
        <button class="rs-btn rs-btn--neutral" type="button" onclick={quitToStart}>Back to start</button>
        {#if showExit}
          <button class="rs-btn rs-btn--neutral" type="button" onclick={exitCourse}>Exit course</button>
        {/if}
      </div>

      {#if passed}
        <Confetti trigger={confettiToken + 1000} burst />
      {/if}
    </div>
  {/if}

  <!-- Children always mounted so SignRound widgets keep their snippet registrations alive. -->
  <div style="display:none">{@render children?.()}</div>
</div>

<style>
  .game-shell {
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding: 1rem;
    color: var(--tessera-text, #111);
  }
  .game-shell.submitted {
    min-height: 100dvh;
  }
  .game-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    margin-bottom: 1rem;
  }
  .header-left, .header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .header-right { justify-content: flex-end; }
  .round-pill, .tier-pill, .streak-pill {
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.05);
  }
  .tier-0 { background: #dcfce7; color: #166534; }
  .tier-1 { background: #fef3c7; color: #92400e; }
  .tier-2 { background: #fee2e2; color: #991b1b; }
  .streak-pill { background: #fef3c7; color: #b45309; }
  .points-tally {
    text-align: right;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  .points-num { display: block; font-size: 1.6rem; font-weight: 700; }
  .points-label { font-size: 0.75rem; color: #6b7280; }
  .quit-link {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 0.75rem;
    text-decoration: underline;
    padding: 0.25rem;
  }
  .quit-link:hover { color: #111; }
  .quit-link:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
    border-radius: 2px;
  }

  .rounds-stack { position: relative; }
  .round-wrapper { display: none; }
  .round-wrapper.active { display: block; }

  .flash-correct { animation: flash-correct 600ms ease-out; }
  .flash-wrong   { animation: flash-wrong   400ms ease-out; }
  @keyframes flash-correct {
    0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0); }
    30%  { box-shadow: 0 0 0 16px rgba(34, 197, 94, 0.25); }
    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
  }
  @keyframes flash-wrong {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }

  .points-fly {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.5rem;
    font-weight: 700;
    color: #16a34a;
    pointer-events: none;
    animation: fly-up 1100ms ease-out forwards;
  }
  @keyframes fly-up {
    0%   { transform: translate(-50%, 20px); opacity: 0; }
    20%  { transform: translate(-50%, 0); opacity: 1; }
    100% { transform: translate(-50%, -40px); opacity: 0; }
  }

  .results {
    text-align: center;
    padding: 3rem 1.5rem;
    max-width: 720px;
    margin: 0 auto;
  }
  .results-eyebrow {
    margin: 0 0 0.5rem;
    font-size: 0.8rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--rs-warning-amber-deep);
  }
  .results-passed .results-eyebrow { color: var(--rs-guide-green); }
  .results-title {
    margin: 0 0 1.5rem;
    font-size: clamp(2rem, 5vw, 2.75rem);
    line-height: 1.15;
    font-weight: 800;
    color: var(--rs-text);
  }
  .results-passed .results-title { color: var(--rs-guide-green); }
  .results-failed .results-title { color: var(--rs-warning-amber-deep); }
  .score-row {
    display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }
  .score-block { display: flex; flex-direction: column; gap: 0.25rem; }
  .score-num { font-size: 2.5rem; font-weight: 700; line-height: 1; font-variant-numeric: tabular-nums; }
  .score-cap { font-size: 0.85rem; color: var(--rs-text-muted); }
  .results-actions { display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.5rem; flex-wrap: wrap; }

  @media (prefers-reduced-motion: reduce) {
    .flash-correct, .flash-wrong, .points-fly { animation: none; }
  }
</style>
