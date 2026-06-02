<script module>
  export const pageConfig = { title: "Neptune" };
</script>

<script>
  import { getPlanet } from '../../../lib/planets.js';
  import {
    HistoryShell, RevealChapter, PullQuote, Factoid, Figure, FigureCard, MissionCard, DeepDive, Term,
  } from '../../../lib/history/index.js';
  import { useChapterReveal } from '../../../lib/history/useChapterReveal.svelte.js';
  import neptuneVoyager from '$assets/neptune/neptune-voyager.jpg';
  import neptuneTriton from '$assets/neptune/neptune-triton.jpg';

  const planet = getPlanet('neptune');

  const chapters = [
    { id: 'ancient', title: 'Modern only' },
    { id: 'telescope', title: 'Discovery by math' },
    { id: 'space-age', title: 'Space age' },
    { id: 'whats-next', title: "What's next" },
    { id: 'beyond', title: 'Beyond' },
  ];

  const keyDates = [
    { year: '28 Dec 1612', event: 'Galileo unwittingly observes Neptune', anchor: 'date-galileo', chapterIndex: 0 },
    { year: '1843', event: 'Adams begins predicting an unseen planet', anchor: 'date-adams', chapterIndex: 1 },
    { year: 'Jun 1846', event: "Le Verrier publishes refined prediction", anchor: 'date-leverrier', chapterIndex: 1 },
    { year: '23 Sep 1846', event: 'Galle and d\'Arrest find Neptune in one hour', anchor: 'date-galle', chapterIndex: 1 },
    { year: '10 Oct 1846', event: 'Lassell discovers Triton', anchor: 'date-triton', chapterIndex: 1 },
    { year: '1949', event: 'Kuiper finds Nereid', anchor: 'date-nereid', chapterIndex: 1 },
    { year: '25 Aug 1989', event: 'Voyager 2 closest approach', anchor: 'date-voyager', chapterIndex: 2 },
  ];

  const reveal = useChapterReveal(chapters);
  const total = chapters.length;
</script>

<HistoryShell {planet} {chapters} {keyDates} revealedCount={reveal.revealedCount}>
  <RevealChapter
    index={0}
    {reveal}
    {total}
    id="ancient"
    title="A modern story"
    eyebrow="Section 1"
    nextLabel="Discovery by mathematics"
    nextHint="Section 2: a planet predicted, then found in an hour"
  >
    <h3 class="sub">Invisible to the naked eye</h3>

    <div class="drop-cap">
      <p>
        Neptune is too faint to see with the naked eye.
      </p>
    </div>

    <p>
      Unlike every other planet in this module, no ancient culture knew it existed; no mythology
      grew up around it; no calendar marked its motion. Its history is entirely a modern story.
    </p>

    <h3 class="sub">A near-discovery in 1612</h3>

    <span id="date-galileo" class="rail-anchor"></span>
    <DeepDive
      title="Galileo nearly discovered Neptune, twice"
      teaser="In 1612–13 he drew it as a 'fixed star' in his notebooks. Then noticed it had moved. Then moved on."
    >
      <p>
        <strong>Galileo Galilei</strong>, sweeping the sky on <strong>28 December 1612</strong>
        while watching the moons of Jupiter, drew a small "fixed star" in his notebook. A second
        drawing on <strong>27 January 1613</strong> shows the same object having shifted position
        relative to its neighbours. Galileo even noted the apparent motion but did not pursue it.
      </p>
      <p>
        Modern reconstructions show that the object was Neptune, then in conjunction with Jupiter.
        Had Galileo investigated, he could have discovered a new planet two and a half centuries
        early. The honour, and the planet's eventual name, would have to wait.
      </p>
    </DeepDive>
  </RevealChapter>

  <RevealChapter
    index={1}
    {reveal}
    {total}
    id="telescope"
    title="Discovery by mathematics"
    eyebrow="Section 2"
    nextLabel="The space age"
    nextHint="Section 3: a single spacecraft, ever"
  >
    <h3 class="sub">A planet predicted, not seen</h3>

    <div class="drop-cap">
      <p>
        The story of Neptune's actual discovery is one of the great triumphs of theoretical
        physics, and one of the great priority disputes in the history of science.
      </p>
    </div>

    <p>
      By the 1830s, astronomers across Europe were puzzled by <strong>Uranus</strong>. Despite
      increasingly precise measurements, the planet refused to follow the orbit Newtonian mechanics
      predicted.
    </p>

    <p>
      The discrepancies were small, but real, and growing. The most popular explanation was that
      another, more distant planet was perturbing Uranus's path through gravitational tugs.
    </p>

    <h3 class="sub">Two mathematicians, one answer</h3>

    <FigureCard
      name="John Couch Adams"
      dates="1819–1892"
      role="British mathematician; predicted Neptune's position by 1845"
    />
    <FigureCard
      name="Urbain Le Verrier"
      dates="1811–1877"
      role="French mathematician; independently predicted Neptune by June 1846"
    />

    <p id="date-adams">
      In <strong>1843</strong>, a young Cambridge mathematician named <strong>John Couch Adams</strong>
      began calculating where such a planet would have to be. Working alone, with little
      observational support, he produced a position estimate by 1845 and presented it to the
      Astronomer Royal, <strong>George Airy</strong>, who failed to act on it for nearly a year.
    </p>

    <p id="date-leverrier">
      Meanwhile, in France, <strong>Urbain Le Verrier</strong> was performing the same calculation
      entirely independently. By June 1846 he had an even more refined prediction and began
      publishing his results.
    </p>

    <h3 class="sub">A British search that wasn't fast enough</h3>

    <p>
      When Airy belatedly noticed how closely Adams's and Le Verrier's predictions agreed, he asked
      <strong>James Challis</strong> at Cambridge to begin a search. Challis began plotting stars
      night after night, intending to compare them later, but his procedure was painfully slow
      and he failed to recognise what he had even when Neptune passed through his field of view.
    </p>

    <h3 class="sub">An hour at the Berlin Observatory</h3>

    <PullQuote>
      Within an hour, they had found a star not on their charts, and within a degree of where
      Le Verrier said it would be.
    </PullQuote>

    <p id="date-galle">
      Le Verrier, frustrated by lukewarm interest among French astronomers, wrote on
      <strong>18 September 1846</strong> to <strong>Johann Galle</strong> at the Berlin Observatory,
      asking him to look at a specific spot in the sky.
    </p>

    <p>
      Galle received the letter on the evening of <strong>23 September 1846</strong>. He and his
      student <strong>Heinrich d'Arrest</strong> turned the observatory's refractor to the
      predicted position. It was Neptune.
    </p>

    <Factoid value="Pencil and paper">
      Neptune was discovered by hand calculation, before any telescope was pointed in the right
      direction, the strongest possible vindication of Newtonian gravity.
    </Factoid>

    <p>
      Neptune takes <strong>165 Earth years</strong> to circle the Sun once. That means the
      planet completed only its first full orbit since discovery in <strong>2011</strong>, on
      the 165th anniversary of Galle's pointing of the telescope.
    </p>

    <DeepDive
      title="The Adams / Le Verrier priority controversy"
      teaser="A century-long dispute over who really found Neptune."
    >
      <p>
        The British and French each claimed discovery priority on behalf of their countryman, in
        a dispute that flared for decades. Modern historical consensus assigns the credit jointly
        to Le Verrier, Adams, and Galle (with d'Arrest a frequently overlooked fourth).
      </p>
      <p>
        Le Verrier briefly proposed <em>Le Verrier</em> (named for himself), but the consensus
        settled on <strong>Neptune</strong>, the Roman god of the sea, fitting for a planet of
        deep, ocean-blue colour.
      </p>
    </DeepDive>

    <h3 class="sub">A new world, then its moons</h3>

    <p id="date-triton">
      The British astronomer <strong>William Lassell</strong>, observing from his private
      observatory in Liverpool, discovered <strong>Triton</strong> just 17 days after Neptune
      itself was found.
    </p>
    <p id="date-nereid">
      <strong>Nereid</strong>, a small distant moon, wasn't found until 1949 by
      <strong>Gerard Kuiper</strong>. The remaining moons would have to wait for spacecraft.
    </p>
  </RevealChapter>

  <RevealChapter
    index={2}
    {reveal}
    {total}
    id="space-age"
    title="The space age"
    eyebrow="Section 3"
    nextLabel="What's next"
    nextHint="Section 4: the long wait for a return mission"
  >
    <h3 class="sub">A single spacecraft, ever</h3>

    <div class="drop-cap">
      <p id="date-voyager">
        Neptune has been visited by exactly one spacecraft.
      </p>
    </div>

    <p>
      <strong>Voyager 2</strong>, having already flown past Jupiter, Saturn, and Uranus, made its
      closest approach on <strong>25 August 1989</strong>, just over 12 years after launch and
      at the time the farthest object humanity had ever directed a spacecraft to.
    </p>

    <MissionCard
      name="Voyager 2 at Neptune"
      agency="NASA"
      dates="25 August 1989"
      summary="Only spacecraft ever to visit Neptune. Closest planetary approach of the entire mission."
    >
      <p>
        Voyager 2 passed within about 4,950 km of Neptune's cloud tops, the closest of any
        planetary encounter on the mission.
      </p>
      <p>
        The pictures it returned were spectacular. Neptune was deep blue, banded with white
        methane-cirrus clouds, and dominated by an enormous storm comparable to Jupiter's Great
        Red Spot, the <strong>Great Dark Spot</strong>. The Spot has since vanished; by the
        time Hubble looked again in 1994, it was gone.
      </p>
    </MissionCard>

    <Figure
      src={neptuneVoyager}
      alt="A deep-blue Neptune photographed by Voyager 2, with white methane clouds and a dark oval storm, the Great Dark Spot, in the southern hemisphere."
      caption="Neptune from Voyager 2, August 1989, the deep blue colour and the now-vanished Great Dark Spot are both clearly visible."
      credit="NASA / JPL"
    />

    <Factoid value="2,000+ km/h">
      Wind speeds in Neptune's atmosphere, supersonic by Earth standards, and the fastest in the
      solar system. How Neptune drives such fast winds while receiving only 1/900th of Earth's
      sunlight is still not fully understood.
    </Factoid>

    <h3 class="sub">Triton, the strangest moon</h3>

    <p>
      Voyager 2's biggest revelation was about <strong>Triton</strong>, Neptune's largest moon.
      Triton turned out to be one of the strangest worlds in the solar system: a Pluto-sized body
      of nitrogen ice and rock, with active
      <Term definition="Volcanism driven by liquid water or other volatiles instead of molten rock, geyser-like eruptions of icy material.">cryovolcanism</Term>,
      geyser-like plumes of nitrogen gas erupting through the surface.
    </p>

    <PullQuote>
      Triton orbits Neptune in the opposite direction from the planet's rotation, which is
      essentially impossible for a moon that formed in place.
    </PullQuote>

    <p>
      Triton must have been <strong>captured</strong>, a former Kuiper Belt object that wandered
      too close to Neptune and was caught by its gravity. It is, in effect, a window into a
      population of distant icy worlds that we have only barely begun to study.
    </p>

    <Figure
      src={neptuneTriton}
      alt="A mosaic of Triton from Voyager 2, showing its mottled, pinkish-white surface and the dark streaks of nitrogen geyser plumes."
      caption="Triton, a Voyager 2 mosaic from 1989. The streaks across the southern hemisphere are deposits from active nitrogen geysers."
      credit="NASA / JPL"
    />
  </RevealChapter>

  <RevealChapter
    index={3}
    {reveal}
    {total}
    id="whats-next"
    title="What's next"
    eyebrow="Section 4"
    nextLabel="Beyond Neptune"
    nextHint="Coda, the Kuiper Belt, the Oort Cloud, and out"
  >
    <h3 class="sub">No mission on the books</h3>

    <p>
      There is no Neptune mission currently funded or in active development, a sobering fact,
      given that Voyager 2's flyby is now closer to a generation ago than to the present day.
    </p>

    <h3 class="sub">Long-discussed proposals</h3>

    <p>
      Various proposals have been discussed for decades: a Cassini-style
      <strong>Neptune Odyssey</strong> orbiter, joint missions with ESA, smaller Triton-focused
      flyby probes.
    </p>

    <p>
      Long flight times (over a decade each way) and limited launch windows make any Neptune
      mission ambitious and expensive. The 2022 Decadal Survey ranked a dedicated Uranus mission
      ahead of a Neptune mission for the 2030s, so the next wait is probably long.
    </p>
  </RevealChapter>

  <RevealChapter
    index={4}
    {reveal}
    {total}
    id="beyond"
    title="And beyond Neptune…"
    eyebrow="Coda"
  >
    <h3 class="sub">The Kuiper Belt</h3>

    <p>
      Past Neptune, the solar system fades into the <strong>Kuiper Belt</strong>, a vast disc
      of icy bodies including the dwarf planets <strong>Pluto</strong> (reclassified in 2006 and
      visited by NASA's <strong>New Horizons</strong> in 2015), <strong>Eris</strong>,
      <strong>Makemake</strong>, <strong>Haumea</strong>, and many more.
    </p>

    <h3 class="sub">The Oort Cloud, and beyond</h3>

    <p>
      Further out still lies the hypothesised <strong>Oort Cloud</strong>, a roughly spherical
      shell of comets stretching perhaps 100,000 AU from the Sun. Beyond that, the Sun's gravity
      finally yields to the gravity of the wider galaxy.
    </p>

    <p>
      Voyagers 1 and 2, launched in 1977, are now in interstellar space, the first human-made
      objects to leave the Sun's domain, and the only ones we are likely to send for a long
      time.
    </p>
  </RevealChapter>
</HistoryShell>
