import { useNavigation, useProgress } from 'tessera-learn';

export function useChapterReveal(chapters) {
  const nav = useNavigation();
  const progress = useProgress();
  const pageIndex = nav.currentPageIndex;

  const initialChunk = progress.chunkProgress.get(pageIndex) ?? 0;
  let revealedCount = $state(
    Math.min(Math.max(initialChunk + 1, 1), chapters.length)
  );

  function revealNext() {
    if (revealedCount >= chapters.length) return;
    revealedCount += 1;
    progress.markChunk(pageIndex, revealedCount - 1);
    // Double rAF: first frame lets Svelte commit the new chapter to the DOM;
    // second frame waits for layout so getElementById finds it before scrolling.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const id = chapters[revealedCount - 1]?.id;
        const el = id && document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  return {
    get revealedCount() {
      return revealedCount;
    },
    revealNext,
  };
}
