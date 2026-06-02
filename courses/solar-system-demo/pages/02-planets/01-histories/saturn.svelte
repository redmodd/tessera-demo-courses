<script module>
  export const pageConfig = { title: "Saturn" };
</script>

<script>
  import { getPlanet } from '../../../lib/planets.js';
  import {
    HistoryShell, RevealChapter, PullQuote, Factoid, Figure, FigureCard, MissionCard, DeepDive,
    NameTile,
  } from '../../../lib/history/index.js';
  import { useChapterReveal } from '../../../lib/history/useChapterReveal.svelte.js';
  import saturnEquinox from '$assets/saturn/saturn-equinox.jpg';
  import saturnTitan from '$assets/saturn/saturn-titan.jpg';
  import saturnEnceladusPlumes from '$assets/saturn/saturn-enceladus-plumes.jpg';

  const planet = getPlanet('saturn');

  const chapters = [
    { id: 'ancient', title: 'Ancient' },
    { id: 'telescope', title: 'Telescope' },
    { id: 'space-age', title: 'Space age' },
    { id: 'whats-next', title: "What's next" },
  ];

  const keyDates = [
    { year: '1610', event: "Galileo: \"Saturn appears tripled\"", anchor: 'date-galileo', chapterIndex: 1 },
    { year: '1655', event: "Huygens resolves the rings; discovers Titan", anchor: 'date-huygens', chapterIndex: 1 },
    { year: '1675', event: 'Cassini Division between the rings', anchor: 'date-cassini', chapterIndex: 1 },
    { year: '1859', event: 'Maxwell proves rings are particles, not solid', anchor: 'date-maxwell', chapterIndex: 1 },
    { year: '1979–81', event: 'Pioneer 11 and Voyagers visit', anchor: 'date-voyagers', chapterIndex: 2 },
    { year: '2004–17', event: 'Cassini–Huygens explores the system', anchor: 'date-cassini-mission', chapterIndex: 2 },
    { year: '2005', event: 'Huygens probe lands on Titan', anchor: 'date-titan-landing', chapterIndex: 2 },
    { year: '2034', event: 'Dragonfly arrives at Titan', anchor: 'date-dragonfly', chapterIndex: 3 },
  ];

  const nameTiles = [
    { word: 'Lubadsagush', language: 'Babylonian', meaning: '"the oldest of the old"' },
    { word: 'Kronos', language: 'Greek', meaning: 'Titan father of Zeus, devourer of his children' },
    { word: 'Saturn', language: 'Roman', meaning: 'god of agriculture, time, the golden age' },
    { word: 'Shani', language: 'Sanskrit', meaning: 'sombre taskmaster of fortune' },
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
    nextHint="Section 2: a 45-year puzzle Galileo couldn't crack"
  >
    <h3 class="sub">The edge of the known cosmos</h3>

    <div class="drop-cap">
      <p>
        Saturn is the most distant of the planets visible to the naked eye, and for most of history
        it marked the edge of the known cosmos.
      </p>
    </div>

    <p>
      To the unaided eye it is unmistakable, a steady, golden-yellow point that drifts slowly
      through the zodiac, taking 29 years to complete a single circuit.
    </p>

    <h3 class="sub">A planet of time</h3>

    <PullQuote>
      Saturn's slow, ponderous motion across the sky helped cement the association: this was the
      planet of long cycles, of seasons, of inheritance and decay.
    </PullQuote>

    <div class="name-grid">
      {#each nameTiles as t}
        <NameTile word={t.word} language={t.language} meaning={t.meaning} />
      {/each}
    </div>

    <p>
      The midwinter festival of <em>Saturnalia</em>, which inverted social order and gave gifts,
      eventually fed into Christmas. Across cultures, Saturn was rarely a friendly god.
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
    nextHint="Section 3: Cassini's thirteen years in the system"
  >
    <h3 class="sub">A puzzle Galileo couldn't crack</h3>

    <div class="drop-cap">
      <p id="date-galileo">
        <strong>Galileo Galilei</strong> turned his telescope on Saturn in July 1610 and saw
        something he could not explain.
      </p>
    </div>

    <p>
      The planet wasn't a clean disc but seemed to have two strange protrusions, "I have observed
      the highest planet to be tripled," he wrote in a famous anagram. He thought Saturn had ears,
      or two companion bodies.
    </p>

    <PullQuote attribution="Galileo, 1612">
      Has Saturn devoured his children?
    </PullQuote>

    <p>
      The strangest thing was that two years later the protrusions had vanished, and the planet
      looked round again. The "disappearances" were the moments when the rings turned edge-on to
      Earth, becoming nearly invisible, but Galileo's telescope couldn't resolve what they
      actually were.
    </p>

    <span id="date-huygens" class="rail-anchor"></span>
    <DeepDive
      title="The puzzle waits 45 years"
      teaser="From Galileo's anagram to Huygens's elegant reveal."
    >
      <p>
        In <strong>1655</strong>, the Dutch astronomer <strong>Christiaan Huygens</strong>, using
        a long refractor he had ground himself, finally resolved the truth: Saturn was surrounded
        by <em>"a thin, flat ring, nowhere touching, and inclined to the ecliptic."</em>
      </p>
      <p>
        The same year, Huygens discovered <strong>Titan</strong>, Saturn's largest moon, the first
        new moon found around any planet since Galileo's discovery of the Galilean moons. Huygens,
        like Galileo, first announced the ring discovery in an anagram, eventually published as
        the line above.
      </p>
    </DeepDive>

    <FigureCard
      name="Christiaan Huygens"
      dates="1629–1695"
      role="Dutch astronomer; resolved Saturn's rings and discovered Titan"
    />

    <h3 class="sub">Cassini's gap</h3>

    <p id="date-cassini">
      In 1675 the Italian-French astronomer <strong>Giovanni Cassini</strong> (then director of
      the Paris Observatory) discovered the dark gap between the two main rings, now called the
      <strong>Cassini Division</strong>. Over the next decade he found four more Saturnian moons:
      Iapetus, Rhea, Tethys, and Dione.
    </p>

    <h3 class="sub">Maxwell does the math</h3>

    <p id="date-maxwell">
      In 1859 the Scottish physicist <strong>James Clerk Maxwell</strong> proved mathematically
      that the rings could not be solid, they would tear themselves apart, and must instead be
      made of countless small particles. Spectroscopy in the 1890s confirmed it: the rings are
      almost entirely <strong>water ice</strong> (with a small fraction of rocky dust),
      ranging from sand-grain-sized motes to chunks the size of houses, all orbiting in a band
      only tens of metres thick.
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
    nextHint="Section 4: Dragonfly: a drone for Titan"
  >
    <h3 class="sub">First flybys</h3>

    <div class="drop-cap">
      <p id="date-voyagers">
        Saturn was visited briefly by <strong>Pioneer 11</strong> in September 1979 and then more
        thoroughly by <strong>Voyager 1</strong> (November 1980) and <strong>Voyager 2</strong>
        (August 1981).
      </p>
    </div>

    <p>
      Together they discovered new rings, new moons, and the first hint of complex organic
      chemistry on Titan.
    </p>

    <p>But the great Saturnian mission was still to come.</p>

    <h3 class="sub">Cassini's thirteen years</h3>

    <Figure
      src={saturnEquinox}
      alt="A Cassini portrait of Saturn at equinox, the rings casting a thin shadow across the planet's bands."
      caption="Saturn at equinox, a Cassini mosaic taken in 2009, the rare moment when the rings catch the Sun edge-on."
      credit="NASA / JPL / Space Science Institute"
    />

    <span id="date-cassini-mission" class="rail-anchor"></span>
    <MissionCard
      name="Cassini–Huygens"
      agency="NASA / ESA / ASI"
      dates="1997 launch; 2004–17 in the system"
      summary="One of the most successful planetary missions ever flown, 13 years of looping through the Saturn system."
    >
      <p>
        For thirteen years Cassini looped through the Saturn system, performing dozens of flybys
        of Titan, Enceladus, and the smaller moons. Its highlights are too many to list, but the
        most striking are below.
      </p>
    </MissionCard>

    <span id="date-titan-landing" class="rail-anchor"></span>
    <MissionCard
      name="Huygens probe"
      agency="ESA"
      dates="January 2005"
      summary="First soft landing on a moon other than our own, descended through Titan's orange atmosphere."
    >
      <p>
        The European-built Huygens probe detached from Cassini, descended through Titan's thick
        orange atmosphere, and made the first soft landing on a moon other than our own. Its
        photographs showed pebble-strewn ground that looked uncannily like a desert riverbed,
        except the "rocks" were water ice and the rivers, when they flow, run with liquid methane.
      </p>
    </MissionCard>

    <Figure
      src={saturnTitan}
      alt="A true-colour view of Titan from Cassini, showing the moon shrouded in a featureless orange haze."
      caption="Titan, photographed in true colour by Cassini, the only moon in the solar system with a substantial atmosphere."
      credit="NASA / JPL / Space Science Institute"
    />

    <Factoid value="270+ moons">
      Saturn's confirmed moon count, including 128 newly-recognised moons added in 2025, reclaiming
      the title of "moon king" from Jupiter.
    </Factoid>

    <h3 class="sub">Plumes from Enceladus</h3>

    <p>
      In 2005, Cassini discovered enormous geyser-like plumes erupting from the south pole of
      <strong>Enceladus</strong>, a small icy moon.
    </p>

    <p>
      The plumes are jets of water from a global subsurface ocean, salty and chemically rich
      enough that Enceladus is now considered one of the most promising places to look for life
      beyond Earth.
    </p>

    <Figure
      src={saturnEnceladusPlumes}
      alt="A backlit Cassini view of Enceladus showing the bright crescent of the moon with multiple jets of water-ice geysers streaming from its south pole into space."
      caption="Backlit by the Sun, Enceladus reveals the plumes that gave it away, jets of water from a hidden ocean, photographed by Cassini."
      credit="NASA / JPL / Space Science Institute"
    />

    <h3 class="sub">The Grand Finale</h3>

    <p>
      The mission ended on 15 September 2017 with the <strong>Grand Finale</strong>: a deliberate,
      planned plunge into Saturn's atmosphere.
    </p>

    <p>
      Cassini was running low on fuel, and mission planners chose destruction over the risk of an
      uncontrolled future crash that could contaminate the potentially habitable moons. Cassini
      transmitted data on the way down until the moment it broke up.
    </p>
  </RevealChapter>

  <RevealChapter
    index={3}
    {reveal}
    {total}
    id="whats-next"
    title="What's next"
    eyebrow="Section 4"
  >
    <h3 class="sub">A drone for Titan</h3>

    <p>
      There is no Saturn mission currently flying or formally approved, but a remarkable one is in
      development.
    </p>

    <span id="date-dragonfly" class="rail-anchor"></span>
    <MissionCard
      name="Dragonfly"
      agency="NASA"
      dates="2028 launch; mid-2030s arrival"
      summary="A nuclear-powered, octocopter drone designed to fly across Titan's surface, hopping between sites."
    >
      <p>
        Dragonfly will sample the prebiotic chemistry that may resemble the conditions in which
        life on Earth began. Long-term proposals also include dedicated Enceladus orbiters and even
        sample-return missions from its plumes, direct chemical hunts for life.
      </p>
    </MissionCard>
  </RevealChapter>
</HistoryShell>
