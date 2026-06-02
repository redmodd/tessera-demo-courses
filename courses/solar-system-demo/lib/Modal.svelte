<script>
  let {
    open = $bindable(false),
    label,
    maxWidth = '640px',
    centered = false,
    closable = true,
    onclose,
    children,
  } = $props();

  let dialog = $state(null);
  let returnFocusTo = null;

  function close() {
    if (!closable) return;
    open = false;
    onclose?.();
  }

  function onKeydown(e) {
    if (!open) return;
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'Tab') trapFocus(e);
  }

  function focusables() {
    if (!dialog) return [];
    const sel =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(dialog.querySelectorAll(sel)).filter(
      (el) => !el.hasAttribute('aria-hidden') && el.offsetParent !== null
    );
  }

  function trapFocus(e) {
    const items = focusables();
    if (items.length === 0) {
      e.preventDefault();
      dialog?.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !dialog.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  $effect(() => {
    if (open) {
      returnFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      // Defer to next microtask so the dialog is in the DOM.
      queueMicrotask(() => {
        const items = focusables();
        (items[0] ?? dialog)?.focus();
      });
    } else if (returnFocusTo) {
      const target = returnFocusTo;
      returnFocusTo = null;
      queueMicrotask(() => target.focus?.());
    }
  });
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
  <div class="overlay" role="dialog" aria-modal="true" aria-label={label} bind:this={dialog} tabindex="-1">
    <div class="modal" class:centered style="max-width: {maxWidth};">
      {#if closable}
        <button class="close" onclick={close} aria-label="Close">×</button>
      {/if}
      {@render children({ close })}
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(2, 4, 16, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 9000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    animation: fade 0.25s ease-out;
  }
  .overlay:focus { outline: none; }

  @keyframes fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal {
    position: relative;
    background: linear-gradient(160deg, #0c1130 0%, #060818 100%);
    border: 1px solid rgba(122, 162, 255, 0.25);
    border-radius: 18px;
    padding: 2.5rem 2.25rem 2rem;
    width: 100%;
    max-height: calc(100vh - 3rem);
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(122,162,255,0.08);
    color: var(--tessera-text);
  }

  .modal.centered {
    text-align: center;
  }

  .close {
    position: absolute;
    top: 0.75rem;
    right: 1rem;
    background: none;
    border: none;
    color: var(--tessera-text-light);
    font-size: 1.8rem;
    cursor: pointer;
    line-height: 1;
    padding: 0.25rem 0.5rem;
  }
  .close:hover { color: var(--tessera-text); }
  .close:focus-visible { outline: 2px solid var(--tessera-primary); outline-offset: 2px; border-radius: 4px; }
</style>
