<script>
  let { density = 'normal' } = $props();

  function rand(seed) {
    const x = Math.sin(seed * 9999) * 43758.5453;
    return x - Math.floor(x);
  }

  const counts = { sparse: 60, normal: 140, dense: 220 };
  const stars = $derived.by(() => {
    const count = counts[density] ?? counts.normal;
    return Array.from({ length: count }, (_, i) => ({
    top: rand(i + 1) * 100,
    left: rand(i + 200) * 100,
    size: 0.5 + rand(i + 400) * 1.8,
    delay: rand(i + 600) * 6,
    duration: 3 + rand(i + 800) * 4,
    layer: i % 3,
  }));
  });
</script>

<div class="starfield" aria-hidden="true">
  {#each stars as s}
    <span
      class="star layer-{s.layer}"
      style="
        top: {s.top}%;
        left: {s.left}%;
        width: {s.size}px;
        height: {s.size}px;
        animation-delay: -{s.delay}s;
        animation-duration: {s.duration}s;
      "
    ></span>
  {/each}
</div>

<style>
  .starfield {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .star {
    position: absolute;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 0 4px rgba(255,255,255,0.6);
    animation: twinkle ease-in-out infinite;
    will-change: opacity;
  }
  .star.layer-0 { background: #ffffff; opacity: 0.9; }
  .star.layer-1 { background: #cfe0ff; opacity: 0.7; }
  .star.layer-2 { background: #a8b8e0; opacity: 0.5; }
  @keyframes twinkle {
    0%, 100% { opacity: 0.25; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    .star { animation: none !important; opacity: 0.7 !important; }
  }
</style>
