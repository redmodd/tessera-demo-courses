<script module>
  export const pageConfig = {
    title: "Road Sign Match",
    quiz: {
      graded: true,
      maxAttempts: Infinity,
      retryMode: "full",
      feedbackMode: "immediate",
    },
  };
</script>

<script>
  import { game } from '../../../components/game-state.svelte.js';
  import SignRound from '../../../components/SignRound.svelte';

  // The custom quiz.svelte shell drives the visible UI; this page just
  // mounts the 15 SignRound widgets so they register with useQuiz. The shell
  // renders the active round via q.render on each Question handle; these
  // instances live under a display:none child slot in the shell.
  game.init();
</script>

{#each game.rounds as round (round.index)}
  <SignRound {round} />
{/each}
