<script>
  import '$shared/tokens.css';
  import './styles/game.css';
  import { onMount, untrack } from 'svelte';
  import { useNavigation, useCompletion, usePersistence } from 'tessera-learn';
  import { readStore, onStoreChange, TOTAL_ANIMALS } from './lib/zoodex.js';
  import ZoodexModal from './components/ZoodexModal.svelte';

  let { page } = $props();
  const nav = useNavigation();
  const completion = useCompletion();
  const store = usePersistence('zoodex');

  const slug = $derived(nav.currentPage?.slug ?? '');
  // The whole game lives on the overworld; the HUD floats over it. The title/how-to
  // screens show no HUD.
  const showHud = $derived(slug === 'overworld');

  let dex = $state(readStore(store));
  const refresh = () => (dex = readStore(store));

  // Keep the HUD live: 'zoodex-change' fires when a card is collected or a badge earned;
  // re-reading on navigation picks up the latest persisted state when pages change.
  // (usePersistence itself isn't reactive across components.)
  onMount(() => onStoreChange(refresh));
  $effect(() => {
    slug; // track navigation only — untrack the store read so writes elsewhere don't
    untrack(refresh); // re-run this effect (and never form a read/write loop)
  });

  // Completion is derived from state, not a click: once all cards are in, complete the
  // course. markComplete() is idempotent, so this fires exactly once even across resumes.
  // TOTAL_ANIMALS is derived from the collectable set (keepers + hidden grass animals), so
  // this fires when all of them are collected. It lives here because the layout is the one
  // unit mounted on every page.
  $effect(() => {
    if (dex.collected.length >= TOTAL_ANIMALS) completion.markComplete();
  });
</script>

{@render page()}

{#if showHud}
  <ZoodexModal />
{/if}
