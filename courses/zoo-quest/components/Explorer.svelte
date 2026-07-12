<script>
  // Pace comes from CSS vars set by the parent: --step (one footfall) and --cycle (a stride).
  let { facing = 'down', walking = false } = $props();
</script>

<div class="explorer {facing}" class:walking>
  <svg viewBox="0 0 40 54" width="38" height="51" aria-hidden="true">
    <!-- ground shadow -->
    <ellipse class="shadow" cx="20" cy="51" rx="11" ry="2.6" />

    <g class="figure">
      <!-- legs -->
      <g class="leg leg-left">
        <rect x="15" y="39" width="4.2" height="10" rx="2.1" class="shorts" />
        <ellipse cx="17.1" cy="50" rx="3" ry="2" class="boot" />
      </g>
      <g class="leg leg-right">
        <rect x="20.8" y="39" width="4.2" height="10" rx="2.1" class="shorts" />
        <ellipse cx="22.9" cy="50" rx="3" ry="2" class="boot" />
      </g>

      <!-- torso -->
      <rect x="13" y="25" width="14" height="16" rx="5" class="shirt" />

      <!-- arms -->
      <g class="arm arm-left">
        <rect x="9" y="26" width="4" height="12" rx="2" class="shirt" />
        <circle cx="11" cy="39" r="2.2" class="skin" />
      </g>
      <g class="arm arm-right">
        <rect x="27" y="26" width="4" height="12" rx="2" class="shirt" />
        <circle cx="29" cy="39" r="2.2" class="skin" />
      </g>

      <!-- head -->
      <g class="head">
        <circle cx="20" cy="18" r="8.5" class="skin" />
        {#if facing !== 'up'}
          <g class="face">
            <circle class="eye" cx="17" cy="19" r="1.3" />
            <circle class="eye" cx="23" cy="19" r="1.3" />
            {#if facing === 'down'}
              <path class="smile" d="M16.8 22.2 Q20 25 23.2 22.2" />
            {/if}
          </g>
        {/if}
        <!-- safari hat -->
        <ellipse cx="20" cy="13.2" rx="13" ry="3.3" class="hat-brim" />
        <ellipse cx="20" cy="10" rx="7.6" ry="6" class="hat-dome" />
        <rect x="12.4" y="11.4" width="15.2" height="2.2" rx="1.1" class="hat-band" />
      </g>
    </g>
  </svg>
</div>

<style>
  .explorer {
    display: block;
    line-height: 0;
  }

  .skin {
    fill: #f1c9a5;
  }
  .shirt {
    fill: #7d9b63;
  }
  .shorts {
    fill: #6b5a3e;
  }
  .boot {
    fill: #463827;
  }
  .hat-brim {
    fill: #a07d45;
  }
  .hat-dome {
    fill: #b8945a;
  }
  .hat-band {
    fill: #6b5a3e;
  }
  .eye {
    fill: #3a3322;
  }
  .smile {
    fill: none;
    stroke: #3a3322;
    stroke-width: 1;
    stroke-linecap: round;
  }
  .shadow {
    fill: rgba(0, 0, 0, 0.18);
  }

  /* Look toward the facing direction by nudging the eyes. */
  .explorer.left .face {
    transform: translateX(-2.4px);
  }
  .explorer.right .face {
    transform: translateX(2.4px);
  }

  /* Limbs hinge from the shoulder/hip (top of their box). */
  .leg,
  .arm {
    transform-box: fill-box;
    transform-origin: 50% 0%;
    transition: transform 140ms ease;
  }

  @keyframes swingA {
    0% { transform: rotate(18deg); }
    50% { transform: rotate(-18deg); }
    100% { transform: rotate(18deg); }
  }
  @keyframes swingB {
    0% { transform: rotate(-18deg); }
    50% { transform: rotate(18deg); }
    100% { transform: rotate(-18deg); }
  }
  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-1.3px); }
  }

  /* Arms swing opposite their same-side leg. */
  .explorer.walking .leg-left {
    animation: swingA var(--cycle, 520ms) ease-in-out infinite;
  }
  .explorer.walking .leg-right {
    animation: swingB var(--cycle, 520ms) ease-in-out infinite;
  }
  .explorer.walking .arm-left {
    animation: swingB var(--cycle, 520ms) ease-in-out infinite;
  }
  .explorer.walking .arm-right {
    animation: swingA var(--cycle, 520ms) ease-in-out infinite;
  }
  .explorer.walking .figure {
    animation: bob var(--step, 260ms) ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .explorer.walking :is(.leg, .arm, .figure) {
      animation: none;
    }
  }
</style>
