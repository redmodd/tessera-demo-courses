<script>
  let { name, class: cls = '' } = $props();
</script>

{#if name === 'rocket'}
  <svg viewBox="0 0 24 24" fill="currentColor" class={cls} aria-hidden="true">
    <path d="M12 2c-3 2-5 5.5-5 9v3.5l-1.5 1.5V19l3-1 .5.5h6l.5-.5 3 1v-3l-1.5-1.5V11c0-3.5-2-7-5-9zm0 7a2 2 0 110 4 2 2 0 010-4z"/>
    <path d="M6 19v3l3-1.5V19l-3 0zm12 0v3l-3-1.5V19l3 0z" opacity=".7"/>
  </svg>
{:else if name === 'trophy'}
  <svg viewBox="0 0 24 24" fill="currentColor" class={cls} aria-hidden="true">
    <path d="M7 3v3H4v3a4 4 0 004 4 5 5 0 003 2.9V18H8v3h8v-3h-3v-2.1a5 5 0 003-2.9 4 4 0 004-4V6h-3V3H7zM6 8v3a2 2 0 01-2-2V8h2zm14 1a2 2 0 01-2 2V8h2v1z"/>
  </svg>
{:else if name === 'satellite'}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class={cls} aria-hidden="true">
    <rect x="9" y="9" width="6" height="6" transform="rotate(45 12 12)"/>
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>
    <path d="M3 3l4 4M21 3l-4 4M3 21l4-4M21 21l-4-4"/>
  </svg>
{:else if name === 'galaxy'}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" class={cls} aria-hidden="true">
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>
    <path d="M12 4a8 8 0 017.5 11M12 20a8 8 0 01-7.5-11"/>
    <path d="M12 8a4 4 0 014 6M12 16a4 4 0 01-4-6"/>
    <circle cx="4" cy="6" r=".7" fill="currentColor" stroke="none"/>
    <circle cx="20" cy="18" r=".7" fill="currentColor" stroke="none"/>
    <circle cx="19" cy="5" r=".4" fill="currentColor" stroke="none"/>
    <circle cx="5" cy="19" r=".4" fill="currentColor" stroke="none"/>
  </svg>
{:else if name === 'sparkles'}
  <svg viewBox="0 0 24 24" fill="currentColor" class={cls} aria-hidden="true">
    <path d="M11 2l1.7 5.3L18 9l-5.3 1.7L11 16l-1.7-5.3L4 9l5.3-1.7L11 2zm8 11l.9 2.6L22 16.5l-2.1.9L19 20l-.9-2.6L16 16.5l2.1-.9L19 13zM5.5 14l.6 2 2 .5-2 .6L5.5 19l-.6-1.9L3 16.5l1.9-.5.6-2z"/>
  </svg>
{:else if name === 'globe'}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" class={cls} aria-hidden="true">
    <circle cx="12" cy="12" r="9"/>
    <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>
  </svg>
{:else if name === 'firework'}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" class={cls} aria-hidden="true">
    <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/>
    <line x1="12" y1="3" x2="12" y2="6.5"/>
    <line x1="12" y1="17.5" x2="12" y2="21"/>
    <line x1="3" y1="12" x2="6.5" y2="12"/>
    <line x1="17.5" y1="12" x2="21" y2="12"/>
    <line x1="5.5" y1="5.5" x2="8" y2="8"/>
    <line x1="16" y1="16" x2="18.5" y2="18.5"/>
    <line x1="18.5" y1="5.5" x2="16" y2="8"/>
    <line x1="5.5" y1="18.5" x2="8" y2="16"/>
    <circle cx="3.5" cy="8.5" r=".7" fill="currentColor" stroke="none"/>
    <circle cx="20.5" cy="15.5" r=".7" fill="currentColor" stroke="none"/>
    <circle cx="8.5" cy="3.5" r=".7" fill="currentColor" stroke="none"/>
    <circle cx="15.5" cy="20.5" r=".7" fill="currentColor" stroke="none"/>
  </svg>
{/if}

<style>
  svg {
    width: 1em;
    height: 1em;
    display: inline-block;
    vertical-align: middle;
  }
</style>
