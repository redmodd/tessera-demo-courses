<script>
  import Icon from '../Icon.svelte';
  let { photos } = $props();
  let activeIndex = $state(0);

  const uid = Math.random().toString(36).slice(2, 9);
  const tabId = (i) => `photostrip-${uid}-tab-${i}`;
  const panelId = (i) => `photostrip-${uid}-panel-${i}`;

  function onThumbKeydown(e, i) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    let next = activeIndex;
    if (e.key === 'ArrowRight') next = (i + 1) % photos.length;
    if (e.key === 'ArrowLeft') next = (i - 1 + photos.length) % photos.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = photos.length - 1;
    activeIndex = next;
    document.getElementById(tabId(next))?.focus();
  }
</script>

<div class="strip">
  <div class="featured">
    {#each photos as p, i}
      <div
        id={panelId(i)}
        role="tabpanel"
        aria-labelledby={tabId(i)}
        class="frame"
        class:visible={i === activeIndex}
        aria-hidden={i !== activeIndex}
      >
        <figure class="frame-figure">
          {#if p.src}
            <img src={p.src} alt={p.alt} loading="lazy" />
          {:else}
            <div class="placeholder" role="img" aria-label={p.alt}>
              <span class="placeholder-icon" aria-hidden="true"><Icon name="satellite" /></span>
              <span class="placeholder-text">{p.placeholderLabel ?? p.alt}</span>
            </div>
          {/if}
          <figcaption>
            <span class="year">{p.year}</span>
            <span class="caption">{p.caption}</span>
            {#if p.credit}<span class="credit">{p.credit}</span>{/if}
          </figcaption>
        </figure>
      </div>
    {/each}
  </div>

  <ol class="thumbs" role="tablist" aria-label="Earth-from-space photo timeline">
    {#each photos as p, i}
      <li>
        <button
          type="button"
          id={tabId(i)}
          class="thumb"
          class:active={i === activeIndex}
          role="tab"
          aria-selected={i === activeIndex}
          aria-controls={panelId(i)}
          aria-label={`${p.year}: ${p.title}`}
          tabindex={i === activeIndex ? 0 : -1}
          onclick={() => (activeIndex = i)}
          onkeydown={(e) => onThumbKeydown(e, i)}
        >
          <span class="thumb-year">{p.year}</span>
          <span class="thumb-title">{p.title}</span>
          {#if p.src}
            <img class="thumb-img" src={p.src} alt="" aria-hidden="true" />
          {:else}
            <span class="thumb-placeholder" aria-hidden="true"><Icon name="satellite" /></span>
          {/if}
        </button>
      </li>
    {/each}
  </ol>
</div>

<style>
  .strip {
    margin: 2rem 0;
  }
  .featured {
    position: relative;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(122, 162, 255, 0.2);
    background: rgba(255, 255, 255, 0.02);
  }
  .frame {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  .frame-figure {
    margin: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .frame.visible {
    opacity: 1;
    pointer-events: auto;
  }
  .frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .placeholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, rgba(122,162,255,0.08), rgba(255,255,255,0.02));
    color: var(--tessera-text-light);
    text-align: center;
    padding: 2rem;
  }
  .placeholder-icon { font-size: 2.5rem; opacity: 0.6; }
  .placeholder-text { font-size: 0.9rem; max-width: 32ch; line-height: 1.4; }

  figcaption {
    position: absolute;
    left: 0; right: 0; bottom: 0;
    padding: 1rem 1.25rem;
    background: linear-gradient(180deg, transparent, rgba(0,0,0,0.7) 60%);
    color: var(--tessera-text);
    display: flex;
    align-items: baseline;
    gap: 0.85rem;
    flex-wrap: wrap;
  }
  .year {
    font-size: 0.85rem;
    color: var(--planet-accent);
    font-weight: 600;
    letter-spacing: 0.06em;
  }
  .caption { flex: 1; min-width: 12ch; font-size: 0.9rem; line-height: 1.4; }
  .credit { font-style: italic; font-size: 0.78rem; opacity: 0.7; }

  .thumbs {
    list-style: none;
    margin: 0.85rem 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.6rem;
  }
  .thumb {
    width: 100%;
    display: grid;
    grid-template-areas:
      "year img"
      "title img";
    grid-template-columns: 1fr 50px;
    gap: 0.15rem 0.6rem;
    align-items: center;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(122, 162, 255, 0.15);
    color: var(--tessera-text-light);
    padding: 0.55rem 0.7rem;
    border-radius: 8px;
    cursor: pointer;
    font-family: inherit;
    text-align: left;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }
  .thumb:hover { color: var(--tessera-text); border-color: rgba(122,162,255,0.35); }
  .thumb.active {
    color: var(--tessera-text);
    border-color: var(--planet-accent);
    background: rgba(255, 255, 255, 0.04);
  }
  .thumb-year {
    grid-area: year;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--planet-accent);
  }
  .thumb-title {
    grid-area: title;
    font-size: 0.85rem;
    font-weight: 500;
    line-height: 1.25;
  }
  .thumb-img {
    grid-area: img;
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid rgba(122, 162, 255, 0.2);
  }
  .thumb-placeholder {
    grid-area: img;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(122,162,255,0.08);
    border-radius: 6px;
    border: 1px dashed rgba(122,162,255,0.3);
    font-size: 1.2rem;
    opacity: 0.6;
  }
</style>
