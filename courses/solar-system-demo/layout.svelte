<script>
  import { useNavigation, usePersistence, useCompletion } from 'tessera-learn';
  import { planets } from './lib/planets.js';
  import CosmicChallenge from './lib/CosmicChallenge.svelte';
  import ModuleComplete from './lib/ModuleComplete.svelte';
  import Icon from './lib/Icon.svelte';
  import './styles/theme.css';

  let { page } = $props();
  const nav = useNavigation();
  const completion = useCompletion();

  const planetSlugs = planets.map((p) => p.slug);

  const slug = $derived(nav.currentPage.slug);
  const isSplash = $derived(slug === 'splash');
  const isHistoryPage = $derived(planetSlugs.includes(slug));
  const isExplorer = $derived(slug === 'explorer');
  const showChallenge = $derived(isExplorer || isHistoryPage);
  const isComplete = $derived(completion.completionStatus === 'complete');
  const showCompleteBtn = $derived(showChallenge && isComplete);

  const bestStore = usePersistence('cosmic-challenge:best');
  const best = $derived(bestStore.get()?.best ?? null);

  let challengeOpen = $state(false);
  let completeOpen = $state(false);
</script>

<div class="app" class:splash={isSplash}>
  {@render page()}

  {#if showChallenge}
    <button
      class="fab challenge-btn"
      onclick={() => (challengeOpen = true)}
      aria-label="Open Cosmic Challenge"
    >
      <span class="rocket"><Icon name="rocket" /></span>
      <span class="label">
        <span class="title">Cosmic Challenge</span>
        {#if best !== null}
          <span class="best-tag">Best: {best}/10</span>
        {/if}
      </span>
    </button>
  {/if}

  {#if showCompleteBtn}
    <button
      class="fab complete-btn"
      onclick={() => (completeOpen = true)}
      aria-label="You've completed the module"
    >
      <span class="trophy"><Icon name="trophy" /></span>
      <span class="label">
        <span class="title">Module complete</span>
        <span class="best-tag">All {planets.length} worlds visited</span>
      </span>
    </button>
  {/if}

  <CosmicChallenge bind:open={challengeOpen} />
  <ModuleComplete bind:open={completeOpen} />
</div>

<style>
  :global(html, body, #app) {
    height: 100%;
  }
  .app {
    min-height: 100vh;
    position: relative;
  }

  .fab {
    position: fixed;
    bottom: 1.5rem;
    z-index: 800;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 1.1rem 0.7rem 0.85rem;
    border-radius: 999px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: var(--tessera-text);
    cursor: pointer;
    font-family: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .fab:hover { transform: translateY(-2px); }
  .fab .label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.1;
  }
  .fab .title {
    font-weight: 600;
    font-size: 0.95rem;
  }
  .fab .best-tag {
    font-size: 0.7rem;
    color: var(--tessera-text-light);
    margin-top: 2px;
  }
  @media (max-width: 540px) {
    .fab .title { font-size: 0.85rem; }
    .fab { padding: 0.6rem 0.9rem; }
  }

  /* Modal-open chrome hides the FABs so they don't overlap the dialog. */
  .app:has(:global([role="dialog"])) .fab {
    display: none;
  }

  .challenge-btn {
    right: 1.5rem;
    border: 1px solid rgba(122,162,255,0.4);
    background: linear-gradient(135deg, rgba(122,162,255,0.18), rgba(74,222,128,0.12));
    box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 0 24px rgba(122,162,255,0.15);
  }
  .challenge-btn:hover {
    box-shadow: 0 12px 28px rgba(0,0,0,0.5), 0 0 32px rgba(122,162,255,0.3);
  }
  .challenge-btn .rocket {
    font-size: 1.4rem;
    display: inline-block;
    animation: rocket-pulse 2.4s ease-in-out infinite;
  }
  @keyframes rocket-pulse {
    0%, 100% { transform: translateY(0) rotate(-12deg); }
    50% { transform: translateY(-3px) rotate(-8deg); }
  }

  .complete-btn {
    left: 1.5rem;
    border: 1px solid rgba(74, 222, 128, 0.5);
    background: linear-gradient(135deg, rgba(74,222,128,0.18), rgba(122,162,255,0.12));
    box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 0 24px rgba(74,222,128,0.2);
    animation: complete-pop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  @keyframes complete-pop {
    from { transform: translateY(8px) scale(0.9); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }
  .complete-btn:hover {
    box-shadow: 0 12px 28px rgba(0,0,0,0.5), 0 0 32px rgba(74,222,128,0.4);
  }
  .complete-btn .trophy {
    font-size: 1.4rem;
    display: inline-block;
  }
</style>
