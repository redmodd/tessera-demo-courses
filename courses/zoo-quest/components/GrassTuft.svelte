<script>
  // A small decorative grass tuft scattered on themed ground (see lib/decor.js). Five
  // short blades; `dry` switches to a yellowed palette for the savanna. Purely
  // ornamental — aria-hidden, and pointer-events:none so it never eats a tile click.
  let { dry = false } = $props();
  const c = dry
    ? ['#8a8338', '#9aa04e', '#b0a85e']
    : ['#5f7a3e', '#6f8c49', '#7d9a55'];
</script>

<svg class="tuft" viewBox="0 0 24 18" width="20" height="15" aria-hidden="true">
  <path d="M5 18 Q3 9 1 6" stroke={c[0]} stroke-width="2" fill="none" stroke-linecap="round" />
  <path d="M9 18 Q9 7 8 3" stroke={c[1]} stroke-width="2" fill="none" stroke-linecap="round" />
  <path d="M8 18 Q10 11 11 9" stroke={c[2]} stroke-width="2" fill="none" stroke-linecap="round" />
  <path d="M12 18 Q13 8 15 4" stroke={c[0]} stroke-width="2" fill="none" stroke-linecap="round" />
  <path d="M16 18 Q18 10 20 7" stroke={c[1]} stroke-width="2" fill="none" stroke-linecap="round" />
</svg>

<style>
  .tuft {
    display: block;
    pointer-events: none;
  }
</style>
