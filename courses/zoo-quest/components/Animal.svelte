<script>
  // Side-view enclosure animals in the same flat, rounded, ground-shadowed style as
  // the Explorer/Keeper. `flip` mirrors the sprite to face left. A soft idle bob keeps
  // them alive even between wander steps. Decorative (aria-hidden) — the keeper and Map
  // menu carry the accessible labels.
  let { kind, flip = false } = $props();
</script>

<svg class:flip viewBox="0 0 48 40" width="44" height="37" aria-hidden="true">
  {#if kind === 'lion'}
    <ellipse class="shadow" cx="23" cy="37" rx="15" ry="2.5" />
    <g class="figure">
      <!-- tail -->
      <path d="M8 23 Q2 21 4.5 15" fill="none" stroke="#c0883a" stroke-width="2.1" stroke-linecap="round" />
      <circle cx="4.3" cy="14.5" r="1.9" fill="#7a4f23" />
      <!-- back legs -->
      <rect x="10" y="25" width="3.4" height="9" rx="1.7" fill="#b07d3a" />
      <rect x="15" y="25" width="3.4" height="9" rx="1.7" fill="#cf9a52" />
      <!-- body -->
      <ellipse cx="21" cy="21" rx="13" ry="7.6" fill="#d8a45a" />
      <!-- front legs -->
      <rect x="25.5" y="25" width="3.4" height="9" rx="1.7" fill="#b07d3a" />
      <rect x="30" y="25" width="3.4" height="9" rx="1.7" fill="#cf9a52" />
      <!-- mane + head -->
      <circle cx="35" cy="16.5" r="9" fill="#9c5f2a" />
      <circle cx="30.5" cy="10.5" r="2.4" fill="#8a531f" />
      <circle cx="41" cy="12" r="2.4" fill="#8a531f" />
      <circle cx="42" cy="20" r="2.4" fill="#8a531f" />
      <circle cx="35.5" cy="16.5" r="6" fill="#e7b873" />
      <circle cx="31.5" cy="11.5" r="1.7" fill="#9c5f2a" /> <!-- ear -->
      <ellipse cx="39.5" cy="18" rx="2.8" ry="2.3" fill="#f2d6a4" /> <!-- muzzle -->
      <circle cx="34.5" cy="15" r="1" fill="#3a3322" /> <!-- eye -->
      <circle cx="40.2" cy="16.8" r="0.8" fill="#3a3322" /> <!-- nose -->
    </g>
  {:else if kind === 'elephant'}
    <ellipse class="shadow" cx="24" cy="37" rx="16" ry="2.5" />
    <g class="figure">
      <!-- tail -->
      <path d="M7 21 Q2.5 23 3.5 28" fill="none" stroke="#7e848a" stroke-width="1.9" stroke-linecap="round" />
      <!-- back legs -->
      <rect x="10" y="25" width="4.4" height="10" rx="1.7" fill="#868c92" />
      <rect x="16" y="25" width="4.4" height="10" rx="1.7" fill="#9aa0a6" />
      <!-- body -->
      <ellipse cx="23" cy="20" rx="15" ry="9.2" fill="#9aa0a6" />
      <!-- front legs -->
      <rect x="27.5" y="25" width="4.4" height="10" rx="1.7" fill="#868c92" />
      <rect x="33.5" y="25" width="4.4" height="10" rx="1.7" fill="#9aa0a6" />
      <!-- head -->
      <circle cx="38" cy="17.5" r="9" fill="#9aa0a6" />
      <ellipse cx="34.5" cy="16.5" rx="5" ry="6.6" fill="#b0b6bb" /> <!-- ear -->
      <circle cx="40.5" cy="15.5" r="1" fill="#3a3322" /> <!-- eye -->
      <!-- trunk -->
      <path d="M44 17.5 Q47.5 22 45.5 30 Q45 33 43 33" fill="none" stroke="#9aa0a6" stroke-width="3.3" stroke-linecap="round" />
      <!-- tusk -->
      <path d="M43 23 Q44.2 26.5 43.2 29" fill="none" stroke="#f3ead7" stroke-width="1.6" stroke-linecap="round" />
    </g>
  {:else if kind === 'squirrel'}
    <!-- sitting squirrel, classic upright pose with a big curled tail and an acorn -->
    <ellipse class="shadow" cx="22" cy="37" rx="12" ry="2.3" />
    <g class="figure">
      <!-- bushy tail, curling up behind the body -->
      <path d="M17 34 C2 30 3 11 18 7 C11 13 11 26 21 31 Z" fill="#a86a3e" />
      <path d="M16 31 C6 27 7 14 17 11 C12 16 12 25 20 29 Z" fill="#c68a52" />
      <!-- back foot -->
      <ellipse cx="20" cy="34" rx="3" ry="1.8" fill="#a86a3e" />
      <!-- body -->
      <ellipse cx="26" cy="28" rx="6.2" ry="7.6" fill="#b97a45" />
      <ellipse cx="28" cy="29.5" rx="3.4" ry="5.4" fill="#e3c39a" /> <!-- belly -->
      <!-- head -->
      <circle cx="29" cy="17" r="5.4" fill="#b97a45" />
      <ellipse cx="26.5" cy="12.2" rx="1.8" ry="2.4" fill="#a86a3e" /> <!-- ear -->
      <ellipse cx="31.5" cy="12.2" rx="1.8" ry="2.4" fill="#a86a3e" />
      <ellipse cx="26.6" cy="12.4" rx="0.8" ry="1.3" fill="#e3c39a" />
      <ellipse cx="31.4" cy="12.4" rx="0.8" ry="1.3" fill="#e3c39a" />
      <ellipse cx="32.2" cy="18.6" rx="2.1" ry="1.7" fill="#e3c39a" /> <!-- muzzle -->
      <circle cx="30.7" cy="16.2" r="1" fill="#3a2a1a" /> <!-- eye -->
      <circle cx="33.4" cy="18.1" r="0.8" fill="#3a2a1a" /> <!-- nose -->
      <!-- front paws + acorn -->
      <ellipse cx="27.2" cy="24" rx="1.7" ry="1.4" fill="#a86a3e" />
      <ellipse cx="26.8" cy="22.3" rx="2.2" ry="1.8" fill="#cf9a5a" /> <!-- nut -->
      <path d="M24.6 22.1 Q26.8 19.8 29 22.1 Z" fill="#6b4a2a" /> <!-- cap -->
    </g>
  {/if}
</svg>

<style>
  svg {
    display: block;
  }
  svg.flip {
    transform: scaleX(-1);
  }
  .shadow {
    fill: rgba(0, 0, 0, 0.16);
  }
  .figure {
    animation: bob 2.4s ease-in-out infinite;
  }
  @keyframes bob {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-0.7px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .figure {
      animation: none;
    }
  }
</style>
