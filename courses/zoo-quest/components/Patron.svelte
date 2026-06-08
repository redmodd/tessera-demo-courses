<script>
  // A zoo visitor (patron), front-facing, same flat style as the Explorer/Keeper but
  // in casual clothes. Heavily parametrized so each patron — and the bespectacled,
  // bowler-hatted rival — reads as a different person. Gentle idle bob.
  let {
    skin = '#d9a577',
    hair = '#3a2a1a',
    hairStyle = 'short', // 'short' | 'ponytail' | 'bun' | 'bald'
    shirt = '#4a6f8a',
    trousers = '#46506b',
    hat = 'none', // 'none' | 'sun' | 'cap' | 'bowler'
    glasses = false,
    bowtie = false,
  } = $props();

  const HAT_COLOR = { sun: '#cdb87a', cap: '#55564e', bowler: '#2e2a26' };
</script>

<svg viewBox="0 0 40 54" width="36" height="49" aria-hidden="true">
  <ellipse class="shadow" cx="20" cy="51" rx="11" ry="2.6" />

  <g class="figure">
    <!-- legs -->
    <rect x="15" y="39" width="4.2" height="10" rx="2.1" fill={trousers} />
    <rect x="20.8" y="39" width="4.2" height="10" rx="2.1" fill={trousers} />
    <ellipse cx="17.1" cy="50" rx="3" ry="2" fill="#2f261a" />
    <ellipse cx="22.9" cy="50" rx="3" ry="2" fill="#2f261a" />

    <!-- shirt -->
    <rect x="13" y="25" width="14" height="16" rx="5" fill={shirt} />
    {#if bowtie}
      <path d="M20 27 L16.5 25.4 L16.5 28.6 Z" fill="#7a2f2f" />
      <path d="M20 27 L23.5 25.4 L23.5 28.6 Z" fill="#7a2f2f" />
      <rect x="19.2" y="26.2" width="1.6" height="1.6" rx="0.4" fill="#5a2222" />
    {/if}

    <!-- arms -->
    <rect x="9" y="26" width="4" height="12" rx="2" fill={shirt} />
    <rect x="27" y="26" width="4" height="12" rx="2" fill={shirt} />
    <circle cx="11" cy="39" r="2.2" fill={skin} />
    <circle cx="29" cy="39" r="2.2" fill={skin} />

    <!-- head -->
    {#if hairStyle === 'ponytail'}
      <ellipse cx="30" cy="21" rx="2.6" ry="5.2" fill={hair} />
    {/if}
    {#if hairStyle === 'bun'}
      <circle cx="20" cy="7.5" r="2.6" fill={hair} />
    {/if}
    <circle cx="20" cy="18" r="8.5" fill={skin} />
    {#if hairStyle !== 'bald'}
      <ellipse cx="20" cy="12" rx="8.6" ry="6" fill={hair} />
      <path d="M11.8 18.5 Q11.2 13.5 15 12 L15 18 Z" fill={hair} />
      <path d="M28.2 18.5 Q28.8 13.5 25 12 L25 18 Z" fill={hair} />
    {/if}
    <!-- face -->
    <circle cx="17" cy="19" r="1.3" fill="#3a3322" />
    <circle cx="23" cy="19" r="1.3" fill="#3a3322" />
    <path d="M16.8 22.2 Q20 24.4 23.2 22.2" fill="none" stroke="#3a3322" stroke-width="1" stroke-linecap="round" />
    {#if glasses}
      <circle cx="17" cy="19" r="2.2" fill="none" stroke="#2c2620" stroke-width="0.8" />
      <circle cx="23" cy="19" r="2.2" fill="none" stroke="#2c2620" stroke-width="0.8" />
      <line x1="19.2" y1="19" x2="20.8" y2="19" stroke="#2c2620" stroke-width="0.8" />
    {/if}

    <!-- hat -->
    {#if hat === 'sun'}
      <ellipse cx="20" cy="12.5" rx="12" ry="3" fill={HAT_COLOR.sun} />
      <ellipse cx="20" cy="9.5" rx="7" ry="5" fill={HAT_COLOR.sun} />
    {:else if hat === 'cap'}
      <path d="M11.5 13 Q20 5.5 28.5 13 Z" fill={HAT_COLOR.cap} />
      <ellipse cx="20" cy="13" rx="9" ry="2.2" fill={HAT_COLOR.cap} />
      <ellipse cx="20" cy="14.4" rx="6.4" ry="1.4" fill="rgba(0,0,0,0.25)" />
    {:else if hat === 'bowler'}
      <ellipse cx="20" cy="12.6" rx="9" ry="1.9" fill={HAT_COLOR.bowler} />
      <ellipse cx="20" cy="9.4" rx="6.4" ry="5.4" fill={HAT_COLOR.bowler} />
    {/if}
  </g>
</svg>

<style>
  svg { display: block; }
  .shadow { fill: rgba(0, 0, 0, 0.18); }
  .figure { animation: idle 3s ease-in-out infinite; }
  @keyframes idle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-0.6px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .figure { animation: none; }
  }
</style>
