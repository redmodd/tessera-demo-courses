<script>
  let { name, dates, role, initials = '' } = $props();
  const fallback = $derived(
    initials || (name?.split(' ').map((p) => p[0]).slice(0, 2).join('') ?? '?')
  );
</script>

<aside class="figure">
  <div class="portrait">{fallback}</div>
  <div class="meta">
    <strong>{name}</strong>
    <span class="dates">{dates}</span>
    <span class="role">{role}</span>
  </div>
</aside>

<style>
  .figure {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    margin: 1.25rem 0;
    padding: 0.85rem 1rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(122,162,255,0.15);
    border-radius: 10px;
  }
  .portrait {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--planet-accent), var(--planet-color));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #050a1c;
    flex-shrink: 0;
    font-size: 0.9rem;
  }
  .meta {
    display: flex;
    flex-direction: column;
    line-height: 1.3;
  }
  .meta strong {
    color: var(--tessera-text);
    font-weight: 600;
  }
  .dates {
    font-size: 0.8rem;
    color: var(--planet-accent);
  }
  .role {
    font-size: 0.85rem;
    color: var(--tessera-text-light);
  }
</style>
