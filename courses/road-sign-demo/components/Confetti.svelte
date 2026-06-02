<script>
  let { trigger = 0, burst = false } = $props();

  const COLORS = ['#f59e0b', '#dc2626', '#16a34a', '#2563eb', '#facc15', '#ec4899'];
  const pieceCount = $derived(burst ? 80 : 24);

  // Re-key by `trigger` so the CSS animation replays each time the parent bumps it.
  let renderKey = $state(0);
  let prev = $state(0);
  $effect(() => {
    if (trigger !== prev) {
      prev = trigger;
      renderKey++;
    }
  });

  function pieces(n) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push({
        i,
        left: Math.random() * 100,
        delay: Math.random() * 200,
        duration: 900 + Math.random() * 700,
        rotation: Math.random() * 720 - 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 6,
      });
    }
    return arr;
  }
</script>

{#key renderKey}
  {#if trigger > 0}
    <div class="confetti" aria-hidden="true">
      {#each pieces(pieceCount) as p (p.i)}
        <span
          class="piece"
          style="
            left: {p.left}%;
            background: {p.color};
            width: {p.size}px;
            height: {p.size * 0.4}px;
            animation-delay: {p.delay}ms;
            animation-duration: {p.duration}ms;
            --rot: {p.rotation}deg;
          "
        ></span>
      {/each}
    </div>
  {/if}
{/key}

<style>
  .confetti {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 50;
  }
  .piece {
    position: absolute;
    top: -10px;
    border-radius: 1px;
    animation: fall linear forwards;
    transform-origin: center;
  }
  @keyframes fall {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(400px) rotate(var(--rot)); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .confetti { display: none; }
  }
</style>
