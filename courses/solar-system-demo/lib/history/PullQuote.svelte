<script>
  let { attribution = '', children } = $props();
</script>

<blockquote class="pull">
  <span class="mark">"</span>
  <p>{@render children()}</p>
  {#if attribution}<cite>{attribution}</cite>{/if}
</blockquote>

<style>
  .pull {
    margin: 2rem 0;
    padding: 1rem 0 1rem 2rem;
    border-left: 3px solid var(--planet-accent);
    position: relative;
  }
  .mark {
    position: absolute;
    top: -0.5rem;
    left: 1rem;
    font-size: 3rem;
    color: var(--planet-accent);
    opacity: 0.3;
    font-family: Georgia, serif;
    line-height: 1;
  }
  .pull p {
    font-size: clamp(1.2rem, 2.4vw, 1.5rem);
    font-weight: 300;
    font-style: italic;
    color: var(--tessera-text);
    line-height: 1.45;
    margin: 0;
  }
  cite {
    display: block;
    margin-top: 0.75rem;
    font-style: normal;
    font-size: 0.85rem;
    color: var(--tessera-text-light);
  }
</style>
