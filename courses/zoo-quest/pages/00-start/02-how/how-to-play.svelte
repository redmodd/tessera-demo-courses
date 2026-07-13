<script module>
  export const pageConfig = { title: 'How to Play' };
</script>

<script>
  import { useNavigation } from 'tessera-learn';
  import Icon from '../../../components/Icon.svelte';
  import { TOTAL_ANIMALS } from '../../../lib/zoodex.js';
  const nav = useNavigation();
</script>

<main class="how">
  <h1>How to play</h1>

  <ul class="rules">
    <li>
      <span class="ic" aria-hidden="true"><Icon name="gamepad" /></span>
      <span><strong>Walk</strong> with the arrow keys or <kbd>WASD</kbd> — or click a
        tile to walk there.</span>
    </li>
    <li>
      <span class="ic" aria-hidden="true"><Icon name="door" /></span>
      <span>Step onto an <strong>enclosure gate</strong> to meet an animal and
        <strong>add its card</strong> to your Zoodex.</span>
    </li>
    <li>
      <span class="ic" aria-hidden="true"><Icon name="leaf" /></span>
      <span>Cross the <strong>tall grass</strong> and a critter might appear — say
        hello and learn something.</span>
    </li>
    <li>
      <span class="ic" aria-hidden="true"><Icon name="badge" /></span>
      <span>Find the <strong>keeper</strong> in each region and pass their challenge to
        earn a <strong>badge</strong>.</span>
    </li>
    <li>
      <span class="ic" aria-hidden="true"><Icon name="notebook" /></span>
      <span>Open your <strong>Zoodex</strong> any time to review the cards and badges
        you've collected.</span>
    </li>
  </ul>

  <p class="goal">Goal: collect all <strong>{TOTAL_ANIMALS} animal cards</strong> to complete Zoo Quest.</p>

  <button class="go" onclick={() => nav.goTo('overworld')}>Start exploring →</button>
</main>

<style>
  .how {
    min-height: 100dvh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    padding: 1.5rem;
    overflow-y: auto;
    background: var(--tessera-bg);
    color: var(--zoo-ink);
  }
  h1 {
    margin: 0;
    color: var(--zoo-bark);
  }
  .rules {
    list-style: none;
    margin: 0;
    padding: 0;
    max-width: 38rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }
  .rules li {
    display: flex;
    gap: 0.85rem;
    align-items: flex-start;
    line-height: 1.5;
  }
  .ic {
    flex: none;
    font-size: 1.5rem;
    line-height: 1.4;
  }
  kbd {
    background: var(--zoo-dialog);
    border: 1px solid var(--zoo-bark);
    border-radius: 4px;
    padding: 0 0.3rem;
    font-size: 0.9em;
  }
  .goal {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    text-align: center;
  }
  .go {
    padding: 0.8rem 1.8rem;
    border: none;
    border-radius: 999px;
    background: var(--zoo-accent-deep);
    color: #fff;
    font: inherit;
    font-size: 1.1rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 5px 0 rgba(58, 51, 34, 0.25);
  }
  .go:hover {
    filter: brightness(1.07);
  }
  .go:focus-visible {
    outline: 4px solid var(--zoo-bark);
    outline-offset: 4px;
  }
</style>
