<script>
  // Decorative overlay for the plaza overworld — four vendor stalls: ice cream cart
  // and snack stall on the left, drinks cart and souvenir cart on the right.
  // Drawn above tile cells (z-index 1) but below character sprites (z-index 2).
  // Coordinates match the 'B' tiles in worldmap.js.

  let { tile } = $props();
</script>

{#snippet iceCreamCart()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <!-- umbrella canopy: pale blue + white stripes -->
    <polygon points="5,24 51,24 45,9 11,9" fill="#7ac8e8"/>
    <polygon points="11,24 17,24 14,9  9,9"  fill="rgba(255,255,255,0.48)"/>
    <polygon points="22,24 28,24 25,9 20,9"  fill="rgba(255,255,255,0.48)"/>
    <polygon points="33,24 39,24 36,9 31,9"  fill="rgba(255,255,255,0.48)"/>
    <polygon points="44,24 50,24 47,9 42,9"  fill="rgba(255,255,255,0.48)"/>
    <!-- pole -->
    <rect x="26" y="9" width="4" height="19" fill="#c09060"/>
    <!-- counter surface -->
    <rect x="6" y="28" width="44" height="6" rx="2" fill="#f0e8d8"/>
    <!-- scoops -->
    <circle cx="16" cy="26" r="4"   fill="#f4b8a8"/>
    <circle cx="28" cy="26" r="4"   fill="#e4f0c8"/>
    <circle cx="40" cy="26" r="4"   fill="#f8e898"/>
    <!-- waffle cones -->
    <polygon points="14,28 18,28 16,33" fill="#d4a060"/>
    <polygon points="26,28 30,28 28,33" fill="#d4a060"/>
    <polygon points="38,28 42,28 40,33" fill="#d4a060"/>
    <!-- cart body -->
    <rect x="8"  y="34" width="40" height="11" rx="2" fill="#f8f0e0"/>
    <rect x="8"  y="37" width="40" height="3"  fill="#7ac8e8"/>
    <!-- wheels -->
    <circle cx="18" cy="45" r="5" fill="#5a4028"/>
    <circle cx="38" cy="45" r="5" fill="#5a4028"/>
    <circle cx="18" cy="45" r="2" fill="#7a6038"/>
    <circle cx="38" cy="45" r="2" fill="#7a6038"/>
  </svg>
{/snippet}

{#snippet snackStall()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <!-- canopy -->
    <rect x="4"  y="10" width="48" height="13" rx="2" fill="#c84820"/>
    <!-- scallop edge -->
    <circle cx="10" cy="23" r="5" fill="#c84820"/>
    <circle cx="19" cy="23" r="5" fill="#c84820"/>
    <circle cx="28" cy="23" r="5" fill="#c84820"/>
    <circle cx="37" cy="23" r="5" fill="#c84820"/>
    <circle cx="46" cy="23" r="5" fill="#c84820"/>
    <!-- canopy highlight -->
    <rect x="4" y="10" width="48" height="4" rx="2" fill="rgba(255,255,255,0.18)"/>
    <!-- stall body -->
    <rect x="6"  y="23" width="44" height="15" rx="2" fill="#d4a860"/>
    <!-- counter surface -->
    <rect x="4"  y="29" width="48" height="7"  rx="2" fill="#e8c880"/>
    <!-- items on counter -->
    <ellipse cx="16" cy="29" rx="5" ry="3" fill="#f0e040"/>
    <ellipse cx="28" cy="29" rx="4" ry="3" fill="#c87030"/>
    <ellipse cx="40" cy="29" rx="4" ry="2.5" fill="#60a840"/>
    <!-- counter front -->
    <rect x="4"  y="36" width="48" height="8"  rx="2" fill="#b88840"/>
    <!-- legs -->
    <rect x="8"  y="44" width="4" height="9" rx="1" fill="#8a6030"/>
    <rect x="44" y="44" width="4" height="9" rx="1" fill="#8a6030"/>
  </svg>
{/snippet}

{#snippet drinksCart()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <!-- umbrella canopy: green + white stripes -->
    <polygon points="5,24 51,24 45,9 11,9" fill="#4a9a50"/>
    <polygon points="11,24 17,24 14,9  9,9"  fill="rgba(255,255,255,0.45)"/>
    <polygon points="22,24 28,24 25,9 20,9"  fill="rgba(255,255,255,0.45)"/>
    <polygon points="33,24 39,24 36,9 31,9"  fill="rgba(255,255,255,0.45)"/>
    <polygon points="44,24 50,24 47,9 42,9"  fill="rgba(255,255,255,0.45)"/>
    <!-- pole -->
    <rect x="26" y="9" width="4" height="19" fill="#c09060"/>
    <!-- counter surface -->
    <rect x="6" y="28" width="44" height="6" rx="2" fill="#e8f4e8"/>
    <!-- cups / drinks on counter -->
    <rect x="11" y="22" width="7" height="8" rx="1" fill="#f8e840"/>
    <rect x="24" y="21" width="7" height="9" rx="1" fill="#f06050"/>
    <rect x="37" y="22" width="7" height="8" rx="1" fill="#60c8f0"/>
    <!-- straws -->
    <line x1="16" y1="22" x2="14" y2="15" stroke="#c0c0c0" stroke-width="1.5"/>
    <line x1="29" y1="21" x2="27" y2="14" stroke="#c0c0c0" stroke-width="1.5"/>
    <line x1="42" y1="22" x2="40" y2="15" stroke="#c0c0c0" stroke-width="1.5"/>
    <!-- cart body -->
    <rect x="8"  y="34" width="40" height="11" rx="2" fill="#e0f0e0"/>
    <rect x="8"  y="37" width="40" height="3"  fill="#4a9a50"/>
    <!-- wheels -->
    <circle cx="18" cy="45" r="5" fill="#5a4028"/>
    <circle cx="38" cy="45" r="5" fill="#5a4028"/>
    <circle cx="18" cy="45" r="2" fill="#7a6038"/>
    <circle cx="38" cy="45" r="2" fill="#7a6038"/>
  </svg>
{/snippet}

{#snippet souvenirCart()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <!-- canopy -->
    <rect x="4"  y="10" width="48" height="13" rx="2" fill="#6a40a8"/>
    <!-- scallop edge -->
    <circle cx="10" cy="23" r="5" fill="#6a40a8"/>
    <circle cx="19" cy="23" r="5" fill="#6a40a8"/>
    <circle cx="28" cy="23" r="5" fill="#6a40a8"/>
    <circle cx="37" cy="23" r="5" fill="#6a40a8"/>
    <circle cx="46" cy="23" r="5" fill="#6a40a8"/>
    <!-- canopy highlight -->
    <rect x="4" y="10" width="48" height="4" rx="2" fill="rgba(255,255,255,0.18)"/>
    <!-- stall body -->
    <rect x="6"  y="23" width="44" height="15" rx="2" fill="#c0a8d8"/>
    <!-- counter surface -->
    <rect x="4"  y="29" width="48" height="7"  rx="2" fill="#d8c8f0"/>
    <!-- items on counter: plush lion, keychain, snow globe -->
    <circle cx="14" cy="27" r="5"   fill="#e0a030"/>
    <circle cx="14" cy="24" r="3.5" fill="#e8b840"/>
    <circle cx="28" cy="28" r="3"   fill="#60b8d8"/>
    <rect   x="24" y="28" width="8" height="3" rx="1" fill="#a0c8e0"/>
    <circle cx="42" cy="26" r="4"   fill="#d05050"/>
    <ellipse cx="42" cy="31" rx="5" ry="1.5" fill="#a04040"/>
    <!-- counter front -->
    <rect x="4"  y="36" width="48" height="8"  rx="2" fill="#9070c0"/>
    <!-- legs -->
    <rect x="8"  y="44" width="4" height="9" rx="1" fill="#6040a0"/>
    <rect x="44" y="44" width="4" height="9" rx="1" fill="#6040a0"/>
  </svg>
{/snippet}

<div class="plaza-decor" aria-hidden="true">

  <!-- Ice cream cart — row 6, col 7 -->
  <div class="decor" style="left:{7 * tile}px; top:{6 * tile}px;">
    {@render iceCreamCart()}
  </div>

  <!-- Drinks cart — row 6, col 24 -->
  <div class="decor" style="left:{24 * tile}px; top:{6 * tile}px;">
    {@render drinksCart()}
  </div>

  <!-- Snack stall — row 14, col 7 -->
  <div class="decor" style="left:{7 * tile}px; top:{14 * tile}px;">
    {@render snackStall()}
  </div>

  <!-- Souvenir cart — row 14, col 24 -->
  <div class="decor" style="left:{24 * tile}px; top:{14 * tile}px;">
    {@render souvenirCart()}
  </div>

</div>

<style>
  .plaza-decor {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }
  .decor {
    position: absolute;
  }
</style>
