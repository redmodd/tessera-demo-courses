<script>
  let active = $state('geo');
</script>

<div class="compare">
  <div class="tabs" role="tablist" aria-label="Compare cosmic models">
    <button
      type="button"
      id="cosmos-tab-geo"
      class="tab"
      class:active={active === 'geo'}
      role="tab"
      aria-selected={active === 'geo'}
      aria-controls="cosmos-panel-geo"
      tabindex={active === 'geo' ? 0 : -1}
      onclick={() => (active = 'geo')}
    >
      <span class="tab-era">Antiquity → 1543</span>
      <span class="tab-name">Geocentric</span>
    </button>
    <button
      type="button"
      id="cosmos-tab-helio"
      class="tab"
      class:active={active === 'helio'}
      role="tab"
      aria-selected={active === 'helio'}
      aria-controls="cosmos-panel-helio"
      tabindex={active === 'helio' ? 0 : -1}
      onclick={() => (active = 'helio')}
    >
      <span class="tab-era">1543 → today</span>
      <span class="tab-name">Heliocentric</span>
    </button>
  </div>

  <div
    id="cosmos-panel-geo"
    role="tabpanel"
    aria-labelledby="cosmos-tab-geo"
    hidden={active !== 'geo'}
  >
    <div class="diagrams">
      <svg viewBox="0 0 240 240" class="model" aria-hidden="true">
        <circle cx="120" cy="120" r="105" class="orbit-out" />
        <circle cx="120" cy="120" r="65" class="orbit-mid" />
        <circle cx="120" cy="120" r="35" class="orbit-in" />
        <circle cx="225" cy="120" r="9" class="sun" />
        <circle cx="155" cy="120" r="5" class="moon" />
        <circle cx="120" cy="55" r="5" class="planet" />
        <circle cx="120" cy="120" r="14" class="earth" />
        <text x="120" y="124" text-anchor="middle" class="centre-label">Earth</text>
      </svg>
    </div>
    <div class="callouts">
      <p class="callout">
        <strong>Earth at the centre.</strong> Everything (Sun, Moon, planets, the sphere
        of stars) turned around it. Ptolemy's elaborate version explained the visible
        motions well enough to dominate astronomy for nearly 1,400 years.
      </p>
    </div>
  </div>

  <div
    id="cosmos-panel-helio"
    role="tabpanel"
    aria-labelledby="cosmos-tab-helio"
    hidden={active !== 'helio'}
  >
    <div class="diagrams">
      <svg viewBox="0 0 240 240" class="model" aria-hidden="true">
        <circle cx="120" cy="120" r="105" class="orbit-out" />
        <circle cx="120" cy="120" r="70" class="orbit-mid" />
        <circle cx="120" cy="120" r="40" class="orbit-in" />
        <circle cx="80" cy="120" r="4" class="planet" />
        <circle cx="190" cy="120" r="6" class="earth" />
        <circle cx="120" cy="15" r="5" class="planet" />
        <circle cx="120" cy="120" r="14" class="sun" />
        <text x="120" y="124" text-anchor="middle" class="centre-label">Sun</text>
      </svg>
    </div>
    <div class="callouts">
      <p class="callout">
        <strong>The Sun at the centre.</strong> Copernicus put Earth into orbit in 1543.
        Kepler's laws (1609–19), Galileo's telescope, and Newton's <em>Principia</em>
        (1687) made the new picture impossible to ignore.
      </p>
    </div>
  </div>
</div>

<style>
  .compare {
    margin: 2rem 0;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(122, 162, 255, 0.18);
    border-radius: 14px;
  }
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }
  .tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(122, 162, 255, 0.15);
    color: var(--tessera-text-light);
    padding: 0.7rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    font-family: inherit;
    text-align: left;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }
  .tab:hover { color: var(--tessera-text); border-color: rgba(122,162,255,0.35); }
  .tab.active {
    color: var(--tessera-text);
    border-color: var(--planet-accent);
    background: rgba(255, 255, 255, 0.04);
  }
  .tab-era {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--planet-accent);
    opacity: 0.85;
  }
  .tab-name { font-size: 1rem; font-weight: 500; }

  .diagrams {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 240px;
  }
  .model {
    width: 220px;
    height: 220px;
  }
  .orbit-out, .orbit-mid, .orbit-in {
    fill: none;
    stroke: rgba(122, 162, 255, 0.25);
    stroke-width: 1;
    stroke-dasharray: 2 3;
  }
  .sun { fill: #f5d97a; filter: drop-shadow(0 0 6px rgba(245, 217, 122, 0.6)); }
  .earth { fill: var(--planet-accent); }
  .moon { fill: rgba(255,255,255,0.7); }
  .planet { fill: rgba(122, 162, 255, 0.7); }
  .centre-label {
    fill: #050a1c;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .callouts { margin-top: 1rem; }
  .callout {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--tessera-text-light);
  }
  .callout strong { color: var(--tessera-text); font-weight: 500; }

  @media (max-width: 540px) {
    .tabs { flex-direction: column; }
  }
</style>
