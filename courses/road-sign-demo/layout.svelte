<script>
  import { useNavigation, usePersistence } from 'tessera-learn';
  import { sfx } from './components/sfx.js';
  import './styles/game.css';

  let { page } = $props();
  const nav = useNavigation();
  const mutePref = usePersistence('roadsign-sfx-mute');

  let muted = $state(mutePref.get() === true);
  $effect(() => {
    mutePref.set(muted);
    sfx.setMuted(muted);
  });

  const currentSlug = $derived(nav.currentPage?.slug ?? '');
  const isChromeless = $derived(currentSlug === 'splash' || currentSlug === 'play');
  const showFooter = $derived(!isChromeless && currentSlug !== 'how-to-play');

  function toggleMute() {
    muted = !muted;
    if (!muted) sfx.play('select');
  }
</script>

{#if !isChromeless}
  <header class="course-header">
    <p class="course-eyebrow">Road Sign Match</p>
    <div class="header-tools">
      <button
        class="mute-btn"
        type="button"
        onclick={toggleMute}
        aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
        aria-pressed={muted}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  </header>
{:else}
  <button
    class="mute-btn mute-floating"
    type="button"
    onclick={toggleMute}
    aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
    aria-pressed={muted}
  >
    {muted ? '🔇' : '🔊'}
  </button>
{/if}

<main class="course-main" class:chromeless={isChromeless}>
  {@render page()}
</main>

{#if showFooter}
  <footer class="course-footer">
    <button disabled={!nav.canGoPrev} onclick={() => nav.prev()}>Previous</button>
    <button disabled={!nav.canGoNext} onclick={() => nav.next()}>Next</button>
  </footer>
{/if}

<style>
  .course-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
  .course-eyebrow {
    margin: 0;
    font-size: 0.75rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--rs-warning-amber-deep);
    font-weight: 700;
  }
  .header-tools { display: flex; align-items: center; gap: 1rem; }

  .mute-btn {
    background: rgba(0, 0, 0, 0.05);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    transition: background 150ms ease;
  }
  .mute-btn:hover { background: rgba(0, 0, 0, 0.1); }
  .mute-btn:focus-visible {
    outline: 3px solid #2563eb;
    outline-offset: 2px;
  }
  .mute-floating {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 100;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .course-main { padding: 1.5rem; }
  .course-main.chromeless { padding: 0; }

  .course-footer {
    display: flex;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }
  .course-footer button {
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: white;
    cursor: pointer;
  }
  .course-footer button:disabled { opacity: 0.5; cursor: not-allowed; }
  .course-footer button:focus-visible {
    outline: 3px solid #2563eb;
    outline-offset: 2px;
  }
</style>
