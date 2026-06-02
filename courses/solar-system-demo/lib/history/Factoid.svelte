<script>
  let { value, children } = $props();
</script>

<aside class="factoid">
  <div class="value">{value}</div>
  <div class="context">{@render children()}</div>
</aside>

<style>
  .factoid {
    margin: 2rem 0;
    padding: 1.5rem;
    background: linear-gradient(135deg, rgba(122,162,255,0.07), rgba(255,255,255,0.02));
    border: 1px solid rgba(122,162,255,0.18);
    border-radius: 12px;
    text-align: center;
  }
  .value {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 200;
    color: var(--planet-accent);
    line-height: 1;
    letter-spacing: -0.01em;
    margin-bottom: 0.5rem;
  }
  .context {
    font-size: 0.95rem;
    color: var(--tessera-text-light);
    line-height: 1.5;
  }
</style>
