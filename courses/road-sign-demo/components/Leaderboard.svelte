<script>
  let { entries = [] } = $props();

  const sorted = $derived(entries.slice().sort((a, b) => b.points - a.points));
  const personalBest = $derived(sorted[0]?.points ?? 0);

  function formatDate(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      + ' · '
      + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }

  function rankLabel(i) {
    if (i === 1) return '2nd';
    if (i === 2) return '3rd';
    return `${i + 1}th`;
  }
</script>

{#if sorted.length > 0}
  <section class="leaderboard" aria-labelledby="leaderboard-title">
    <h3 id="leaderboard-title" class="lb-title">Leaderboard</h3>
    <ol class="lb-list">
      {#each sorted as e, i (e.finishedAt)}
        <li
          class="lb-row"
          class:best={i === 0 && e.points === personalBest}
          class:latest={e.latest}
          aria-current={e.latest ? 'true' : undefined}
        >
          {#if i === 0}
            <span class="rank">
              <span aria-hidden="true">🏆</span>
              <span class="sr-only">1st</span>
            </span>
          {:else}
            <span class="rank">{rankLabel(i)}</span>
          {/if}
          <div class="meta">
            <span class="when">{formatDate(e.finishedAt)}</span>
            <span class="correct">{e.correct} of {e.total} correct</span>
          </div>
          <div class="score">
            <span class="pts" class:pass={e.passed} class:fail={!e.passed}>
              {e.points.toLocaleString()}
              <span class="pts-label">pts</span>
            </span>
            {#if e.latest}<span class="badge">Latest</span>{/if}
          </div>
        </li>
      {/each}
    </ol>
  </section>
{/if}

<style>
  .leaderboard {
    margin-top: 2rem;
    text-align: left;
    background: var(--rs-bg-amber-gradient-soft);
    border-radius: var(--rs-radius-panel);
    padding: 1.25rem;
  }
  .lb-title {
    margin: 0 0 0.75rem;
    padding: 0 0.25rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--rs-warning-amber-deep);
    font-weight: 700;
  }
  .lb-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .lb-row {
    display: grid;
    grid-template-columns: 3rem 1fr auto;
    gap: 1rem;
    align-items: center;
    padding: 0.75rem 1rem;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: var(--rs-card-shadow);
    transition: transform 150ms ease;
  }
  .lb-row.best {
    background: linear-gradient(90deg, #fffbeb, #fef3c7);
    box-shadow: 0 4px 14px -2px rgba(245, 158, 11, 0.25);
  }
  .lb-row.latest:not(.best) {
    box-shadow: 0 0 0 2px var(--rs-warning-amber), var(--rs-card-shadow);
  }

  .rank {
    font-size: 1.1rem;
    font-weight: 800;
    text-align: center;
    color: var(--rs-text-muted);
    font-variant-numeric: tabular-nums;
  }
  .lb-row.best .rank { font-size: 1.6rem; }

  .meta {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }
  .when {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--rs-text);
  }
  .correct {
    font-size: 0.8rem;
    color: var(--rs-text-muted);
  }

  .score {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .pts {
    font-size: 1.25rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  .pts.pass { color: var(--rs-correct); }
  .pts.fail { color: var(--rs-text-muted); }
  .pts-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--rs-text-muted);
    margin-left: 0.15rem;
  }

  .badge {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    background: var(--rs-warning-amber);
    color: #ffffff;
  }
</style>
