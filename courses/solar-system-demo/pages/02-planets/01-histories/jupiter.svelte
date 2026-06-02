<script module>
  export const pageConfig = { title: "Jupiter" };
</script>

<script>
  import { getPlanet } from '../../../lib/planets.js';
  import {
    HistoryShell, RevealChapter, PullQuote, Factoid, Figure, FigureCard, MissionCard, DeepDive,
    NameTile,
  } from '../../../lib/history/index.js';
  import { useChapterReveal } from '../../../lib/history/useChapterReveal.svelte.js';
  import jupiterGalileanMoons from '$assets/jupiter/jupiter-galilean-moons.jpg';
  import jupiterHubbleGrs from '$assets/jupiter/jupiter-hubble-grs.jpg';
  import jupiterJunoSouthpole from '$assets/jupiter/jupiter-juno-southpole.jpg';

  const planet = getPlanet('jupiter');

  const chapters = [
    { id: 'ancient', title: 'Ancient' },
    { id: 'telescope', title: 'Telescope' },
    { id: 'space-age', title: 'Space age' },
    { id: 'whats-next', title: "What's next" },
  ];

  const keyDates = [
    { year: '7 Jan 1610', event: 'Galileo discovers four moons of Jupiter', anchor: 'date-galileo', chapterIndex: 1 },
    { year: '1664', event: 'Hooke describes the Great Red Spot', anchor: 'date-hooke', chapterIndex: 1 },
    { year: '1676', event: "Rømer measures the speed of light using Io", anchor: 'date-romer', chapterIndex: 1 },
    { year: '1973', event: 'Pioneer 10, first to cross the asteroid belt', anchor: 'date-pioneer', chapterIndex: 2 },
    { year: '1979', event: 'Voyager flybys reveal Jupiter\'s ring and Io volcanism', anchor: 'date-voyager', chapterIndex: 2 },
    { year: '1995–2003', event: 'Galileo orbits Jupiter, drops a probe', anchor: 'date-galileo-mission', chapterIndex: 2 },
    { year: '2016–present', event: 'Juno polar orbiter', anchor: 'date-juno', chapterIndex: 2 },
    { year: '2030s', event: 'Europa Clipper, JUICE arrive', anchor: 'date-clipper', chapterIndex: 3 },
  ];

  const nameTiles = [
    { word: 'Mulu-babbar', language: 'Babylonian', meaning: '"the white star", anchored the 12-year cycle' },
    { word: 'Suixing', language: 'Chinese', meaning: '"year star", one year per zodiac house' },
    { word: 'Phaethon / Zeus', language: 'Greek', meaning: 'associated with Zeus, ruler of the sky' },
    { word: 'Jupiter', language: 'Roman', meaning: 'king of the gods, wielder of thunder' },
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
    title="Ancient knowledge & mythology"
    eyebrow="Section 1"
    nextLabel="The telescope era"
    nextHint="Section 2: the night Galileo found four new worlds"
  >
    <h3 class="sub">A planet that owns the sky</h3>

    <div class="drop-cap">
      <p>
        Jupiter is the fourth-brightest natural object in the night sky, after the Sun, the Moon,
        and Venus.
      </p>
    </div>

    <p>
      It outshines every star, and unlike Venus it can be seen high overhead at midnight,
      dominating the sky for half the year at a time.
    </p>

    <h3 class="sub">A calendar in the sky</h3>

    <PullQuote>
      Its dominance was somehow felt by sky-watchers who had no idea of its actual size.
    </PullQuote>

    <div class="name-grid">
      {#each nameTiles as t}
        <NameTile word={t.word} language={t.language} meaning={t.meaning} />
      {/each}
    </div>

    <p>
      The choice of names was apt: Jupiter is the largest planet by far, more massive than every
      other planet, moon, asteroid, and comet in the solar system combined.
    </p>
  </RevealChapter>

  <RevealChapter
    index={1}
    {reveal}
    {total}
    id="telescope"
    title="The telescope era"
    eyebrow="Section 2"
    nextLabel="The space age"
    nextHint="Section 3: Pioneer, Voyager, Galileo, Juno"
  >
    <h3 class="sub">January 7th, 1610</h3>

    <div class="drop-cap">
      <p id="date-galileo">
        The Jupiter story changes overnight on <strong>7 January 1610</strong>.
      </p>
    </div>

    <p>
      <strong>Galileo Galilei</strong> pointed his new telescope at Jupiter from Padua and saw
      three small "stars" arranged in a line beside the planet. Over the next few nights they
      moved, and a fourth appeared.
    </p>

    <p>
      Galileo realised they weren't stars but moons, orbiting Jupiter. It was the first direct
      evidence that not everything in the heavens revolved around Earth, and one of the
      foundational observations of modern astronomy. The four largest moons,
      <strong>Io, Europa, Ganymede, and Callisto</strong>, are still called the
      <strong>Galilean moons</strong> in his honour.
    </p>

    <Figure
      src={jupiterGalileanMoons}
      alt="Jupiter and its four largest moons, Io, Europa, Ganymede, and Callisto, shown to scale."
      caption="Jupiter and the four Galilean moons, the first new worlds humanity ever discovered."
      credit="NASA"
    />

    <FigureCard
      name="Galileo Galilei"
      dates="1564–1642"
      role="Discovered the four largest moons of Jupiter"
    />

    <span id="date-romer" class="rail-anchor"></span>
    <DeepDive
      title="Rømer and the speed of light"
      teaser="Io's eclipse timings revealed something nobody expected: light travels at a finite speed."
    >
      <p>
        In 1676 the Danish astronomer <strong>Ole Rømer</strong> noticed that Io's eclipses behind
        Jupiter arrived earlier when Earth was on Jupiter's side of the Sun and later when Earth
        was on the far side. The pattern only made sense if light took time to cross the changing
        distance between them.
      </p>
      <p>
        He correctly concluded that <strong>light has a finite speed</strong> and used the timing
        difference to make the first quantitative estimate of it, within 25% of the modern value.
        Until Rømer, most natural philosophers believed light travelled instantaneously.
      </p>
    </DeepDive>

    <h3 class="sub">A storm centuries old</h3>

    <p id="date-hooke">
      The <strong>Great Red Spot</strong>, Jupiter's giant atmospheric storm, was first described
      by <strong>Robert Hooke</strong> in 1664 and then more reliably by Cassini in 1665.
    </p>

    <p>
      Whether what they saw is the same storm we see today is debated, there's a gap in the
      records, but the Spot has certainly been raging continuously since at least 1830.
    </p>

    <Figure
      src={jupiterHubbleGrs}
      alt="A Hubble Space Telescope view of Jupiter showing its banded cloud tops and the Great Red Spot, a vast oval storm in the southern hemisphere."
      caption="Jupiter and the shrunken Great Red Spot, photographed by Hubble, a single storm that has been raging for centuries."
      credit="NASA / ESA / Hubble"
    />

    <Factoid value="350+ years">
      How long Jupiter's Great Red Spot has been raging, a single storm larger than Earth, that
      has slowly been shrinking and changing colour over the past century.
    </Factoid>

    <p>
      Jupiter spins faster than any other planet, a single day, sunrise to sunrise, lasts only
      <strong>about 10 hours</strong>. The rotation is so quick that the planet bulges visibly
      at the equator, and it shapes the bands and storms that dominate the cloud tops.
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
    nextHint="Section 4: hunting life on icy moons"
  >
    <h3 class="sub">First visits</h3>

    <div class="drop-cap">
      <p>
        Jupiter's enormous gravity makes it both an irresistible destination and a difficult one.
      </p>
    </div>

    <span id="date-pioneer" class="rail-anchor"></span>
    <MissionCard
      name="Pioneer 10 & 11"
      agency="NASA"
      dates="1972 / 1973 launches"
      summary="First spacecraft to cross the asteroid belt and reach Jupiter."
    >
      <p>
        Pioneer 10 (1973) and Pioneer 11 (1974) returned the first close-up images of Jupiter and
        confirmed the planet's intense radiation belts.
      </p>
    </MissionCard>

    <span id="date-voyager" class="rail-anchor"></span>
    <MissionCard
      name="Voyager 1 & 2"
      agency="NASA"
      dates="1979 flybys"
      summary="Discovered Jupiter's ring, active volcanoes on Io, and the cracked icy surface of Europa."
    >
      <p>
        The Voyager 1 and 2 flybys in 1979 transformed our picture of the system: they discovered
        Jupiter's faint ring, recorded active volcanoes on <strong>Io</strong> (the first known to
        exist beyond Earth), and revealed the cracked, icy surface of <strong>Europa</strong>,
        hinting at a hidden ocean.
      </p>
    </MissionCard>

    <h3 class="sub">Settling in for a long stay</h3>

    <span id="date-galileo-mission" class="rail-anchor"></span>
    <MissionCard
      name="Galileo"
      agency="NASA"
      dates="1995–2003 in orbit"
      summary="First Jupiter orbiter; dropped a probe directly into the planet's atmosphere."
    >
      <p>
        The Galileo mission was the first to settle in for a long stay. It dropped a probe directly
        into Jupiter's atmosphere, the only spacecraft to ever do so, which transmitted for 58
        minutes before being crushed and melted at depths where pressures exceed 22 atmospheres.
        The orbiter spent eight years studying the Galilean moons in detail, finding strong
        evidence for subsurface oceans on Europa, Ganymede, and Callisto.
      </p>
    </MissionCard>

    <span id="date-juno" class="rail-anchor"></span>
    <MissionCard
      name="Juno"
      agency="NASA"
      dates="2016–present"
      summary="Polar orbiter mapping Jupiter's deep interior, magnetic field, and gravity field."
    >
      <p>
        Unlike previous missions, Juno is mapping Jupiter's deep interior, its magnetic field,
        gravity field, the layered weather beneath the cloud tops, and (still surprisingly) the
        question of whether Jupiter has a solid core at all. The picture emerging is of a "fuzzy"
        core: a diffuse blend of heavy elements mixed with hydrogen, rather than a clean rocky
        centre.
      </p>
    </MissionCard>

    <Figure
      src={jupiterJunoSouthpole}
      alt="Juno spacecraft view of Jupiter's south polar region, showing a cluster of giant cyclones swirling against a deep blue background."
      caption="Jupiter from below, Juno's view of the south pole, with a cluster of giant cyclones arrayed around it. No previous spacecraft had ever seen Jupiter from this angle."
      credit="NASA / JPL-Caltech / SwRI / MSSS"
    />
  </RevealChapter>

  <RevealChapter
    index={3}
    {reveal}
    {total}
    id="whats-next"
    title="What's next"
    eyebrow="Section 4"
  >
    <h3 class="sub">Hunting for life on icy moons</h3>

    <p>
      Two large missions are now en route to study Jupiter's icy moons, the most promising real
      estate for finding extraterrestrial life in our solar system.
    </p>

    <MissionCard
      name="JUICE"
      agency="ESA"
      dates="2023 launch; 2031 arrival"
      summary="Jupiter Icy Moons Explorer; will eventually orbit Ganymede."
    />

    <span id="date-clipper" class="rail-anchor"></span>
    <MissionCard
      name="Europa Clipper"
      agency="NASA"
      dates="2024 launch; 2030 arrival"
      summary="Dozens of close flybys of Europa to map its ice shell and analyse plume chemistry."
    >
      <p>
        Europa Clipper will make dozens of close flybys of Europa, mapping its ice shell and
        analysing the chemistry of any plumes erupting from the subsurface ocean. Neither mission
        can land, both will look for the conditions and chemistry that would justify a future
        mission that does.
      </p>
    </MissionCard>
  </RevealChapter>
</HistoryShell>
