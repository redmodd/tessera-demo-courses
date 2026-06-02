<script>
  import { usePersistence, useNavigation } from 'tessera-learn';
  import {
    drawTen,
    scoreBand,
    planetNameFor,
    isAnswerCorrect,
    shuffle,
  } from './questions.js';
  import Icon from './Icon.svelte';
  import Modal from './Modal.svelte';
  import ChallengeInteractionReporter from './ChallengeInteractionReporter.svelte';

  let { open = $bindable(false) } = $props();

  const nav = useNavigation();

  const store = usePersistence('cosmic-challenge:best');
  let best = $state(store.get()?.best ?? null);

  let phase = $state('idle');
  let questions = $state([]);
  let index = $state(0);
  let answered = $state(false);
  let lastCorrect = $state(false);
  let correctCount = $state(0);

  let mcSelected = $state(null);
  let seqOrder = $state([]);
  let matchAssignments = $state({});
  let matchRightOrder = $state([]);
  let matchArmedLeft = $state(null);
  let sliderValue = $state(0);
  let hotspotPick = $state(null);

  function start() {
    questions = drawTen();
    index = 0;
    correctCount = 0;
    setupQuestion(0);
    phase = 'playing';
  }

  function setupQuestion(i) {
    answered = false;
    lastCorrect = false;
    mcSelected = null;
    matchAssignments = {};
    matchArmedLeft = null;
    hotspotPick = null;
    const q = questions[i];
    const kind = q.kind ?? 'mc';
    if (kind === 'sequencing') {
      seqOrder = shuffleAway(q.items);
    }
    if (kind === 'matching') {
      matchRightOrder = shuffleAway(q.pairs.map((p) => p.right));
    }
    if (kind === 'slider') {
      const step = q.step || 1;
      sliderValue = Math.round(((q.min + q.max) / 2) / step) * step;
    }
  }

  // Reshuffle until the order differs from the input, so the learner never
  // starts on the trivially-correct arrangement. Bounded to avoid a hang on
  // 1-element arrays.
  function shuffleAway(items) {
    let order = shuffle(items);
    let attempts = 0;
    while (order.every((v, j) => v === items[j]) && attempts++ < 6) {
      order = shuffle(items);
    }
    return order;
  }

  function currentAnswer(q) {
    const kind = q.kind ?? 'mc';
    if (kind === 'mc') return mcSelected;
    if (kind === 'sequencing') return seqOrder;
    if (kind === 'matching') return matchAssignments;
    if (kind === 'slider') return sliderValue;
    if (kind === 'hotspot') return hotspotPick;
    return null;
  }

  function canSubmit(q) {
    if (answered) return false;
    const kind = q.kind ?? 'mc';
    if (kind === 'matching') return q.pairs.every((p) => matchAssignments[p.left]);
    if (kind === 'hotspot') return hotspotPick != null;
    return true;
  }

  function commit() {
    const q = questions[index];
    const ok = isAnswerCorrect(q, currentAnswer(q));
    lastCorrect = ok;
    answered = true;
    if (ok) correctCount++;
  }

  function pickOption(i) {
    if (answered) return;
    mcSelected = i;
    commit();
  }

  function moveItem(from, dir) {
    if (answered) return;
    const to = from + dir;
    if (to < 0 || to >= seqOrder.length) return;
    const arr = [...seqOrder];
    [arr[from], arr[to]] = [arr[to], arr[from]];
    seqOrder = arr;
  }

  function pickLeft(left) {
    if (answered) return;
    matchArmedLeft = matchArmedLeft === left ? null : left;
  }

  function pickRight(right) {
    if (answered) return;
    if (!matchArmedLeft) {
      const pairedLeft = Object.keys(matchAssignments).find((l) => matchAssignments[l] === right);
      if (pairedLeft) {
        const next = { ...matchAssignments };
        delete next[pairedLeft];
        matchAssignments = next;
      }
      return;
    }
    const next = { ...matchAssignments };
    for (const [l, r] of Object.entries(next)) {
      if (r === right) delete next[l];
    }
    next[matchArmedLeft] = right;
    matchAssignments = next;
    matchArmedLeft = null;
  }

  function onHotspotClick(e) {
    if (answered) return;
    // Synthetic clicks (e.g. keyboard activation on the button) don't carry
    // pointer coordinates — `clientX/Y` are 0. Skip those; keyboard users
    // place the pin via the arrow-key handler below.
    if (e.detail === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    hotspotPick = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }

  const HOTSPOT_STEP = 4; // percent of image per arrow press
  function onHotspotKeydown(e) {
    if (answered) return;
    const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (!arrows.includes(e.key) && e.key !== 'Enter' && e.key !== ' ') return;
    // Enter / Space confirm the current pin (which already exists); arrows
    // place or nudge it.
    if (e.key === 'Enter' || e.key === ' ') {
      if (!hotspotPick) {
        e.preventDefault();
        hotspotPick = { x: 50, y: 50 };
      }
      return;
    }
    e.preventDefault();
    const cur = hotspotPick ?? { x: 50, y: 50 };
    let { x, y } = cur;
    if (e.key === 'ArrowUp') y -= HOTSPOT_STEP;
    if (e.key === 'ArrowDown') y += HOTSPOT_STEP;
    if (e.key === 'ArrowLeft') x -= HOTSPOT_STEP;
    if (e.key === 'ArrowRight') x += HOTSPOT_STEP;
    hotspotPick = {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
  }

  function next() {
    if (index < questions.length - 1) {
      index++;
      setupQuestion(index);
    } else {
      phase = 'finished';
      if (best === null || correctCount > best) {
        best = correctCount;
        store.set({ best });
      }
    }
  }

  function resetPhase() {
    if (phase === 'finished') phase = 'idle';
  }

  function goToPlanet(slug) {
    open = false;
    resetPhase();
    nav.goTo(slug);
  }

  $effect(() => {
    if (open && phase === 'idle') start();
  });

  function kindLabel(kind) {
    switch (kind) {
      case 'sequencing': return 'Put in order';
      case 'matching': return 'Match the pairs';
      case 'slider': return 'Estimate';
      case 'hotspot': return 'Click the spot';
      default: return 'Multiple choice';
    }
  }

  function fmtSliderValue(v, q) {
    return q.unit ? `${v} ${q.unit}` : `${v}`;
  }
</script>

<Modal bind:open label="Cosmic Challenge" onclose={resetPhase}>
  {#snippet children({ close })}
    {#if phase === 'playing'}
      {@const q = questions[index]}
      {@const kind = q.kind ?? 'mc'}
      {#key index}
        <ChallengeInteractionReporter
          question={q}
          getAnswer={() => currentAnswer(q)}
          submitNow={answered}
        />
      {/key}
      <header class="head">
        <span class="badge">Cosmic Challenge</span>
        <span class="kind-chip">{kindLabel(kind)}</span>
        <span class="counter">Question {index + 1} of {questions.length}</span>
      </header>
      <h2 class="prompt">{q.question}</h2>

      {#if kind === 'mc'}
        <div class="options">
          {#each q.options as opt, i}
            <button
              class="opt"
              class:correct={answered && i === q.correct}
              class:wrong={answered && i === mcSelected && i !== q.correct}
              class:dim={answered && i !== q.correct && i !== mcSelected}
              disabled={answered}
              onclick={() => pickOption(i)}
            >
              <span class="letter">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
            </button>
          {/each}
        </div>

      {:else if kind === 'sequencing'}
        <p class="hint-line">Use the arrows to put these in the right order, top → bottom.</p>
        <ol class="seq">
          {#each seqOrder as item, i (item)}
            {@const correctIdx = q.items.indexOf(item)}
            {@const placed = answered && correctIdx === i}
            {@const misplaced = answered && correctIdx !== i}
            <li class="seq-item" class:placed class:misplaced>
              <span class="seq-pos">{i + 1}</span>
              <span class="seq-label">{item}</span>
              {#if answered}
                <span class="seq-truth">should be #{correctIdx + 1}</span>
              {:else}
                <span class="seq-controls">
                  <button
                    class="seq-btn"
                    type="button"
                    aria-label="Move {item} up"
                    disabled={i === 0}
                    onclick={() => moveItem(i, -1)}
                  >↑</button>
                  <button
                    class="seq-btn"
                    type="button"
                    aria-label="Move {item} down"
                    disabled={i === seqOrder.length - 1}
                    onclick={() => moveItem(i, 1)}
                  >↓</button>
                </span>
              {/if}
            </li>
          {/each}
        </ol>

      {:else if kind === 'matching'}
        <p class="hint-line">
          {#if matchArmedLeft}
            Now click the matching item on the right.
          {:else}
            Pick an item on the left, then its match on the right. Click again to unpair.
          {/if}
        </p>
        <div class="match-grid">
          <ul class="match-col">
            {#each q.pairs as p (p.left)}
              {@const assigned = matchAssignments[p.left]}
              {@const ok = answered && assigned === p.right}
              {@const bad = answered && assigned && assigned !== p.right}
              <li>
                <button
                  class="match-pill match-left"
                  class:armed={matchArmedLeft === p.left}
                  class:assigned={!!assigned && !answered}
                  class:correct={ok}
                  class:wrong={bad}
                  disabled={answered}
                  aria-pressed={matchArmedLeft === p.left}
                  onclick={() => pickLeft(p.left)}
                >
                  <span>{p.left}</span>
                  {#if assigned}
                    <span class="match-meta">→ {assigned}</span>
                  {/if}
                </button>
              </li>
            {/each}
          </ul>
          <ul class="match-col">
            {#each matchRightOrder as r (r)}
              {@const usedBy = Object.keys(matchAssignments).find((l) => matchAssignments[l] === r)}
              {@const ok = answered && usedBy && q.pairs.find((p) => p.left === usedBy)?.right === r}
              {@const bad = answered && usedBy && q.pairs.find((p) => p.left === usedBy)?.right !== r}
              <li>
                <button
                  class="match-pill match-right"
                  class:assigned={!!usedBy && !answered}
                  class:correct={ok}
                  class:wrong={bad}
                  disabled={answered}
                  onclick={() => pickRight(r)}
                >
                  {r}
                </button>
              </li>
            {/each}
          </ul>
        </div>
        {#if answered}
          <div class="match-key">
            <strong>Correct pairs:</strong>
            <ul>
              {#each q.pairs as p}
                <li>{p.left} → {p.right}</li>
              {/each}
            </ul>
          </div>
        {/if}

      {:else if kind === 'slider'}
        {@const correctPct = ((q.correct - q.min) / (q.max - q.min)) * 100}
        {@const tolPct = (q.tolerance / (q.max - q.min)) * 100}
        <div class="slider-wrap">
          <div class="slider-readout">
            <span class="slider-value">{fmtSliderValue(sliderValue, q)}</span>
          </div>
          <div class="slider-track-wrap">
            {#if answered}
              <span
                class="slider-band"
                style="left:{Math.max(0, correctPct - tolPct)}%; width:{Math.min(100, tolPct * 2)}%;"
              ></span>
              <span class="slider-mark" style="left:{correctPct}%;"></span>
            {/if}
            <input
              class="slider"
              type="range"
              min={q.min}
              max={q.max}
              step={q.step}
              bind:value={sliderValue}
              disabled={answered}
            />
          </div>
          <div class="slider-scale">
            <span>{fmtSliderValue(q.min, q)}</span>
            <span>{fmtSliderValue(q.max, q)}</span>
          </div>
          {#if answered}
            <p class="slider-truth">
              Correct: <strong>{fmtSliderValue(q.correct, q)}</strong>
              <span class="slider-tol">(±{fmtSliderValue(q.tolerance, q)})</span>
            </p>
          {/if}
        </div>

      {:else if kind === 'hotspot'}
        <div class="hotspot-wrap">
          <button
            type="button"
            class="hotspot-img-btn"
            onclick={onHotspotClick}
            onkeydown={onHotspotKeydown}
            disabled={answered}
            aria-label={`${q.alt} Click to drop a pin, or use arrow keys to position one.`}
          >
            <img class="hotspot-img" src={q.image} alt="" draggable="false" />
            {#if hotspotPick}
              <span class="hotspot-pin" style="left:{hotspotPick.x}%; top:{hotspotPick.y}%;"></span>
            {/if}
            {#if answered}
              {#each Array.isArray(q.target) ? q.target : [q.target] as zone}
                <span
                  class="hotspot-target"
                  class:hit={lastCorrect}
                  style="left:{zone.cx}%; top:{zone.cy}%; width:{zone.r * 2}%; padding-bottom:{zone.r * 2}%;"
                ></span>
              {/each}
            {/if}
          </button>
          {#if !answered}
            <p class="hint-line">
              {#if !hotspotPick}
                Click anywhere on the image to drop a pin, or press an arrow key to start at the centre.
              {:else}
                Use arrow keys to nudge the pin, or click to move it.
              {/if}
            </p>
          {/if}
        </div>
      {/if}

      {#if !answered && q.planet && kind === 'mc'}
        <button
          class="hint"
          type="button"
          onclick={() => goToPlanet(q.planet)}
          title="Open {planetNameFor(q.planet)}'s history page"
        >
          Stuck? Read about {planetNameFor(q.planet)} →
        </button>
      {/if}

      {#if !answered && kind !== 'mc'}
        <button
          class="next"
          type="button"
          disabled={!canSubmit(q)}
          onclick={commit}
        >
          Submit answer
        </button>
      {/if}

      {#if answered}
        <div class="reveal">
          <strong>{lastCorrect ? 'Correct.' : 'Not quite.'}</strong>
          <span>{q.reveal}</span>
          {#if q.planet}
            <button
              class="reveal-link"
              type="button"
              onclick={() => goToPlanet(q.planet)}
            >
              Read more about {planetNameFor(q.planet)} →
            </button>
          {/if}
        </div>
        <button class="next" onclick={next}>
          {index < questions.length - 1 ? 'Next →' : 'See your score'}
        </button>
      {/if}
    {:else if phase === 'finished'}
      {@const band = scoreBand(correctCount)}
      <div class="result">
        <div class="result-emoji"><Icon name={band.icon} /></div>
        <div class="result-score">{correctCount} / 10</div>
        <div class="result-title">{band.title}</div>
        {#if best !== null}
          <p class="best">Best so far: {best} / 10</p>
        {/if}
        <div class="result-buttons">
          <button class="primary" onclick={start}>Play again with new questions</button>
          <button class="ghost" onclick={close}>Back to the solar system</button>
        </div>
      </div>
    {/if}
  {/snippet}
</Modal>

<style>
  .head {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem 1rem;
    align-items: center;
    margin-bottom: 1.25rem;
  }
  .badge {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--tessera-primary);
  }
  .kind-chip {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--tessera-text-light);
    border: 1px solid rgba(122,162,255,0.25);
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
  }
  .counter {
    font-size: 0.85rem;
    color: var(--tessera-text-light);
    margin-left: auto;
  }

  .prompt {
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0 0 1.25rem;
    line-height: 1.35;
  }

  .hint-line {
    font-size: 0.85rem;
    color: var(--tessera-text-light);
    margin: 0 0 0.85rem;
  }

  .options {
    display: grid;
    gap: 0.6rem;
    margin-bottom: 1.25rem;
  }

  .opt {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    text-align: left;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(122,162,255,0.18);
    color: var(--tessera-text);
    padding: 0.95rem 1.1rem;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, transform 0.15s;
    font-size: 1rem;
  }
  .opt:hover:not(:disabled) {
    background: rgba(122,162,255,0.08);
    border-color: rgba(122,162,255,0.4);
  }
  .opt:disabled { cursor: default; }
  .opt.correct {
    background: rgba(74, 222, 128, 0.12);
    border-color: rgba(74, 222, 128, 0.55);
  }
  .opt.wrong {
    background: rgba(248, 113, 113, 0.12);
    border-color: rgba(248, 113, 113, 0.55);
  }
  .opt.dim { opacity: 0.5; }

  .letter {
    display: inline-flex;
    width: 1.6rem;
    height: 1.6rem;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(122,162,255,0.15);
    color: var(--tessera-primary-light);
    font-weight: 600;
    font-size: 0.85rem;
    flex-shrink: 0;
  }
  .opt.correct .letter { background: rgba(74,222,128,0.3); color: #c9f3d3; }
  .opt.wrong .letter { background: rgba(248,113,113,0.3); color: #fecaca; }

  .seq {
    list-style: none;
    padding: 0;
    margin: 0 0 1.25rem;
    display: grid;
    gap: 0.5rem;
  }
  .seq-item {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(122,162,255,0.18);
    padding: 0.7rem 0.85rem;
    border-radius: 10px;
  }
  .seq-pos {
    display: inline-flex;
    width: 1.6rem;
    height: 1.6rem;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(122,162,255,0.15);
    color: var(--tessera-primary-light);
    font-weight: 600;
    font-size: 0.85rem;
    flex-shrink: 0;
  }
  .seq-label { flex: 1; }
  .seq-truth {
    font-size: 0.8rem;
    color: var(--tessera-text-light);
  }
  .seq-controls { display: flex; gap: 0.3rem; }
  .seq-btn {
    width: 1.9rem;
    height: 1.9rem;
    border-radius: 6px;
    border: 1px solid rgba(122,162,255,0.3);
    background: rgba(122,162,255,0.05);
    color: var(--tessera-text);
    cursor: pointer;
    font-size: 0.95rem;
  }
  .seq-btn:hover:not(:disabled) {
    background: rgba(122,162,255,0.15);
  }
  .seq-btn:disabled { opacity: 0.3; cursor: default; }
  .seq-item.placed {
    background: rgba(74,222,128,0.1);
    border-color: rgba(74,222,128,0.5);
  }
  .seq-item.placed .seq-pos { background: rgba(74,222,128,0.3); color: #c9f3d3; }
  .seq-item.misplaced {
    background: rgba(248,113,113,0.1);
    border-color: rgba(248,113,113,0.5);
  }
  .seq-item.misplaced .seq-pos { background: rgba(248,113,113,0.3); color: #fecaca; }

  .match-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    margin-bottom: 1rem;
  }
  .match-col { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.45rem; }
  .match-pill {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.15rem;
    width: 100%;
    text-align: left;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(122,162,255,0.2);
    color: var(--tessera-text);
    padding: 0.65rem 0.85rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: background 0.15s, border-color 0.15s;
  }
  .match-pill:hover:not(:disabled) {
    background: rgba(122,162,255,0.08);
    border-color: rgba(122,162,255,0.45);
  }
  .match-pill:disabled { cursor: default; }
  .match-pill.armed {
    background: rgba(122,162,255,0.18);
    border-color: var(--tessera-primary);
    box-shadow: 0 0 0 2px rgba(122,162,255,0.2);
  }
  .match-pill.assigned {
    background: rgba(122,162,255,0.1);
    border-color: rgba(122,162,255,0.5);
  }
  .match-pill.correct {
    background: rgba(74,222,128,0.12);
    border-color: rgba(74,222,128,0.55);
  }
  .match-pill.wrong {
    background: rgba(248,113,113,0.12);
    border-color: rgba(248,113,113,0.55);
  }
  .match-meta {
    font-size: 0.78rem;
    color: var(--tessera-text-light);
  }
  .match-key {
    background: rgba(122,162,255,0.05);
    border: 1px dashed rgba(122,162,255,0.3);
    border-radius: 8px;
    padding: 0.65rem 0.85rem;
    margin-bottom: 1rem;
    font-size: 0.88rem;
  }
  .match-key strong { display: block; margin-bottom: 0.25rem; color: var(--tessera-primary-light); }
  .match-key ul { margin: 0; padding-left: 1.1rem; }

  .slider-wrap {
    background: rgba(122,162,255,0.04);
    border: 1px solid rgba(122,162,255,0.15);
    border-radius: 12px;
    padding: 1.1rem 1.2rem 1rem;
    margin-bottom: 1.25rem;
  }
  .slider-readout {
    text-align: center;
    margin-bottom: 0.85rem;
  }
  .slider-value {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--tessera-primary-light);
  }
  .slider-track-wrap {
    position: relative;
    height: 32px;
    display: flex;
    align-items: center;
  }
  .slider {
    position: relative;
    z-index: 2;
    width: 100%;
    accent-color: var(--tessera-primary);
  }
  .slider-band {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 8px;
    background: rgba(74,222,128,0.25);
    border-radius: 4px;
    z-index: 1;
  }
  .slider-mark {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 3px;
    height: 18px;
    background: rgba(74,222,128,0.9);
    border-radius: 2px;
    z-index: 1;
  }
  .slider-scale {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--tessera-text-light);
    margin-top: 0.35rem;
  }
  .slider-truth {
    margin: 0.7rem 0 0;
    text-align: center;
    font-size: 0.9rem;
    color: var(--tessera-text);
  }
  .slider-truth strong { color: var(--tessera-primary-light); }
  .slider-tol { color: var(--tessera-text-light); margin-left: 0.3rem; }

  .hotspot-wrap { margin-bottom: 1.25rem; }
  .hotspot-img-btn {
    position: relative;
    display: block;
    margin: 0 auto;
    padding: 0;
    background: none;
    border: 1px solid rgba(122,162,255,0.25);
    border-radius: 12px;
    overflow: hidden;
    cursor: crosshair;
    line-height: 0;
    max-width: 100%;
  }
  .hotspot-img-btn:disabled { cursor: default; }
  .hotspot-img {
    display: block;
    max-width: 100%;
    max-height: 50vh;
    width: auto;
    height: auto;
    user-select: none;
    -webkit-user-drag: none;
  }
  .hotspot-pin {
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: rgba(122,162,255,0.95);
    border: 2px solid #fff;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.4), 0 0 12px rgba(122,162,255,0.7);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .hotspot-target {
    position: absolute;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 2px solid rgba(248,113,113,0.85);
    box-shadow: 0 0 14px rgba(248,113,113,0.5);
    background: rgba(248,113,113,0.12);
    height: 0;
    box-sizing: border-box;
    pointer-events: none;
  }
  .hotspot-target.hit {
    border-color: rgba(74,222,128,0.9);
    box-shadow: 0 0 14px rgba(74,222,128,0.5);
    background: rgba(74,222,128,0.12);
  }

  .reveal {
    background: rgba(122,162,255,0.06);
    border-left: 3px solid var(--tessera-primary);
    padding: 0.85rem 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    line-height: 1.5;
  }
  .reveal strong { display: block; margin-bottom: 0.25rem; color: var(--tessera-primary-light); }
  .reveal-link {
    display: inline-block;
    margin-top: 0.6rem;
    background: none;
    border: none;
    padding: 0;
    color: var(--tessera-primary-light);
    font: inherit;
    font-size: 0.88rem;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .reveal-link:hover { color: #fff; }

  .hint {
    display: block;
    width: 100%;
    text-align: center;
    background: none;
    border: 1px dashed rgba(122,162,255,0.25);
    color: var(--tessera-text-light);
    padding: 0.55rem 0.85rem;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    margin-bottom: 1rem;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
  }
  .hint:hover {
    color: var(--tessera-text);
    border-color: rgba(122,162,255,0.5);
    background: rgba(122,162,255,0.04);
  }

  .next, .primary, .ghost {
    font-family: inherit;
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
    border-radius: 999px;
    cursor: pointer;
    border: none;
    transition: transform 0.15s, background 0.15s, opacity 0.15s;
  }
  .next, .primary {
    background: var(--tessera-primary);
    color: #050a1c;
    font-weight: 600;
    width: 100%;
  }
  .next:hover:not(:disabled), .primary:hover { background: var(--tessera-primary-light); }
  .next:disabled { opacity: 0.4; cursor: not-allowed; }

  .ghost {
    background: transparent;
    color: var(--tessera-text-light);
    border: 1px solid rgba(122,162,255,0.3);
  }
  .ghost:hover { color: var(--tessera-text); border-color: var(--tessera-primary); }

  .result {
    text-align: center;
    padding: 1rem 0.5rem 0;
  }
  .result-emoji { font-size: 4rem; margin-bottom: 0.5rem; }
  .result-score {
    font-size: 3rem;
    font-weight: 700;
    color: var(--tessera-primary-light);
    margin-bottom: 0.25rem;
  }
  .result-title {
    font-size: 1.15rem;
    color: var(--tessera-text);
    margin-bottom: 1rem;
  }
  .best {
    font-size: 0.85rem;
    color: var(--tessera-text-light);
    margin: 0 0 1.5rem;
  }
  .result-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
</style>
