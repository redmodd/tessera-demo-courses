<script>
  // Facts carry inline <strong> emphasis, hence {@html}; they are authored constants.
  import Animal from './Animal.svelte';

  let { animal } = $props();
</script>

<article class="card">
  <div class="sprite" aria-hidden="true"><Animal kind={animal.id} /></div>
  <p class="dex">#{animal.dex}</p>
  <h3>{animal.name}</h3>
  <p class="stats">{animal.stats}</p>

  <ul class="facts">
    {#each animal.facts as fact}
      <li>{@html fact}</li>
    {/each}
  </ul>

  <p class="blurb">“{animal.blurb}”</p>
</article>

<style>
  .card {
    text-align: center;
  }
  .sprite {
    line-height: 1;
  }
  .sprite :global(svg) {
    width: 96px;
    height: 80px;
  }
  .dex {
    margin: 0.25rem 0 0;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--zoo-bark);
  }
  h3 {
    margin: 0.1rem 0 0.25rem;
    font-size: 1.4rem;
  }
  .stats {
    margin: 0 0 1rem;
    font-style: italic;
    color: var(--zoo-bark);
  }
  .facts {
    display: inline-block;
    text-align: left;
    max-width: 42ch;
    margin: 0 auto;
    padding-left: 1.2rem;
  }
  .facts li {
    margin: 0.45rem 0;
    line-height: 1.5;
  }
  .blurb {
    margin-top: 1.4rem;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--zoo-ink);
  }
</style>
