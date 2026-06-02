<script module>
  export const pageConfig = { title: "How to play" };
</script>

<script>
  import { useNavigation } from 'tessera-learn';
  import SignCard from '../../../components/SignCard.svelte';

  const nav = useNavigation();

  function start() {
    nav.next();
  }
</script>

<div class="intro-bg">
<div class="intro">
  <h1>How to play</h1>
  <p class="lead">
    Match the road sign to its meaning across 15 timed rounds. Answer faster
    for more points.
  </p>

  <div class="rules">
    <div class="rule">
      <span class="rule-num">1</span>
      <div>
        <h2>Read the prompt</h2>
        <p>You'll see a sign name, a sign image, a driving scenario, or a shape/colour question.</p>
      </div>
    </div>
    <div class="rule">
      <span class="rule-num">2</span>
      <div>
        <h2>Pick a card</h2>
        <p>Tap the card that matches. Cards turn green when right, red when wrong.</p>
      </div>
    </div>
    <div class="rule">
      <span class="rule-num">3</span>
      <div>
        <h2>Beat the clock</h2>
        <p>The countdown ring drains each round. Answer quickly to maximise points.</p>
      </div>
    </div>
    <div class="rule">
      <span class="rule-num">4</span>
      <div>
        <h2>Pass at 70%</h2>
        <p>Get 11 of 15 right to pass. Retries reshuffle the round pool.</p>
      </div>
    </div>
  </div>

  <div class="tiers">
    <h2>Difficulty ramps up</h2>
    <p class="tiers-lead">Every five rounds the game gets harder: more cards, less time, and trickier wrong answers.</p>
    <div class="tier-row">
      <div class="tier tier--1">
        <div class="tier-head">
          <span class="tier-badge">Tier 1</span>
          <span class="tier-rounds">Rounds 1–5</span>
        </div>
        <ul>
          <li><strong>3</strong> cards</li>
          <li><strong>15</strong> seconds</li>
          <li>Random distractors</li>
        </ul>
      </div>
      <div class="tier tier--2">
        <div class="tier-head">
          <span class="tier-badge">Tier 2</span>
          <span class="tier-rounds">Rounds 6–10</span>
        </div>
        <ul>
          <li><strong>4</strong> cards</li>
          <li><strong>11</strong> seconds</li>
          <li>Same-category distractors</li>
        </ul>
      </div>
      <div class="tier tier--3">
        <div class="tier-head">
          <span class="tier-badge">Tier 3</span>
          <span class="tier-rounds">Rounds 11–15</span>
        </div>
        <ul>
          <li><strong>5</strong> cards</li>
          <li><strong>8</strong> seconds</li>
          <li>Same shape &amp; colour</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="categories">
    <h2>Three categories</h2>
    <div class="cat-row">
      <div class="cat cat--regulatory">
        <SignCard symbol="stop" decorative />
        <span><strong>Regulatory:</strong> what you must or must not do.</span>
      </div>
      <div class="cat cat--warning">
        <SignCard symbol="curve" decorative />
        <span><strong>Warning:</strong> yellow diamonds; what's coming up.</span>
      </div>
      <div class="cat cat--guide">
        <SignCard symbol="hospital" decorative />
        <span><strong>Guide / info:</strong> services, routes, places.</span>
      </div>
    </div>
  </div>

  <button class="rs-btn rs-btn--start start-btn" type="button" onclick={start}>Start the game</button>
</div>
</div>

<style>
  .intro-bg {
    background: var(--rs-bg-amber-gradient-soft);
    min-height: 100%;
    margin: -1.5rem;
    padding: 1.5rem;
  }
  .intro {
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1.25rem 3rem;
  }
  h1 { font-size: 2rem; margin: 0 0 0.75rem; color: var(--rs-text); }
  .lead { color: var(--rs-text-muted); font-size: 1.05rem; margin-bottom: 2rem; line-height: 1.5; }
  .rules {
    display: grid; gap: 1rem; margin-bottom: 2.5rem;
  }
  .rule {
    display: grid;
    grid-template-columns: 2.5rem 1fr;
    gap: 1rem;
    padding: 1rem;
    background: #ffffff;
    border-radius: 12px;
    border-left: 4px solid var(--rs-warning-amber);
    box-shadow: var(--rs-card-shadow);
  }
  .rule-num {
    width: 2.5rem; height: 2.5rem;
    display: grid; place-items: center;
    border-radius: 50%;
    background: var(--rs-warning-amber); color: white;
    font-weight: 700; font-size: 1.1rem;
  }
  .rule h2 { font-size: 1.05rem; margin: 0 0 0.25rem; }
  .rule p { margin: 0; color: var(--rs-text-muted); line-height: 1.4; }

  .tiers { margin-bottom: 2.5rem; }
  .tiers h2 { font-size: 1.1rem; margin: 0 0 0.5rem; }
  .tiers-lead { margin: 0 0 1rem; color: var(--rs-text-muted); font-size: 0.95rem; line-height: 1.4; }
  .tier-row {
    display: grid; gap: 0.75rem;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .tier {
    padding: 0.9rem 1rem;
    background: #ffffff;
    border-radius: 10px;
    border-top: 4px solid transparent;
    box-shadow: var(--rs-card-shadow);
  }
  .tier--1 { border-top-color: var(--rs-guide-green); }
  .tier--2 { border-top-color: var(--rs-warning-amber); }
  .tier--3 { border-top-color: var(--rs-regulatory-red); }
  .tier-head {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 0.5rem; margin-bottom: 0.5rem;
  }
  .tier-badge {
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--rs-text);
  }
  .tier-rounds { font-size: 0.8rem; color: var(--rs-text-muted); }
  .tier ul {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: 0.25rem;
    font-size: 0.85rem; color: var(--rs-text-muted);
  }
  .tier strong {
    color: var(--rs-text); font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .categories { margin-bottom: 2.5rem; }
  .categories h2 { font-size: 1.1rem; margin: 0 0 1rem; }
  .cat-row {
    display: grid; gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  .cat {
    display: grid;
    grid-template-columns: 64px 1fr;
    gap: 0.75rem;
    align-items: center;
    padding: 0.75rem;
    background: #ffffff;
    border-radius: 10px;
    border-left: 4px solid transparent;
    box-shadow: var(--rs-card-shadow);
  }
  .cat--regulatory { border-left-color: var(--rs-regulatory-red); }
  .cat--warning    { border-left-color: var(--rs-warning-amber); }
  .cat--guide      { border-left-color: var(--rs-guide-green); }
  .cat :global(.sign-card-img) { max-width: 64px; max-height: 64px; }
  .cat span { font-size: 0.9rem; color: var(--rs-text-muted); line-height: 1.4; }

  .start-btn {
    display: block;
    margin: 0 auto;
  }
</style>
