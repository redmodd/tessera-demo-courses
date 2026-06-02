<script module>
  export const pageConfig = { title: "Mercury" };
</script>

<script>
  import { getPlanet } from '../../../lib/planets.js';
  import {
    HistoryShell, RevealChapter, PullQuote, Factoid, Figure, FigureCard, MissionCard, DeepDive, Term,
    NameTile,
  } from '../../../lib/history/index.js';
  import { useChapterReveal } from '../../../lib/history/useChapterReveal.svelte.js';
  import mercuryMessenger from '$assets/mercury/mercury-messenger.jpg';

  const planet = getPlanet('mercury');

  const chapters = [
    { id: 'ancient', title: 'Ancient' },
    { id: 'telescope', title: 'Telescope' },
    { id: 'space-age', title: 'Space age' },
    { id: 'whats-next', title: "What's next" },
  ];

  const keyDates = [
    { year: '~1000 BCE', event: 'Babylonian MUL.APIN tablets', anchor: 'date-babylonian', chapterIndex: 0 },
    { year: '1610', event: 'Galileo turns his telescope on Mercury', anchor: 'date-galileo', chapterIndex: 1 },
    { year: '1631', event: 'Gassendi observes a transit of Mercury', anchor: 'date-gassendi', chapterIndex: 1 },
    { year: '1880s', event: 'Schiaparelli claims Mercury is tidally locked', anchor: 'date-schiaparelli', chapterIndex: 1 },
    { year: '1915', event: 'Einstein explains the perihelion drift', anchor: 'date-einstein', chapterIndex: 1 },
    { year: '1965', event: 'Radar reveals 3:2 spin-orbit resonance', anchor: 'date-radar', chapterIndex: 2 },
    { year: '1974–75', event: 'Mariner 10, first flybys', anchor: 'date-mariner', chapterIndex: 2 },
    { year: '2011–15', event: 'MESSENGER orbits and maps Mercury', anchor: 'date-messenger', chapterIndex: 2 },
    { year: '2026', event: 'BepiColombo arrives in orbit', anchor: 'date-bepi', chapterIndex: 3 },
  ];

  const nameTiles = [
    { word: 'Nabu', language: 'Babylonian', meaning: 'god of writing and wisdom' },
    { word: 'Sebeg', language: 'Egyptian', meaning: 'associated with Set or Thoth' },
    { word: 'Chen Xing', language: 'Chinese', meaning: '"hour star", element of water' },
    { word: 'Hermes / Mercury', language: 'Greek / Roman', meaning: 'swift-footed messenger of the gods' },
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
    nextHint="Section 2: three centuries of getting Mercury wrong"
  >
    <div class="drop-cap">
      <p>
        Mercury is one of the five "wandering stars" visible to the naked eye, and its story
        begins long before written history. Because it never strays far from the Sun, it is
        only ever seen low in the sky just after sunset or just before sunrise, a fleeting,
        twilight planet that demands a clear horizon and a sharp eye.
      </p>
    </div>

    <h3 class="sub">A planet of many names</h3>

    <p id="date-babylonian">
      The earliest surviving records are Babylonian. The MUL.APIN tablets, copied around 1000 BCE
      from older sources, track Mercury so precisely that the Babylonians could predict when it
      would reappear. Across cultures, the planet picked up names that fit its character:
    </p>

    <div class="name-grid">
      {#each nameTiles as t}
        <NameTile word={t.word} language={t.language} meaning={t.meaning} />
      {/each}
    </div>

    <h3 class="sub">One planet, two names</h3>

    <PullQuote>
      The Greeks treated the morning and evening apparitions as two different objects, Apollo
      before sunrise, Hermes after sunset.
    </PullQuote>

    <p>
      Greek astronomers eventually realised the two were the same body. The Romans inherited
      Hermes as Mercury, perfectly suited to a planet that races across the sky faster than
      any other.
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
    nextHint="Section 3: radar finds a different Mercury"
  >
    <h3 class="sub">Galileo's disappointment</h3>

    <div class="drop-cap">
      <p id="date-galileo">
        Galileo turned his telescope on Mercury in 1610 but found it disappointing; the planet's
        small disc and proximity to the Sun made details impossible to resolve.
      </p>
    </div>

    <p>
      He never observed its phases, though Venus's phases gave him the same Sun-orbiting evidence
      he needed.
    </p>

    <h3 class="sub">The first predicted transit</h3>

    <p id="date-gassendi">
      The first real Mercury milestone came in 1631, when French astronomer
      <strong>Pierre Gassendi</strong> watched the planet transit the face of the Sun, predicted
      to the day by Johannes Kepler. It was the first transit of any planet ever observed.
    </p>

    <FigureCard
      name="Pierre Gassendi"
      dates="1592–1655"
      role="French priest, astronomer; observed the first predicted transit"
    />

    <h3 class="sub">A century of getting it wrong</h3>

    <p id="date-schiaparelli">
      For the next three centuries, astronomers tried hard and got most of it wrong. Surface
      markings were too faint to pin down, leading <strong>Giovanni Schiaparelli</strong> in the
      1880s, and many others after him, to conclude Mercury was tidally locked to the Sun.
    </p>

    <p>
      One face would be perpetually scorched, the other in eternal night. The "fact" was repeated
      in textbooks well into the 1960s.
    </p>

    <h3 class="sub">An unexplained orbit</h3>

    <p>
      Mercury also gave 19th-century physics one of its great puzzles. Its orbit didn't quite
      match Newtonian predictions: the
      <Term definition="The point in an orbit closest to the Sun.">perihelion</Term>
      drifted forward by an unexplained 43 arcseconds per century.
    </p>

    <p>
      Astronomers proposed an unseen planet, <strong>Vulcan</strong>, hiding even closer to the
      Sun. They never found it, because there isn't one.
    </p>

    <span id="date-einstein" class="rail-anchor"></span>
    <DeepDive
      title="The Vulcan / Einstein puzzle"
      teaser="A planet that wasn't there, and the relativity result that explained why."
    >
      <p>
        Throughout the 19th century the orbit of Mercury refused to behave. Its perihelion crept
        forward each century by 43 arcseconds more than Newton's theory predicted. The most popular
        explanation was a hidden planet, <strong>Vulcan</strong>, tucked inside Mercury's orbit and
        nudging it gravitationally. Astronomers reported "sightings" of Vulcan into the 1870s.
      </p>
      <p>
        In 1915 Albert Einstein published the field equations of general relativity. Among his
        first checks was Mercury: the Sun's gravity warps space-time enough to advance the perihelion
        by, to four-figure precision, exactly 43 arcseconds per century. The "missing planet"
        had never existed; Newton's theory simply needed a deeper replacement.
      </p>
    </DeepDive>
  </RevealChapter>

  <RevealChapter
    index={2}
    {reveal}
    {total}
    id="space-age"
    title="The space age"
    eyebrow="Section 3"
    nextLabel="What's next"
    nextHint="Section 4: BepiColombo's long-delayed arrival"
  >
    <h3 class="sub">Radar reveals the spin</h3>

    <div class="drop-cap">
      <p id="date-radar">
        The tidally-locked picture fell next. In 1965, radio astronomers
        <strong>Gordon Pettengill</strong> and <strong>Rolf Dyce</strong> bounced radar off Mercury
        from Arecibo and discovered it actually rotates three times for every two orbits, a 3:2
        spin-orbit resonance.
      </p>
    </div>

    <Factoid value="176 days">
      A solar day on Mercury, sunrise to sunrise, takes twice as long as the planet's
      88-day year.
    </Factoid>

    <p>
      That long day plays out on a world without weather. Mercury has no atmosphere worth
      speaking of, and no moons; it and Venus are the only planets with none. The sunlit
      surface heats to about <strong>430°C</strong>; in the shadow of a crater wall it plunges
      to about <strong>−180°C</strong>, a swing of more than 600 degrees between light and dark.
    </p>

    <h3 class="sub">Visits, few but transformative</h3>

    <p id="date-mariner">
      NASA's spacecraft visits to Mercury are few, far between, and almost all transformative.
    </p>

    <MissionCard
      name="Mariner 10"
      agency="NASA"
      dates="1974–75"
      summary="First spacecraft to visit Mercury; mapped 45% of the surface in three flybys."
    >
      <p>
        Mariner 10 used Venus's gravity to slingshot toward Mercury, the first interplanetary
        gravity assist in history, and made three flybys between March 1974 and March 1975. It
        revealed a heavily cratered, Moon-like world and detected the surprise of a faint but real
        magnetic field generated by a partly molten iron core.
      </p>
    </MissionCard>

    <Figure
      src={mercuryMessenger}
      alt="Enhanced-colour mosaic of Mercury assembled from MESSENGER images, showing the planet's heavily cratered surface in subtle hues."
      caption="Mercury in enhanced colour, mapped from orbit by MESSENGER between 2011 and 2015."
      credit="NASA / Johns Hopkins APL / Carnegie Institution"
    />

    <span id="date-messenger" class="rail-anchor"></span>
    <MissionCard
      name="MESSENGER"
      agency="NASA"
      dates="2008–09 flybys; 2011–15 in orbit"
      summary="First Mercury orbiter; mapped the entire planet and confirmed water ice in polar craters."
    >
      <p>
        Mercury Surface, Space Environment, Geochemistry, and Ranging took six gravity-assist flybys
        of Earth, Venus, and Mercury before settling into orbit in 2011. Over four years it mapped
        the entire planet, found that
        the polar craters really do contain water ice in their permanently shadowed floors, and
        revealed mysterious "hollows", shallow, irregular pits that may be where surface material
        is sublimating directly into space. MESSENGER ended in 2015 with a planned crash into the
        surface.
      </p>
    </MissionCard>
  </RevealChapter>

  <RevealChapter
    index={3}
    {reveal}
    {total}
    id="whats-next"
    title="What's next"
    eyebrow="Section 4"
  >
    <h3 class="sub">A long-delayed return</h3>

    <p id="date-bepi">
      The joint ESA/JAXA <strong>BepiColombo</strong> mission launched in 2018 and is scheduled to
      enter Mercury orbit in <strong>November 2026</strong>, late by several years, after problems
      with its solar-electric thrusters.
    </p>

    <p>
      Once in orbit, two separate spacecraft (Europe's main orbiter and Japan's magnetospheric
      orbiter) will study the planet from complementary altitudes.
    </p>

    <MissionCard
      name="BepiColombo"
      agency="ESA / JAXA"
      dates="2018 launch; 2026 orbit"
      summary="Two-spacecraft mission to study Mercury's interior, surface, and magnetosphere."
    >
      <p>
        The mission carries Europe's <strong>MPO</strong> (Mercury Planetary Orbiter) and Japan's
        <strong>Mio</strong> (Mercury Magnetospheric Orbiter), which separate after arrival to
        study the planet at different altitudes. Big open questions on the table: why is Mercury
        so dense, with an iron core proportionally bigger than Earth's? Where did its volatiles
        come from? And what exactly is going on in those hollows?
      </p>
    </MissionCard>
  </RevealChapter>
</HistoryShell>
