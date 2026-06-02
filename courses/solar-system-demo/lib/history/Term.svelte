<script>
  let { definition, children } = $props();
  // Each Term gets a stable id so aria-describedby can point at the tooltip
  // text node — pseudo-element content (::after attr(data-tip)) is not
  // exposed to assistive tech.
  const tipId = `term-tip-${Math.random().toString(36).slice(2, 9)}`;
</script>

<button type="button" class="term" aria-describedby={tipId}>
  {@render children()}
  <span id={tipId} role="tooltip" class="tip">{definition}</span>
</button>

<style>
  .term {
    background: none;
    border: none;
    border-bottom: 1px dotted var(--planet-accent);
    cursor: help;
    position: relative;
    color: var(--tessera-text);
    font: inherit;
    padding: 0;
  }
  .tip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    background: rgba(8,12,28,0.98);
    border: 1px solid rgba(122,162,255,0.3);
    color: var(--tessera-text);
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.85rem;
    line-height: 1.4;
    width: max-content;
    max-width: 280px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s, transform 0.15s;
    z-index: 100;
    text-align: left;
    font-style: normal;
    font-weight: normal;
  }
  .term:hover .tip,
  .term:focus-visible .tip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
</style>
