<script>
  // Flat inline-SVG replacements for the UI emoji the course used to render (party,
  // badge, map, gamepad, door, leaf, notebook, tree). Decorative by default
  // (aria-hidden) — callers that need a label pass their own text alongside. `size`
  // controls the box (defaults to 1em so icons inherit the surrounding font size).
  let { name, size = '1em' } = $props();
</script>

<svg
  class="icon"
  viewBox="0 0 24 24"
  width={size}
  height={size}
  aria-hidden="true"
  role="presentation"
>
  {#if name === 'party'}
    <path d="M3 21l5-11 6 6z" fill="#e0a55a" />
    <path d="M8 10l2 2M9.5 9l2.5 2.5" stroke="#c47d33" stroke-width="1" stroke-linecap="round" />
    <path d="M15 8l4-4" stroke="#16a34a" stroke-width="1.4" stroke-linecap="round" />
    <circle cx="16" cy="6" r="1.4" fill="#dc2626" />
    <circle cx="20" cy="10" r="1.4" fill="#2563eb" />
    <circle cx="14" cy="3" r="1.2" fill="#16a34a" />
    <circle cx="21.5" cy="5" r="1.2" fill="#d97706" />
  {:else if name === 'badge'}
    <path d="M8 2l3 7-3 1-3-6z" fill="#dc2626" />
    <path d="M16 2l-3 7 3 1 3-6z" fill="#2563eb" />
    <circle cx="12" cy="15" r="6" fill="#e8b923" />
    <circle cx="12" cy="15" r="4.2" fill="#f5d65b" />
    <path d="M12 11.7l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z" fill="#b8860b" />
  {:else if name === 'map'}
    <path d="M3 5l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="#d8c9a0" />
    <path d="M9 3v16M15 5v16" stroke="#a8946b" stroke-width="1" />
    <circle cx="13" cy="11" r="2" fill="#dc2626" />
  {:else if name === 'gamepad'}
    <rect x="2" y="8" width="20" height="9" rx="4.5" fill="#5a6b7a" />
    <path d="M6 12.5h4M8 10.5v4" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />
    <circle cx="16" cy="11.5" r="1.3" fill="#dc2626" />
    <circle cx="18.5" cy="13.8" r="1.3" fill="#16a34a" />
  {:else if name === 'door'}
    <rect x="5" y="3" width="14" height="18" rx="1" fill="#a06a3a" />
    <rect x="7" y="5" width="10" height="14" rx="1" fill="#b97a45" />
    <circle cx="15" cy="12" r="1" fill="#f5d65b" />
  {:else if name === 'leaf'}
    <path d="M12 21V9" stroke="#5f7a3e" stroke-width="1.5" stroke-linecap="round" />
    <path d="M12 13C8 13 5 10 5 7c4 0 7 3 7 6z" fill="#6f8c49" />
    <path d="M12 17c4 0 7-3 7-6-4 0-7 3-7 6z" fill="#7d9a55" />
  {:else if name === 'notebook'}
    <rect x="5" y="3" width="14" height="18" rx="1.5" fill="#3a7d57" />
    <rect x="6.5" y="3" width="1.8" height="18" fill="#2c5e41" />
    <rect x="15" y="3" width="1.6" height="18" fill="#d9a441" />
    <path d="M10 8h3.5M10 11h3.5" stroke="#e8f0e8" stroke-width="1" stroke-linecap="round" />
  {:else if name === 'tree'}
    <rect x="10.7" y="16" width="2.6" height="6" rx="0.8" fill="#7a5230" />
    <circle cx="12" cy="8" r="5" fill="#4f7a3e" />
    <circle cx="7" cy="10" r="4.5" fill="#5f8c49" />
    <circle cx="17" cy="10" r="4.5" fill="#5f8c49" />
    <circle cx="5.5" cy="13.5" r="4" fill="#4f7a3e" />
    <circle cx="18.5" cy="13.5" r="4" fill="#4f7a3e" />
    <circle cx="9" cy="14" r="5" fill="#6fa055" />
    <circle cx="15" cy="14" r="5" fill="#6fa055" />
    <circle cx="12" cy="11.5" r="5.5" fill="#5f8c49" />
    <circle cx="9.5" cy="7" r="3" fill="#6fa055" />
  {:else if name === 'sign'}
    <rect x="11" y="11" width="2" height="11" rx="0.6" fill="#7a5230" />
    <rect x="4" y="3" width="16" height="9" rx="1.6" fill="#dcc6a2" stroke="#8a6a44" stroke-width="1.2" />
    <path d="M7 6.2h10M7 8.8h7" stroke="#6f4630" stroke-width="1.2" stroke-linecap="round" />
  {/if}
</svg>

<style>
  .icon {
    display: inline-block;
    vertical-align: -0.15em;
    flex: none;
  }
</style>
