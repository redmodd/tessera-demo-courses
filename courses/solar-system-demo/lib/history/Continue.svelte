<script>
  let { onclick, label = 'Continue', hint = '' } = $props();
</script>

<div class="continue">
  <button type="button" class="btn" onclick={onclick}>
    <span class="btn-label">{label}</span>
    <span class="btn-arrow" aria-hidden="true">↓</span>
  </button>
  {#if hint}<p class="hint">{hint}</p>{/if}
</div>

<style>
  .continue {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    margin: 3rem 0 0;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.85rem;
    background: var(--planet-color);
    color: #050a1c;
    border: none;
    padding: 0.95rem 1.8rem;
    border-radius: 999px;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.3),
                0 0 0 0 var(--planet-accent);
  }
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35),
                0 0 0 4px rgba(255, 255, 255, 0.05);
    filter: brightness(1.05);
  }
  .btn:active { transform: translateY(0); }
  .btn-arrow {
    display: inline-flex;
    width: 1.25rem;
    height: 1.25rem;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.18);
    font-size: 0.85rem;
    transition: transform 0.2s;
  }
  .btn:hover .btn-arrow { transform: translateY(2px); }
  .hint {
    margin: 0;
    font-size: 0.78rem;
    color: var(--tessera-text-light);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
</style>
