<script>
  // Decorative overlay for the interior rooms — selected by `mapId`. Pure decoration
  // (aria-hidden), positioned by tile coordinate over the board and below the character
  // sprites. Coordinates match the room grids in worldmap.js. `tile` is px-per-tile.
  //   centre    → gift shop: clothing racks, checkout register, plush toys on the shelves.
  //   discovery → Discovery Center: one piece of art per display station (WORLD.exhibits),
  //               drawn by the station's `type` (poster / diet / size / touchscreen /
  //               specimen / map), plus a couple of plants and a bench as light dressing.
  import { WORLD } from '../lib/worldmap.js';
  import { ANIMALS } from '../lib/zoodex.js';

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

  // Plain dressing for the Discovery Center, alongside the display stations themselves.
  const DISCOVERY_DECOR = [
    { kind: 'plant', r: 1, c: 1, dx: 12, dy: 10 },
    { kind: 'plant', r: 1, c: 15, dx: 12, dy: 10 },
    { kind: 'bench', r: 10, c: 10, span: 3 },
  ];

  // Each Discovery Center display station becomes one art item, keyed by its display `type`
  // (the on-map look) with `motif` chosen from the animal. The station footprint (at + span)
  // places and sizes the art, so editing WORLD.exhibits moves the art with it.
  const stationItems = $derived(
    (WORLD.exhibits?.[mapId] ?? []).map((s) => {
      const d = ANIMALS[s.animal]?.exhibit?.displays?.[s.key] ?? {};
      return {
        kind: d.type,
        motif: s.animal === 'elephant' ? 'eleph' : 'lion',
        r: s.at.r,
        c: s.at.c,
        span: s.span ?? 1,
      };
    }),
  );

  const items = $derived(
    mapId === 'discovery' ? [...stationItems, ...DISCOVERY_DECOR] : CENTRE_ITEMS,
  );

  // A small animal head badge (lion mane+face, or elephant head+trunk) centred at (cx, cy)
  // with radius ~r. Shared by the displays that aren't otherwise animal-specific so every
  // panel reads as lion or elephant at a glance.
  function animalGlyph(motif, cx, cy, r) {
    if (motif === 'lion') {
      let g = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#c98a3f"/>`;
      g += `<circle cx="${cx}" cy="${cy}" r="${r * 0.66}" fill="#e7b96f"/>`;
      g += `<circle cx="${cx - r * 0.26}" cy="${cy - r * 0.1}" r="${r * 0.12}" fill="#2a2018"/>`;
      g += `<circle cx="${cx + r * 0.26}" cy="${cy - r * 0.1}" r="${r * 0.12}" fill="#2a2018"/>`;
      g += `<path d="M${cx - r * 0.18} ${cy + r * 0.28}h${r * 0.36}" stroke="#2a2018" stroke-width="${r * 0.12}" stroke-linecap="round"/>`;
      return g;
    }
    let g = `<ellipse cx="${cx + r * 0.12}" cy="${cy + r * 0.08}" rx="${r}" ry="${r * 0.84}" fill="#9aa3b0"/>`;
    g += `<circle cx="${cx - r * 0.7}" cy="${cy - r * 0.25}" r="${r * 0.46}" fill="#aab2bd"/>`; // ear
    g += `<path d="M${cx - r * 0.78} ${cy} c${-r * 0.15} ${r * 0.45} ${-r * 0.05} ${r * 0.8} ${r * 0.18} ${r}" stroke="#9aa3b0" stroke-width="${r * 0.3}" stroke-linecap="round" fill="none"/>`; // trunk
      g += `<circle cx="${cx - r * 0.5}" cy="${cy - r * 0.18}" r="${r * 0.12}" fill="#2a2630"/>`;
    return g;
  }

  // --- Standing easels (one tile): an A-frame easel holding a small filled picture --------
  // The former wide wall boards are now compact easels — a picture board on splayed legs
  // with the illustration filling the mat, so nothing reads as a big empty rectangle.

  // The easel itself: splayed legs, a tray ledge, the wood frame, and the mat (its colour
  // chosen per display). Art is drawn into the mat (x 15..41, y 8..29) by the callers.
  function easelFrame(mat) {
    let g = `<path d="M28 31 L28 52" stroke="#7c6038" stroke-width="3" stroke-linecap="round"/>`; // back leg
    g += `<path d="M18 31 L12 51" stroke="#8a6a44" stroke-width="3.5" stroke-linecap="round"/>`; // front-left
    g += `<path d="M38 31 L44 51" stroke="#8a6a44" stroke-width="3.5" stroke-linecap="round"/>`; // front-right
    g += `<rect x="12" y="30" width="32" height="3.6" rx="1.5" fill="#9a7b50"/>`; // tray ledge
    g += `<rect x="12" y="5" width="32" height="27" rx="3" fill="#7a5230" stroke="#543824" stroke-width="2"/>`; // frame
    g += `<rect x="15" y="8" width="26" height="21" rx="2" fill="${mat}"/>`; // mat
    return g;
  }
  function svgTile(g) {
    const t = tile;
    return `<svg width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">${g}</svg>`;
  }

  // Poster easel: a savanna sky + grass band, with the animal's head filling the mat.
  function posterEasel(motif) {
    let g = easelFrame('#f1e3c4');
    g += `<rect x="15" y="23" width="26" height="6" fill="#cdb888"/>`; // grass band
    g += animalGlyph(motif, 28, 17, 7);
    return svgTile(g);
  }

  // Range-map easel: a pale-blue chart, a landmass blob, and the animal marking its range.
  function mapEasel(motif) {
    let g = easelFrame('#cfe3ef');
    g += `<g transform="translate(28 18) scale(0.4)"><path d="M0 -18 C10 -18 14 -8 12 0 C16 8 10 18 2 19 C-6 20 -11 12 -8 4 C-14 -4 -8 -18 0 -18 Z" fill="#d8c08a" stroke="#a98a52" stroke-width="3"/></g>`;
    g += animalGlyph(motif, 28, 18, 6);
    return svgTile(g);
  }

  // Diet easel: carnivore (meat + bone) or herbivore (leaves), filling the mat.
  function dietEasel(motif) {
    let g = easelFrame('#f1e3c4');
    if (motif === 'lion') {
      // a drumstick: a rounded piece of meat with a knobbed bone poking out the top
      g += `<ellipse cx="25" cy="21" rx="8" ry="6.5" fill="#b85b40"/>`; // meat
      g += `<ellipse cx="23" cy="19" rx="4.5" ry="2.6" fill="#cf6e4f"/>`; // highlight
      g += `<path d="M29 18 L35 12" stroke="#f1ead6" stroke-width="3.5" stroke-linecap="round"/>`; // bone
      g += `<circle cx="36" cy="11" r="2.2" fill="#f1ead6"/><circle cx="33.5" cy="13.2" r="2.2" fill="#f1ead6"/>`; // bone knob
    } else {
      g += `<path d="M22 25c-1-9 3-12 10-13-1 9-4 12-10 13z" fill="#4f7a3e"/>`;
      g += `<path d="M29 26c-1-8 3-11 9-12-1 8-4 11-9 12z" fill="#5f8c49"/>`;
      g += `<path d="M17 26q3-7 8-8-1 7-8 8z" fill="#6fa055"/>`;
    }
    return svgTile(g);
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

  // --- Floor-standing units (one tile) --------------------------------------------------

  // A glass specimen case: a dark cabinet with a pale specimen and a wooden base. The
  // specimen differs by animal — a lion's clawed paw, or an elephant's curved tusk.
  function specimenCase(motif) {
    const t = tile, cx = t / 2, cy = t / 2;
    let g = `<rect x="9" y="6" width="${t - 18}" height="${t - 16}" rx="4" fill="#2b3540" stroke="#5a4634" stroke-width="3"/>`;
    g += `<rect x="13" y="10" width="${t - 26}" height="${t - 24}" rx="2" fill="#3d4d5a"/>`;
    g += `<path d="M16 6 L22 ${t - 12}" stroke="#cfe0ea" stroke-width="2" opacity="0.35"/>`; // glass glint
    if (motif === 'lion') {
      // a clear paw print: a big central pad + four toe beans in an arc above it
      g += `<ellipse cx="${cx}" cy="${cy + 4}" rx="6.5" ry="5.5" fill="#efe6d2"/>`; // pad
      g += `<circle cx="${cx - 6.5}" cy="${cy - 1}" r="2.6" fill="#efe6d2"/>`;
      g += `<circle cx="${cx - 2.4}" cy="${cy - 4}" r="2.8" fill="#efe6d2"/>`;
      g += `<circle cx="${cx + 2.4}" cy="${cy - 4}" r="2.8" fill="#efe6d2"/>`;
      g += `<circle cx="${cx + 6.5}" cy="${cy - 1}" r="2.6" fill="#efe6d2"/>`;
    } else {
      // a curved tusk
      g += `<path d="M${cx - 7} ${cy - 9} Q${cx + 9} ${cy - 8} ${cx + 6} ${cy + 9} Q${cx + 2} ${cy + 1} ${cx - 7} ${cy - 9} Z" fill="#efe6d2" stroke="#cdbfa0" stroke-width="1.5"/>`;
    }
    g += `<rect x="7" y="${t - 12}" width="${t - 14}" height="8" rx="2" fill="#caa063" stroke="#8a6a44" stroke-width="1.5"/>`; // base/label
    return `<svg width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">${g}</svg>`;
  }

  // An interactive touchscreen kiosk: a screen on a stand showing the animal beside a "?"
  // prompt, so the lion and elephant kiosks read apart.
  function touchscreen(motif) {
    const t = tile;
    const sw = t - 18, sh = t - 24;
    const panelX = 13, panelY = 9, panelW = sw - 8, panelH = sh - 16;
    const panelMidY = panelY + panelH / 2;
    let g = `<rect x="9" y="5" width="${sw}" height="${sh}" rx="5" fill="#1f2a30" stroke="#566069" stroke-width="3"/>`;
    g += `<rect x="${panelX}" y="${panelY}" width="${panelW}" height="${panelH}" rx="2" fill="#9fe0c0" opacity="0.92"/>`;
    g += animalGlyph(motif, panelX + panelW * 0.34, panelMidY, 6);
    g += `<text x="${panelX + panelW * 0.78}" y="${panelMidY + 5}" font-size="${panelH * 0.7}" text-anchor="middle" fill="#1f2a30" font-family="sans-serif" font-weight="bold">?</text>`;
    g += `<rect x="${t / 2 - 4}" y="${5 + sh}" width="8" height="9" fill="#3a444a"/>`; // stand
    g += `<rect x="${t / 2 - 11}" y="${t - 10}" width="22" height="6" rx="2" fill="#3a444a"/>`; // foot
    return `<svg width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">${g}</svg>`;
  }

  // Hanging garments for a clothing rack `span` tiles wide (gift shop). Trapezoidal
  // "shirts" in varied colours hang from a rail carried on two end legs.
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

  // A size-comparison standee: a board with the animal beside a small person for scale.
  // The lion is a gold, maned cat; the elephant a grey giant with a trunk — so the two
  // size displays don't read alike.
  function sizeStandee(motif) {
    const t = tile;
    let g = `<rect x="6" y="6" width="${t - 12}" height="${t - 12}" rx="4" fill="#efe6d2" stroke="#7a5230" stroke-width="2.5"/>`;
    g += `<line x1="10" y1="${t - 13}" x2="${t - 10}" y2="${t - 13}" stroke="#a98a52" stroke-width="2"/>`;
    if (motif === 'lion') {
      const gold = '#c98a3f';
      g += `<path d="M${t * 0.58} ${t * 0.55} q${t * 0.13} ${-t * 0.02} ${t * 0.1} ${-t * 0.17}" stroke="${gold}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`; // tail
      g += `<circle cx="${t * 0.69}" cy="${t * 0.37}" r="2.4" fill="${gold}"/>`; // tail tuft
      g += `<ellipse cx="${t * 0.45}" cy="${t * 0.6}" rx="11" ry="6" fill="${gold}"/>`; // body
      g += `<rect x="${t * 0.39}" y="${t * 0.66}" width="3" height="6" fill="${gold}"/><rect x="${t * 0.53}" y="${t * 0.66}" width="3" height="6" fill="${gold}"/>`; // legs
      g += `<circle cx="${t * 0.29}" cy="${t * 0.56}" r="8" fill="${gold}"/>`; // mane
      g += `<circle cx="${t * 0.29}" cy="${t * 0.56}" r="4.6" fill="#e7b96f"/>`; // face
      g += `<circle cx="${t * 0.24}" cy="${t * 0.49}" r="1.7" fill="${gold}"/><circle cx="${t * 0.34}" cy="${t * 0.49}" r="1.7" fill="${gold}"/>`; // ears
    } else {
      g += `<ellipse cx="${t * 0.44}" cy="${t * 0.5}" rx="15" ry="12" fill="#9aa3b0"/>`; // body
      g += `<circle cx="${t * 0.25}" cy="${t * 0.45}" r="6" fill="#aab2bd"/>`; // head/ear
      g += `<path d="M${t * 0.2} ${t * 0.5}c-2 6-2 11 1 16" stroke="#9aa3b0" stroke-width="4" stroke-linecap="round" fill="none"/>`; // trunk
      g += `<rect x="${t * 0.36}" y="${t * 0.62}" width="4" height="9" fill="#9aa3b0"/><rect x="${t * 0.54}" y="${t * 0.62}" width="4" height="9" fill="#9aa3b0"/>`; // legs
    }
    // small person to scale
    g += `<circle cx="${t - 18}" cy="${t * 0.55}" r="3.4" fill="#46506b"/>`;
    g += `<rect x="${t - 21}" y="${t * 0.55 + 3}" width="6" height="${t * 0.22}" rx="2" fill="#46506b"/>`;
    return `<svg width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">${g}</svg>`;
  }
</script>

<div class="interior-decor" aria-hidden="true">
  {#each items as p (p.kind + p.r + '-' + p.c)}
    <div class="decor" style="left:{p.c * tile + (p.dx ?? 0)}px; top:{p.r * tile + (p.dy ?? 0)}px;">
      {#if p.kind === 'poster'}
        {@html posterEasel(p.motif)}
      {:else if p.kind === 'map'}
        {@html mapEasel(p.motif)}
      {:else if p.kind === 'diet'}
        {@html dietEasel(p.motif)}
      {:else if p.kind === 'specimen'}
        {@html specimenCase(p.motif)}
      {:else if p.kind === 'touchscreen'}
        {@html touchscreen(p.motif)}
      {:else if p.kind === 'size'}
        {@html sizeStandee(p.motif)}
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
