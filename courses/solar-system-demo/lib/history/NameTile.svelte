<script>
  let { word, language, meaning } = $props();
</script>

<div class="tile">
  <span class="word">{word}</span>
  <span class="lang">{language}</span>
  <span class="meaning">{meaning}</span>
</div>

<style>
  .tile {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 1.25rem 1.1rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(122, 162, 255, 0.18);
    border-radius: 12px;
    transition: border-color 0.2s, transform 0.2s, background 0.2s;
  }
  .tile:hover {
    border-color: var(--planet-accent);
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.04);
  }
  .word {
    font-size: clamp(1.4rem, 2.4vw, 1.75rem);
    font-weight: 300;
    letter-spacing: -0.01em;
    color: var(--tessera-text);
    font-style: italic;
  }
  .lang {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--planet-accent);
    margin-top: 0.25rem;
  }
  .meaning {
    font-size: 0.9rem;
    color: var(--tessera-text-light);
    line-height: 1.4;
  }
</style>
