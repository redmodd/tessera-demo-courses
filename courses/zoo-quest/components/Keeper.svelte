<script>
  let {
    skin = '#c98a5a',
    hair = '#33271a',
    hairStyle = 'short', // 'short' | 'ponytail'
    shirt = '#8a6d3a',
    trousers = '#4f4030',
    cap = '#5a4634',
  } = $props();
</script>

<svg viewBox="0 0 40 54" width="38" height="51" aria-hidden="true">
  <ellipse class="shadow" cx="20" cy="51" rx="11" ry="2.6" />

  <g class="figure">
    <!-- legs -->
    <rect x="15" y="39" width="4.2" height="10" rx="2.1" fill={trousers} />
    <rect x="20.8" y="39" width="4.2" height="10" rx="2.1" fill={trousers} />
    <ellipse cx="17.1" cy="50" rx="3" ry="2" fill="#2f261a" />
    <ellipse cx="22.9" cy="50" rx="3" ry="2" fill="#2f261a" />

    <!-- uniform -->
    <rect x="13" y="25" width="14" height="16" rx="5" fill={shirt} />
    <rect x="19.4" y="26" width="1.2" height="13" fill="rgba(0,0,0,0.16)" />
    <circle cx="16.3" cy="30" r="1.2" fill="#e8c14a" />
    <!-- collar -->
    <path d="M16.5 25 L20 28 L23.5 25 Z" fill="rgba(0,0,0,0.12)" />

    <!-- arms -->
    <rect x="9" y="26" width="4" height="12" rx="2" fill={shirt} />
    <rect x="27" y="26" width="4" height="12" rx="2" fill={shirt} />
    <circle cx="11" cy="39" r="2.2" fill={skin} />
    <circle cx="29" cy="39" r="2.2" fill={skin} />

    <!-- head -->
    {#if hairStyle === 'ponytail'}
      <ellipse cx="30" cy="21" rx="2.6" ry="5.2" fill={hair} />
    {/if}
    <circle cx="20" cy="18" r="8.5" fill={skin} />
    <!-- sideburns -->
    <path d="M11.8 18.5 Q11.2 13.5 15 12 L15 18.5 Z" fill={hair} />
    <path d="M28.2 18.5 Q28.8 13.5 25 12 L25 18.5 Z" fill={hair} />
    <!-- face -->
    <circle cx="17" cy="19" r="1.3" fill="#3a3322" />
    <circle cx="23" cy="19" r="1.3" fill="#3a3322" />
    <path
      d="M16.8 22.2 Q20 24.6 23.2 22.2"
      fill="none"
      stroke="#3a3322"
      stroke-width="1"
      stroke-linecap="round"
    />
    <!-- cap -->
    <path d="M11.6 13.2 Q20 4 28.4 13.2 Z" fill={cap} />
    <ellipse cx="20" cy="13.2" rx="9" ry="2.3" fill={cap} />
    <ellipse cx="20" cy="14.7" rx="6.6" ry="1.5" fill="rgba(0,0,0,0.25)" />
    <circle cx="20" cy="7.3" r="0.9" fill="rgba(0,0,0,0.18)" />
  </g>
</svg>

<style>
  svg {
    display: block;
  }
  .shadow {
    fill: rgba(0, 0, 0, 0.18);
  }
  .figure {
    animation: idle 2.8s ease-in-out infinite;
  }
  @keyframes idle {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-0.6px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .figure {
      animation: none;
    }
  }
</style>
