<script>
  let { remainingMs = 0, totalMs = 1, size = 96, stroke = 8 } = $props();

  const radius = $derived((size - stroke) / 2);
  const circ = $derived(2 * Math.PI * radius);
  const fraction = $derived(Math.max(0, Math.min(1, remainingMs / totalMs)));
  const offset = $derived(circ * (1 - fraction));
  const seconds = $derived(Math.max(0, Math.ceil(remainingMs / 1000)));
  const tone = $derived(fraction < 0.2 ? 'danger' : fraction < 0.5 ? 'warn' : 'safe');
</script>

<div class="countdown-ring countdown-ring--{tone}" style="--ring-size: {size}px;" aria-hidden="true">
  <svg width={size} height={size}>
    <circle
      class="ring-track"
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke-width={stroke}
    />
    <circle
      class="ring-fill"
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke-width={stroke}
      stroke-dasharray={circ}
      stroke-dashoffset={offset}
      stroke-linecap="round"
      transform={`rotate(-90 ${size / 2} ${size / 2})`}
    />
  </svg>
  <span class="ring-label">{seconds}</span>
</div>

<style>
  .countdown-ring {
    position: relative;
    display: inline-flex;
    width: var(--ring-size);
    height: var(--ring-size);
    align-items: center;
    justify-content: center;
  }
  .ring-track {
    stroke: var(--ring-track, rgba(0, 0, 0, 0.08));
  }
  .ring-fill {
    stroke: var(--ring-fill, #4ade80);
    transition: stroke 0.3s ease;
  }
  .countdown-ring--warn .ring-fill { stroke: var(--ring-fill-warn, #f59e0b); }
  .countdown-ring--danger .ring-fill { stroke: var(--ring-fill-danger, #ef4444); }
  .ring-label {
    position: absolute;
    font-weight: 700;
    font-size: calc(var(--ring-size) * 0.32);
    color: var(--tessera-text, #111);
    font-variant-numeric: tabular-nums;
  }
</style>
