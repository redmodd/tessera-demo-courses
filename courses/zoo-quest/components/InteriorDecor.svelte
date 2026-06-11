<script>
  // Decorative overlay for the interior rooms — selected by `mapId`. Pure decoration
  // (aria-hidden), positioned by tile coordinate over the board and below the character
  // sprites. Coordinates match the room grids in worldmap.js. `tile` is px-per-tile.
  //   centre    → gift shop: clothing racks, checkout register, plush toys on the shelves.
  //   discovery → Discovery Center: framed lion/elephant exhibit posters over the X boards,
  //               plus a bench and a potted plant as light dressing.
  let { tile, mapId = 'centre' } = $props();

  // anchor tile (r,c) + pixel nudge (dx,dy) + optional span (tiles wide). The doors are
  // plain doorway squares styled in overworld.svelte; room names live in the map label.
  const CENTRE_ITEMS = [
    { kind: 'rack', r: 5, c: 3, span: 3 },
    { kind: 'rack', r: 7, c: 3, span: 3 },
    { kind: 'register', r: 8, c: 10, dx: 8, dy: -18 },
    { kind: 'plush-lion', r: 3, c: 2, dx: 13, dy: 14 },
    { kind: 'plush-eleph', r: 3, c: 14, dx: 13, dy: 12 },
  ];

  // Posters sit over the X exhibit boards (lion r3/c3–5, elephant r3/c11–13); the bench
  // and plant dress the open floor below. `motif` picks the framed illustration.
  const DISCOVERY_ITEMS = [
    { kind: 'poster', motif: 'lion', r: 3, c: 3, span: 3 },
    { kind: 'poster', motif: 'eleph', r: 3, c: 11, span: 3 },
    { kind: 'bench', r: 8, c: 6, span: 3 },
    { kind: 'plant', r: 2, c: 14, dx: 10, dy: 6 },
  ];

  const items = $derived(mapId === 'discovery' ? DISCOVERY_ITEMS : CENTRE_ITEMS);

  // A framed exhibit poster `span` tiles wide: a wood frame, a pale savanna sky mat, and a
  // simple animal motif (lion face or elephant) centred — readable at a glance from the map.
  function poster(span, motif) {
    const w = span * tile, h = tile;
    const fx = 4, fy = 4, fw = w - 8, fh = h - 8; // frame
    const mx = fx + 4, my = fy + 4, mw = fw - 8, mh = fh - 8; // mat
    const cx = w / 2, cy = h / 2 + 2;
    let g = `<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="4" fill="#7a5230" stroke="#543824" stroke-width="2"/>`;
    g += `<rect x="${mx}" y="${my}" width="${mw}" height="${mh}" rx="2" fill="#f1e3c4"/>`;
    g += `<rect x="${mx}" y="${my + mh * 0.62}" width="${mw}" height="${mh * 0.38}" fill="#cdb888"/>`; // grass band
    if (motif === 'lion') {
      g += `<circle cx="${cx}" cy="${cy}" r="13" fill="#c98a3f"/>`; // mane
      g += `<circle cx="${cx}" cy="${cy}" r="8.5" fill="#e7b96f"/>`;
      g += `<circle cx="${cx - 3}" cy="${cy - 1}" r="1.4" fill="#2a2018"/><circle cx="${cx + 3}" cy="${cy - 1}" r="1.4" fill="#2a2018"/>`;
      g += `<path d="M${cx - 2} ${cy + 3}h4" stroke="#2a2018" stroke-width="1.4" stroke-linecap="round"/>`;
    } else {
      g += `<ellipse cx="${cx + 1}" cy="${cy + 1}" rx="13" ry="11" fill="#9aa3b0"/>`;
      g += `<circle cx="${cx - 9}" cy="${cy - 3}" r="6" fill="#aab2bd"/>`; // ear
      g += `<path d="M${cx - 10} ${cy}c-2 5-2 9 1 12" stroke="#9aa3b0" stroke-width="3.5" stroke-linecap="round" fill="none"/>`; // trunk
      g += `<circle cx="${cx - 7}" cy="${cy - 2}" r="1.4" fill="#2a2630"/>`;
    }
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
  }

  // A simple wooden bench `span` tiles wide: a seat plank on two legs.
  function bench(span) {
    const w = span * tile, h = tile;
    const seatY = h * 0.5;
    let g = `<rect x="4" y="${seatY}" width="${w - 8}" height="8" rx="2" fill="#9a7b50"/>`;
    g += `<rect x="4" y="${seatY - 8}" width="${w - 8}" height="6" rx="2" fill="#ad8a59"/>`;
    g += `<rect x="10" y="${seatY + 8}" width="5" height="${h - seatY - 12}" fill="#7c6038"/>`;
    g += `<rect x="${w - 15}" y="${seatY + 8}" width="5" height="${h - seatY - 12}" fill="#7c6038"/>`;
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
  }

  // Hanging garments for a clothing rack `span` tiles wide. Trapezoidal "shirts" in
  // varied colours hang from a rail carried on two end legs.
  function rack(span) {
    const w = span * tile, h = tile;
    const colours = ['#5aa86a', '#d05b4a', '#4a78d0', '#e0a93f', '#c060a0', '#5aa86a'];
    const n = span * 2; // garments across the rack
    const railY = 12, hemY = h - 8;
    let g = `<rect x="2" y="${railY - 2}" width="${w - 4}" height="4" rx="2" fill="#9a8a78"/>`;
    g += `<rect x="4" y="${railY}" width="4" height="${h - railY - 4}" fill="#857560"/>`;
    g += `<rect x="${w - 8}" y="${railY}" width="4" height="${h - railY - 4}" fill="#857560"/>`;
    for (let i = 0; i < n; i++) {
      const cx = (w / n) * (i + 0.5);
      const col = colours[i % colours.length];
      const x = cx - 8;
      g += `<line x1="${cx}" y1="${railY - 2}" x2="${cx}" y2="${railY + 3}" stroke="#777" stroke-width="1"/>`;
      g += `<path d="M${x} ${hemY} L${x + 1} ${railY + 3} Q${cx} ${railY} ${x + 15} ${railY + 3} L${x + 16} ${hemY} Z" fill="${col}"/>`;
    }
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
  }
</script>

<div class="interior-decor" aria-hidden="true">
  {#each items as p (p.kind + p.r + '-' + p.c)}
    <div class="decor" style="left:{p.c * tile + (p.dx ?? 0)}px; top:{p.r * tile + (p.dy ?? 0)}px;">
      {#if p.kind === 'poster'}
        {@html poster(p.span ?? 1, p.motif)}
      {:else if p.kind === 'bench'}
        {@html bench(p.span ?? 1)}
      {:else if p.kind === 'plant'}
        <svg width="30" height="34" viewBox="0 0 30 34">
          <rect x="9" y="20" width="12" height="11" rx="2" fill="#b5734a" />
          <rect x="8" y="20" width="14" height="3" rx="1.5" fill="#caa06a" />
          <path d="M15 20c0-7-5-10-9-11 1 6 4 9 9 11z" fill="#4f7a3e" />
          <path d="M15 20c0-7 5-10 9-11-1 6-4 9-9 11z" fill="#5f8c49" />
          <path d="M15 21c0-8 0-13 0-16 2 5 2 11 0 16z" fill="#6fa055" />
        </svg>
      {:else if p.kind === 'rack'}
        {@html rack(p.span ?? 1)}
      {:else if p.kind === 'register'}
        <svg width="32" height="28" viewBox="0 0 32 28">
          <rect x="4" y="10" width="24" height="14" rx="2" fill="#3a444a" />
          <rect x="7" y="13" width="13" height="7" rx="1" fill="#9fe0c0" />
          <rect x="11" y="2" width="12" height="8" rx="1.5" fill="#4a555c" />
          <rect x="22" y="13" width="4" height="7" rx="1" fill="#566069" />
        </svg>
      {:else if p.kind === 'plush-lion'}
        <svg width="30" height="30" viewBox="0 0 30 30">
          <circle cx="6" cy="9" r="4" fill="#c98a3f" /><circle cx="24" cy="9" r="4" fill="#c98a3f" />
          <ellipse cx="15" cy="16" rx="11" ry="10" fill="#d79a4a" />
          <circle cx="15" cy="15" r="6.5" fill="#e7b96f" />
          <circle cx="12.5" cy="14" r="1.2" fill="#2a2018" /><circle cx="17.5" cy="14" r="1.2" fill="#2a2018" />
          <path d="M13.5 17.5h3" stroke="#2a2018" stroke-width="1.2" stroke-linecap="round" />
        </svg>
      {:else if p.kind === 'plush-eleph'}
        <svg width="30" height="30" viewBox="0 0 30 30">
          <ellipse cx="16" cy="16" rx="11" ry="10" fill="#9aa3b0" />
          <circle cx="8" cy="11" r="5" fill="#aab2bd" />
          <path d="M7 14c-1 4-1 8 1 11" stroke="#9aa3b0" stroke-width="3" stroke-linecap="round" fill="none" />
          <circle cx="9" cy="11" r="1.2" fill="#2a2630" />
        </svg>
      {/if}
    </div>
  {/each}
</div>

<style>
  .interior-decor {
    position: absolute;
    inset: 0;
    z-index: 1; /* above the floor/wall cells, below the character sprites (z-index 2) */
    pointer-events: none;
  }
  .decor {
    position: absolute;
    display: grid;
    place-items: center;
  }
  .decor :global(svg) {
    display: block;
  }
</style>
