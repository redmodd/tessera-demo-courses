<script>
  import Chapter from './Chapter.svelte';
  import Continue from './Continue.svelte';

  let {
    index,
    reveal,
    total,
    id,
    title,
    eyebrow = '',
    nextLabel,
    nextHint = '',
    children,
  } = $props();
</script>

{#if index < reveal.revealedCount}
  <Chapter {id} {title} {eyebrow}>
    {@render children()}
    {#if nextLabel && reveal.revealedCount < total}
      <Continue label={nextLabel} hint={nextHint} onclick={reveal.revealNext} />
    {/if}
  </Chapter>
{/if}
