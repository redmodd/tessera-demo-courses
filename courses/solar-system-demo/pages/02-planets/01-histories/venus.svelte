<script module>
  export const pageConfig = { title: "Venus" };
</script>

<script>
  import { getPlanet } from '../../../lib/planets.js';
  import {
    HistoryShell, RevealChapter, PullQuote, Factoid, Figure, FigureCard, MissionCard, DeepDive,
    NameTile,
  } from '../../../lib/history/index.js';
  import { useChapterReveal } from '../../../lib/history/useChapterReveal.svelte.js';
  import venusGlobe from '$assets/venus/venus-globe.jpg';
  import venusVenera13 from '$assets/venus/venus-venera13.jpg';

  const planet = getPlanet('venus');

  const chapters = [
    { id: 'ancient', title: 'Ancient' },
    { id: 'telescope', title: 'Telescope' },
    { id: 'space-age', title: 'Space age' },
    { id: 'whats-next', title: "What's next" },
  ];

  const keyDates = [
    { year: '~1600 BCE', event: 'Venus Tablet of Ammisaduqa', anchor: 'date-tablet', chapterIndex: 0 },
    { year: '1100 CE', event: 'Maya Dresden Codex Venus tables', anchor: 'date-dresden', chapterIndex: 0 },
    { year: '1610', event: "Galileo observes Venus's phases", anchor: 'date-galileo', chapterIndex: 1 },
    { year: '1761', event: 'Lomonosov spots an atmosphere during transit', anchor: 'date-lomonosov', chapterIndex: 1 },
    { year: '1962', event: 'Mariner 2 confirms hellish surface temperatures', anchor: 'date-mariner2', chapterIndex: 2 },
    { year: '1970', event: 'Venera 7, first soft landing on another planet', anchor: 'date-venera7', chapterIndex: 2 },
    { year: '1990–94', event: 'Magellan radar-maps 98% of the surface', anchor: 'date-magellan', chapterIndex: 2 },
    { year: 'Late 2020s', event: 'DAVINCI, VERITAS, EnVision', anchor: 'date-future', chapterIndex: 3 },
  ];

  const nameTiles = [
    { word: 'Ishtar', language: 'Babylonian', meaning: 'goddess of love and war' },
    { word: 'Kukulkan', language: 'Maya', meaning: 'feathered serpent, return as morning star' },
    { word: 'Hesperus / Phosphorus', language: 'Greek', meaning: '"evening" + "light-bringing", once thought two stars' },
    { word: 'Venus', language: 'Roman', meaning: 'goddess of love and beauty' },
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
    nextHint="Section 2: Galileo's phases break the geocentric model"
  >
    <h3 class="sub">The brightest world</h3>

    <div class="drop-cap">
      <p>
        Venus is the brightest object in our sky after the Sun and Moon, bright enough to cast
        shadows on a dark night, bright enough to have occasionally caused panicked calls to police
        about UFOs.
      </p>
    </div>

    <p>
      It has been a focus of human attention for as long as we have had written records, and
      probably for tens of thousands of years before.
    </p>

    <h3 class="sub">Babylonian and Maya astronomers</h3>

    <p id="date-tablet">
      The earliest detailed records come from the Babylonians. The
      <strong>Venus Tablet of Ammisaduqa</strong>, dating from around 1600 BCE, tracks the planet's
      appearances over 21 years so precisely that modern astronomers use it to anchor the chronology
      of the ancient Near East.
    </p>

    <p>
      The Babylonians called Venus <em>Ishtar</em>, goddess of love and war, already setting up
      the contradictions that would follow the planet across cultures.
    </p>

    <p id="date-dresden">
      The Maya were arguably the most attentive of all ancient Venus-watchers. Their
      <strong>Dresden Codex</strong>, written around 1100 CE but copying older material, contains
      tables predicting Venus's appearances for centuries in advance. They timed warfare and royal
      ceremonies to its first appearance as the morning star, <em>Kukulkan</em>, the feathered
      serpent, returning from the underworld.
    </p>

    <h3 class="sub">Two stars, one planet</h3>

    <PullQuote>
      Many cultures saw Venus as two objects: a brilliant evening star and a separate brilliant
      morning star.
    </PullQuote>

    <div class="name-grid">
      {#each nameTiles as t}
        <NameTile word={t.word} language={t.language} meaning={t.meaning} />
      {/each}
    </div>

    <p>
      Pythagoras (or perhaps Parmenides) is usually credited with realising the two Greek "stars"
      were the same body, though Babylonian astronomers knew it well before.
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
    nextHint="Section 3: the romantic Venus dies on contact"
  >
    <h3 class="sub">The phases of Venus</h3>

    <div class="drop-cap">
      <p id="date-galileo">
        Galileo's first telescopic observations of Venus, in late 1610, produced one of the
        decisive moments in the history of science.
      </p>
    </div>

    <p>
      He saw that Venus showed phases like the Moon, full when on the far side of the Sun,
      crescent when between Earth and the Sun. The phases were impossible to explain if Venus
      orbited Earth, but obvious if Venus orbited the Sun.
    </p>

    <p>
      It was a death blow to the geocentric model. Galileo, suspecting trouble with the Church,
      first announced the discovery in an anagram.
    </p>

    <FigureCard
      name="Galileo Galilei"
      dates="1564–1642"
      role="Italian astronomer; first to telescopically observe planetary phases"
    />

    <h3 class="sub">Transits and Halley's ladder</h3>

    <p>
      The transits of Venus across the Sun's face, events that occur in pairs, eight years apart,
      with gaps of more than a century between pairs, became a major focus of 18th-century
      astronomy.
    </p>

    <p>
      Edmond Halley pointed out that timing a transit from widely-separated points on Earth could
      yield the absolute scale of the solar system. International expeditions for the
      <strong>1761 and 1769 transits</strong> scattered astronomers from Tahiti to Siberia.
      <strong>Captain James Cook</strong>'s first Pacific voyage was, ostensibly, a transit-of-Venus
      mission.
    </p>

    <span id="date-lomonosov" class="rail-anchor"></span>
    <DeepDive
      title="Lomonosov and the atmosphere"
      teaser="In 1761 a Russian astronomer noticed a halo around Venus during transit, and made the right call."
    >
      <p>
        Russian polymath <strong>Mikhail Lomonosov</strong>, watching the 1761 transit from
        St. Petersburg, observed a thin halo of light around Venus's edge as the planet crossed
        the Sun's limb. He correctly interpreted it as the planet's atmosphere refracting sunlight.
      </p>
      <p>
        For the next two centuries, that atmosphere was thick enough to hide everything below it.
        Imaginative astronomers filled the gap with jungles, oceans, and dinosaurs. The reality,
        revealed only by spacecraft, turned out to be far stranger and considerably less hospitable.
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
    nextHint="Section 4: Venus's late-2020s comeback"
  >
    <h3 class="sub">The romantic Venus dies</h3>

    <div class="drop-cap">
      <p id="date-mariner2">
        The romantic Venus died fast in the 1960s. NASA's <strong>Mariner 2</strong> flew past in
        December 1962 and read surface temperatures far hotter than anyone had imagined.
      </p>
    </div>

    <p>
      Far too hot for liquid water, let alone life.
    </p>

    <Figure
      src={venusGlobe}
      alt="A natural-colour view of Venus showing its featureless yellow-white cloud deck."
      caption="Venus, draped in unbroken cloud. This is what every telescope sees, and what early astronomers had to imagine through."
      credit="NASA / JPL"
    />

    <Factoid value="465°C">
      Venus's surface temperature, hotter than Mercury's, despite Venus being twice as far from
      the Sun.
    </Factoid>

    <p>
      The heat is a runaway greenhouse. A dense carbon-dioxide atmosphere ninety times the
      pressure of Earth's at sea level traps almost every photon that reaches the surface, and
      the cloud deck above it is made of <strong>sulphuric acid</strong>, drops of acid that
      fall as rain but evaporate long before reaching the ground.
    </p>

    <Factoid value="243 vs 225 Earth days">
      Venus rotates so slowly that one Venusian day takes longer than its year, and it spins
      <em>backwards</em>, the only major planet to do so. The Sun rises in the west and sets
      in the east.
    </Factoid>

    <h3 class="sub">The Soviet Veneras</h3>

    <p id="date-venera7">
      The Soviet Union, with a much greater appetite for Venus, launched the <strong>Venera</strong>
      programme. After repeated failures (probes crushed before reaching the surface),
      <strong>Venera 7</strong> became the first spacecraft to soft-land on another planet in 1970,
      transmitting for 23 minutes before succumbing to the heat.
    </p>

    <MissionCard
      name="Venera 7–14"
      agency="USSR"
      dates="1970–82"
      summary="First soft landings on another planet; first surface photographs of Venus."
    >
      <p>
        <strong>Venera 9</strong> sent back the first photographs from the surface in 1975, a
        grainy, fish-eye view of jagged volcanic rocks under a dim orange sky. The later Veneras
        brought colour images, soil analysis, and recordings of Venusian thunder. Each lander
        survived only minutes to hours before being crushed and cooked.
      </p>
    </MissionCard>

    <Figure
      src={venusVenera13}
      alt="A panoramic colour view of the surface of Venus from Venera 13, showing flat plates of basaltic rock under a dim orange sky."
      caption="The surface of Venus, photographed by Venera 13 in 1982, one of the few colour images ever returned from another planet's surface."
      credit="USSR Academy of Sciences"
    />

    <h3 class="sub">Mapping through the clouds</h3>

    <span id="date-magellan" class="rail-anchor"></span>
    <MissionCard
      name="Magellan"
      agency="NASA"
      dates="1990–94"
      summary="Used radar to pierce the clouds and map 98% of the Venusian surface at high resolution."
    >
      <p>
        Magellan revealed a world reshaped by volcanism, with vast lava plains, pancake domes, and
        almost no impact craters, meaning Venus's surface is geologically young, perhaps only
        500 million years old. Something resurfaced the entire planet, and we still don't fully
        understand what.
      </p>
    </MissionCard>

    <MissionCard
      name="Venus Express / Akatsuki"
      agency="ESA / JAXA"
      dates="2006–14 / 2015–24"
      summary="Atmospheric mappers; tracked weather and hints of recent volcanic activity."
    >
      <p>
        ESA's Venus Express and Japan's Akatsuki continued atmospheric studies, mapping the
        planet's hellish weather and finding hints, still controversial, of recent volcanic
        activity. JAXA reported losing contact with Akatsuki in mid-2024.
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
    <h3 class="sub">A comeback in the works</h3>

    <p id="date-future">
      Venus is having a comeback. Three new missions are in development, all targeted for the late
      2020s and early 2030s.
    </p>

    <MissionCard
      name="DAVINCI"
      agency="NASA"
      dates="Late 2020s"
      summary="Atmospheric probe, descends through the clouds, sniffing the chemistry on the way down."
    />
    <MissionCard
      name="VERITAS"
      agency="NASA"
      dates="Early 2030s"
      summary="High-resolution radar mapper, set to chart Venus at unprecedented detail."
    />
    <MissionCard
      name="EnVision"
      agency="ESA"
      dates="Early 2030s"
      summary="Comprehensive Venus orbiter studying surface, atmosphere, and interior."
    />

    <h3 class="sub">Open questions</h3>

    <p>
      Was Venus once habitable, with oceans like Earth's? Is it volcanically active today? And
      what are those mysterious dark streaks in the cloud tops absorbing ultraviolet light?
    </p>
  </RevealChapter>
</HistoryShell>
