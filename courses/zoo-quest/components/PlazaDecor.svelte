<script>
  // Decorative overlay for the plaza overworld. Two groups of 'B' props, both drawn above
  // tile cells (z-index 1) but below character sprites (z-index 2):
  //   • Vendor carts — ice cream + snack stall down the west path, drinks + souvenir off
  //     the east. Each has a tending patron beside it (see PEOPLE.plaza in lib/people.js).
  //   • Street furniture — benches, lamp posts, a bin, and flower planters, scattered
  //     unevenly to break the square's symmetry.
  // Every coordinate here MUST match a 'B' tile in worldmap.js, or the sprite floats over a
  // walkable cell while an invisible blocker sits elsewhere.

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

{#snippet bench()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <ellipse cx="28" cy="49" rx="22" ry="3" fill="rgba(0,0,0,0.12)"/>
    <!-- backrest -->
    <rect x="8" y="18" width="40" height="4" rx="1" fill="#9a6a3a"/>
    <rect x="8" y="24" width="40" height="3" rx="1" fill="#8a5e34"/>
    <rect x="10" y="22" width="3" height="10" fill="#7a5230"/>
    <rect x="43" y="22" width="3" height="10" fill="#7a5230"/>
    <!-- seat -->
    <rect x="8" y="30" width="40" height="5" rx="1" fill="#9a6a3a"/>
    <rect x="8" y="30" width="40" height="2" fill="rgba(255,255,255,0.16)"/>
    <!-- legs -->
    <rect x="12" y="35" width="4" height="12" fill="#4a4a52"/>
    <rect x="40" y="35" width="4" height="12" fill="#4a4a52"/>
  </svg>
{/snippet}

{#snippet lampPost()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <ellipse cx="28" cy="50" rx="9" ry="2.5" fill="rgba(0,0,0,0.16)"/>
    <!-- pole + base -->
    <rect x="26" y="15" width="4" height="35" rx="1.5" fill="#3a3a44"/>
    <rect x="22" y="48" width="12" height="4" rx="1" fill="#2e2e38"/>
    <!-- glow + lantern -->
    <circle cx="28" cy="12" r="8" fill="#fff2b0" opacity="0.55"/>
    <rect x="24" y="8" width="8" height="10" rx="2" fill="#f4d24a"/>
    <rect x="23" y="5" width="10" height="3.5" rx="1" fill="#3a3a44"/>
    <rect x="27" y="2" width="2" height="3" fill="#3a3a44"/>
  </svg>
{/snippet}

{#snippet bin()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <ellipse cx="28" cy="50" rx="11" ry="3" fill="rgba(0,0,0,0.12)"/>
    <!-- body -->
    <rect x="18" y="23" width="20" height="27" rx="3" fill="#3a6a4a"/>
    <rect x="22" y="29" width="3" height="15" fill="rgba(255,255,255,0.14)"/>
    <rect x="31" y="29" width="3" height="15" fill="rgba(0,0,0,0.10)"/>
    <!-- lid -->
    <rect x="18" y="22" width="20" height="4" fill="#2e5a3e"/>
    <rect x="16" y="18" width="24" height="6" rx="2" fill="#2e5a3e"/>
    <rect x="25" y="15" width="6" height="3" rx="1" fill="#244a32"/>
  </svg>
{/snippet}

{#snippet planter()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <ellipse cx="28" cy="50" rx="15" ry="3" fill="rgba(0,0,0,0.12)"/>
    <!-- foliage -->
    <circle cx="18" cy="26" r="8" fill="#4a8a44"/>
    <circle cx="38" cy="26" r="8" fill="#4a8a44"/>
    <circle cx="28" cy="21" r="9" fill="#56994f"/>
    <!-- blooms -->
    <circle cx="20" cy="24" r="2.5" fill="#e86a8a"/>
    <circle cx="30" cy="19" r="2.5" fill="#f4c84a"/>
    <circle cx="36" cy="26" r="2.5" fill="#e86a8a"/>
    <circle cx="26" cy="26" r="2.5" fill="#f4f0f0"/>
    <!-- box -->
    <rect x="12" y="32" width="32" height="16" rx="2" fill="#a06a40"/>
    <rect x="12" y="32" width="32" height="4" fill="#8a5a34"/>
    <rect x="12" y="44" width="32" height="4" rx="1" fill="#7a4e2e"/>
  </svg>
{/snippet}

<div class="plaza-decor" aria-hidden="true">

  <!-- Vendor carts (coords match the 'B' tiles in worldmap.js; patrons tend each) -->

  <!-- Ice cream cart — row 6, col 7 (Lena) -->
  <div class="decor" style="left:{7 * tile}px; top:{6 * tile}px;">
    {@render iceCreamCart()}
  </div>

  <!-- Snack stall — row 8, col 7 (Jen) — clustered below the ice cream cart on the west path -->
  <div class="decor" style="left:{7 * tile}px; top:{8 * tile}px;">
    {@render snackStall()}
  </div>

  <!-- Drinks cart — row 6, col 24 (Rosa) -->
  <div class="decor" style="left:{24 * tile}px; top:{6 * tile}px;">
    {@render drinksCart()}
  </div>

  <!-- Souvenir cart — row 13, col 24 (Ed) -->
  <div class="decor" style="left:{24 * tile}px; top:{13 * tile}px;">
    {@render souvenirCart()}
  </div>

  <!-- Street furniture — scattered unevenly to break the square's symmetry -->

  <!-- Benches: a seating nook by the west entrance + one in front of the shop -->
  <div class="decor" style="left:{4 * tile}px; top:{9 * tile}px;">{@render bench()}</div>
  <div class="decor" style="left:{4 * tile}px; top:{11 * tile}px;">{@render bench()}</div>
  <div class="decor" style="left:{13 * tile}px; top:{6 * tile}px;">{@render bench()}</div>

  <!-- Lamp posts flanking the pond, off-axis -->
  <div class="decor" style="left:{12 * tile}px; top:{7 * tile}px;">{@render lampPost()}</div>
  <div class="decor" style="left:{19 * tile}px; top:{14 * tile}px;">{@render lampPost()}</div>

  <!-- Bin beside the lower west bench, by the food carts -->
  <div class="decor" style="left:{5 * tile}px; top:{11 * tile}px;">{@render bin()}</div>

  <!-- Flower planters, diagonally placed -->
  <div class="decor" style="left:{10 * tile}px; top:{1 * tile}px;">{@render planter()}</div>
  <div class="decor" style="left:{21 * tile}px; top:{18 * tile}px;">{@render planter()}</div>

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
