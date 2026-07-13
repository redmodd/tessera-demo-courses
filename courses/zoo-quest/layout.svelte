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
  const showHud = $derived(slug === 'overworld');

  let dex = $state(readStore(store));
  const refresh = () => (dex = readStore(store));

  // usePersistence isn't reactive across components, so re-read on 'zoodex-change' and on
  // navigation.
  onMount(() => onStoreChange(refresh));
  $effect(() => {
    slug; // track navigation only — untrack the store read so writes elsewhere don't
    untrack(refresh); // re-run this effect (and never form a read/write loop)
  });

  // Completion is derived from state, not a click. markComplete() is idempotent, and the
  // layout is the one unit mounted on every page.
  $effect(() => {
    if (dex.collected.length >= TOTAL_ANIMALS) completion.markComplete();
  });
</script>

{@render page()}

{#if showHud}
  <ZoodexModal />
{/if}
