<script>
  // The non-spatial path through the spatial game (WCAG): keyboard and screen-reader users
  // open a keeper here instead of walking the grid to it.
  import Animal from './Animal.svelte';
  import Icon from './Icon.svelte';

  let { items, onSelect } = $props();
</script>

<details class="map-menu">
  <summary><span class="ic" aria-hidden="true"><Icon name="map" /></span> Map menu</summary>
  <ul>
    {#each items as item}
      <li>
        <button onclick={() => onSelect?.(item.slug)}>
          <span class="ic" aria-hidden="true"><Animal kind={item.kind} /></span>
          {item.label}
          {#if item.done}<span class="tick"> ✓</span>{/if}
        </button>
      </li>
    {/each}
  </ul>
</details>

<style>
  .map-menu {
    background: var(--zoo-dialog);
    border: 2px solid var(--zoo-bark);
    border-radius: 10px;
    overflow: hidden;
    min-width: 12rem;
  }
  summary {
    padding: 0.5rem 0.85rem;
    font-weight: 700;
    cursor: pointer;
    color: var(--zoo-ink);
  }
  summary:focus-visible {
    outline: 3px solid var(--zoo-accent);
    outline-offset: -3px;
  }
  ul {
    margin: 0;
    padding: 0.25rem;
    list-style: none;
    border-top: 1px solid var(--zoo-border, #d9cdb0);
  }
  li {
    margin: 0;
  }
  li button {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.5rem 0.6rem;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: var(--zoo-ink);
    font: inherit;
    cursor: pointer;
  }
  li button:hover {
    background: var(--zoo-ground);
  }
  li button:focus-visible {
    outline: 3px solid var(--zoo-accent);
    outline-offset: -2px;
  }
  .tick {
    color: var(--zoo-bark);
    font-weight: 700;
  }
  .ic {
    display: inline-flex;
    vertical-align: middle;
  }
  .ic :global(svg) {
    width: 1.25em;
    height: 1.25em;
  }
  li .ic :global(svg) {
    width: 1.6em;
    height: 1.6em;
  }
</style>
