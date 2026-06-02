<script>
  let { circumference = '~40,000 km' } = $props();
</script>

<figure class="diagram">
  <svg viewBox="0 0 540 380" role="img" aria-labelledby="erat-title erat-desc">
    <title id="erat-title">Eratosthenes's measurement of Earth</title>
    <desc id="erat-desc">
      Parallel sun rays fall on two cities. At Syene the ray is straight down a well.
      At Alexandria, hundreds of kilometres north, a vertical stick casts a shadow at
      seven degrees, the same angular distance between the two cities along Earth's curve.
    </desc>

    <defs>
      <marker id="ray-arrow" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 0 L 5 9 L 10 0 Z" fill="currentColor" />
      </marker>
      <linearGradient id="earth-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(122,162,255,0.35)" />
        <stop offset="100%" stop-color="rgba(122,162,255,0.08)" />
      </linearGradient>
    </defs>

    <g class="rays" stroke="#f5d97a" stroke-width="1.5" fill="none" marker-end="url(#ray-arrow)" color="#f5d97a">
      <line x1="60" y1="20" x2="60" y2="200" />
      <line x1="150" y1="20" x2="150" y2="200" />
      <line x1="270" y1="20" x2="270" y2="232" />
      <line x1="380" y1="20" x2="380" y2="200" />
      <line x1="470" y1="20" x2="470" y2="200" />
    </g>
    <text x="60" y="14" text-anchor="middle" class="hint-label">Sun</text>
    <text x="470" y="14" text-anchor="middle" class="hint-label">(rays parallel)</text>

    <path d="M 0 380 L 0 320 A 600 600 0 0 1 540 320 L 540 380 Z" fill="url(#earth-grad)" stroke="rgba(122,162,255,0.5)" stroke-width="1" />

    <g class="city syene">
      <circle cx="270" cy="320" r="5" />
      <text x="270" y="356" text-anchor="middle">Syene</text>
      <text x="270" y="372" text-anchor="middle" class="sub">(well, no shadow)</text>
    </g>

    <g class="city alex">
      <line class="stick" x1="145.3" y1="333.1" x2="130.8" y2="264.6" />
      <line class="ray-on-stick" x1="130.8" y1="20" x2="130.8" y2="264.6" stroke-width="1.5" fill="none" marker-end="url(#ray-arrow)" />
      <line class="shadow" x1="145.3" y1="333.1" x2="130.8" y2="336.4" />
      <path class="angle-arc" d="M 126.64 245.04 A 20 20 0 0 1 130.8 244.6" fill="none" />
      <text x="125" y="238" class="angle-label">7°</text>

      <circle cx="145.3" cy="333.1" r="5" />
      <text x="145.3" y="356" text-anchor="middle">Alexandria</text>
      <text x="145.3" y="372" text-anchor="middle" class="sub">(stick + shadow)</text>
    </g>

    <text x="370" y="296" class="insight">Same 7° between cities = 7° / 360° of Earth's circumference</text>
  </svg>

  <figcaption>
    From <strong>one stick, one well, one piece of geometry</strong>, Eratosthenes deduced
    Earth's circumference at <strong>{circumference}</strong>, within a few percent of the
    modern value. <span class="note">Angle exaggerated above for clarity.</span>
  </figcaption>
</figure>

<style>
  .diagram {
    margin: 2rem 0;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(122, 162, 255, 0.18);
    border-radius: 14px;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
    max-height: 480px;
    background: radial-gradient(ellipse at top, rgba(245, 217, 122, 0.06), transparent 70%);
    border-radius: 10px;
  }

  .city circle { fill: var(--planet-accent); stroke: #fff; stroke-width: 1.5; }
  .city text {
    fill: var(--tessera-text);
    font-size: 12px;
    font-weight: 500;
  }
  .city text.sub {
    fill: var(--tessera-text-light);
    font-size: 10px;
    font-style: italic;
  }
  .stick {
    stroke: #fff;
    stroke-width: 3;
    stroke-linecap: round;
  }
  .ray-on-stick { stroke: #f5d97a; color: #f5d97a; }
  .shadow {
    stroke: rgba(255, 255, 255, 0.45);
    stroke-width: 4;
    stroke-linecap: round;
    stroke-dasharray: 2 3;
  }
  .angle-arc {
    stroke: var(--planet-accent);
    stroke-width: 1.5;
  }
  .angle-label {
    fill: var(--planet-accent);
    font-size: 12px;
    font-weight: 600;
  }
  .hint-label {
    fill: #f5d97a;
    font-size: 11px;
    letter-spacing: 0.06em;
    opacity: 0.85;
  }
  .insight {
    fill: var(--tessera-text-light);
    font-size: 11px;
    font-style: italic;
  }

  figcaption {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: var(--tessera-text-light);
    line-height: 1.55;
  }
  figcaption strong { color: var(--tessera-text); font-weight: 500; }
  figcaption .note {
    display: inline-block;
    margin-left: 0.4rem;
    font-style: italic;
    opacity: 0.75;
    font-size: 0.82rem;
  }
</style>
