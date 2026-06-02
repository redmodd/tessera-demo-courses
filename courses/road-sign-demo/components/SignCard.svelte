<script>
  import { SIGNS_BY_ID } from './road-signs.js';

  // Build-time bundle of every sign SVG, keyed by the glob path. Lets the
  // sign chosen at runtime resolve to a hashed, build-bundled URL rather
  // than a raw string the browser would 404 on.
  const SIGN_URLS = import.meta.glob('../assets/signs/*.svg', {
    eager: true, query: '?url', import: 'default',
  });

  let {
    symbol,
    size = 'md',
    decorative = false,
  } = $props();

  const sign = $derived(SIGNS_BY_ID[symbol]);
  const src = $derived(sign ? SIGN_URLS[`../assets/signs/${sign.file}`] : '');
</script>

{#if sign}
  <img
    class="sign-card-img sign-card-img--{size}"
    {src}
    alt={decorative ? '' : sign.name}
    aria-hidden={decorative ? 'true' : undefined}
    draggable="false"
  />
{/if}

<style>
  .sign-card-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
  }
  .sign-card-img--sm { max-width: 96px; max-height: 96px; }
  .sign-card-img--md { max-width: 160px; max-height: 160px; }
  .sign-card-img--lg { max-width: 220px; max-height: 220px; }
</style>
