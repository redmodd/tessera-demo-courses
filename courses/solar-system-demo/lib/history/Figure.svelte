<script>
  import Icon from '../Icon.svelte';
  let { src, alt, caption = '', credit = '' } = $props();
  let failed = $state(false);
</script>

<figure class="figure">
  {#if failed}
    <div class="placeholder" aria-label={alt}>
      <span class="placeholder-icon"><Icon name="satellite" /></span>
      <span class="placeholder-text">{alt}</span>
    </div>
  {:else}
    <img
      {src}
      {alt}
      loading="lazy"
      onerror={() => (failed = true)}
    />
  {/if}
  {#if caption || credit}
    <figcaption>
      {#if caption}<span class="caption">{caption}</span>{/if}
      {#if credit}<span class="credit">{credit}</span>{/if}
    </figcaption>
  {/if}
</figure>

<style>
  .figure {
    margin: 2rem 0;
    padding: 0;
  }
  img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 520px;
    object-fit: cover;
    border-radius: 12px;
    border: 1px solid rgba(122, 162, 255, 0.15);
    background: rgba(255, 255, 255, 0.02);
  }
  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    min-height: 240px;
    border-radius: 12px;
    border: 1px dashed rgba(122, 162, 255, 0.3);
    background: rgba(122, 162, 255, 0.04);
    color: var(--tessera-text-light);
    text-align: center;
    padding: 2rem 1rem;
  }
  .placeholder-icon { font-size: 2rem; opacity: 0.7; }
  .placeholder-text { font-size: 0.85rem; max-width: 32ch; line-height: 1.4; }

  figcaption {
    margin-top: 0.6rem;
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--tessera-text-light);
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .caption { flex: 1; min-width: 0; }
  .credit {
    font-style: italic;
    color: var(--planet-accent);
    opacity: 0.85;
    flex-shrink: 0;
  }
</style>
