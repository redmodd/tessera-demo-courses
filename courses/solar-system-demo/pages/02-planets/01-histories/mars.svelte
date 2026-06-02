<script module>
  export const pageConfig = { title: "Mars" };
</script>

<script>
  import { getPlanet } from '../../../lib/planets.js';
  import {
    HistoryShell, RevealChapter, PullQuote, Factoid, Figure, FigureCard, MissionCard, DeepDive, Term,
    NameTile,
  } from '../../../lib/history/index.js';
  import { useChapterReveal } from '../../../lib/history/useChapterReveal.svelte.js';
  import marsTrueColor from '$assets/mars/mars-true-color.jpg';
  import marsPhobos from '$assets/mars/mars-phobos.jpg';
  import marsSchiaparelliMap from '$assets/mars/mars-schiaparelli-map.jpg';
  import marsVallesMarineris from '$assets/mars/mars-valles-marineris.jpg';
  import marsCuriositySelfie from '$assets/mars/mars-curiosity-selfie.jpg';

  const planet = getPlanet('mars');

  const chapters = [
    { id: 'ancient', title: 'Ancient' },
    { id: 'telescope', title: 'Telescope' },
    { id: 'space-age', title: 'Space age' },
    { id: 'whats-next', title: "What's next" },
  ];

  const keyDates = [
    { year: '2nd c. CE', event: "Ptolemy's epicycle model fits Mars's retrograde", anchor: 'date-ptolemy', chapterIndex: 0 },
    { year: '1609', event: 'Kepler, orbits are ellipses', anchor: 'date-kepler', chapterIndex: 1 },
    { year: '1666', event: "Cassini measures the Martian day at 24h 40m", anchor: 'date-cassini', chapterIndex: 1 },
    { year: '1877', event: 'Schiaparelli reports "canali"', anchor: 'date-canali', chapterIndex: 1 },
    { year: '1965', event: 'Mariner 4, first close-up images', anchor: 'date-mariner4', chapterIndex: 2 },
    { year: '1976', event: 'Vikings 1 & 2, first successful landers', anchor: 'date-viking', chapterIndex: 2 },
    { year: '2012', event: 'Curiosity rover lands in Gale Crater', anchor: 'date-curiosity', chapterIndex: 2 },
    { year: '2021', event: 'Ingenuity, first powered flight on another world', anchor: 'date-ingenuity', chapterIndex: 2 },
  ];

  const nameTiles = [
    { word: 'Her Desher', language: 'Egyptian', meaning: '"the red one"' },
    { word: 'Nergal', language: 'Babylonian', meaning: 'god of war and pestilence' },
    { word: 'Ares', language: 'Greek', meaning: 'god of battle' },
    { word: 'Mars', language: 'Roman', meaning: 'god of war' },
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
    nextHint="Section 2: Kepler's ellipses and a famous mistranslation"
  >
    <h3 class="sub">A planet of war and blood</h3>

    <div class="drop-cap">
      <p>
        Of all the wandering stars, Mars is the one that catches the eye for a different reason:
        its colour.
      </p>
    </div>

    <p>
      Even by naked eye it is unmistakably reddish, the surface dust is rich in
      <strong>iron oxide</strong>, the same chemistry as rust, and almost every ancient
      culture associated it with war, blood, or fire.
    </p>

    <div class="name-grid">
      {#each nameTiles as t}
        <NameTile word={t.word} language={t.language} meaning={t.meaning} />
      {/each}
    </div>

    <p>
      Even Mars's two small moons inherit the theme: <strong>Phobos</strong> and
      <strong>Deimos</strong> ("fear" and "dread") are named for the sons of Ares, fitting
      attendants for the planet of war.
    </p>

    <Figure
      src={marsTrueColor}
      alt="A true-colour photograph of Mars showing its rusty red surface and the bright cap of the south polar ice."
      caption="Mars in true colour, the rust comes from iron oxide in the surface dust."
      credit="ESA / DLR / FU Berlin (OSIRIS)"
    />

    <Figure
      src={marsPhobos}
      alt="A close-up colour image of Phobos, Mars's larger moon, a lumpy, irregularly-shaped grey body covered in craters and grooves, with the prominent Stickney crater on one side."
      caption="Phobos, the larger and closer of Mars's two moons, under 30 km across and irregular in shape, more like an asteroid than a planet's moon."
      credit="NASA / JPL / University of Arizona (HiRISE)"
    />

    <h3 class="sub">The retrograde puzzle</h3>

    <p id="date-ptolemy">
      What troubled ancient astronomers most about Mars was its motion. Most of the time it drifts
      steadily eastward against the background stars, but every two years or so it slows, stops,
      reverses direction for a few weeks, and then resumes its forward motion.
    </p>

    <p>
      This
      <Term definition="The apparent backward motion of a planet across the sky, caused by Earth overtaking it on a faster, inner orbit.">retrograde loop</Term>
      was one of the deepest puzzles of pre-modern astronomy.
    </p>

    <p>
      <strong>Ptolemy</strong> (2nd century CE) explained it by giving Mars an "epicycle", a
      smaller circle riding on a larger one, and his system was so good at predicting positions
      that it dominated astronomy for 1,400 years. The retrograde loops only made simple sense
      once Earth was understood to be a faster-moving inner planet, periodically overtaking Mars
      on the inside track.
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
    nextHint="Section 3: Mariner 4 ends the fiction"
  >
    <h3 class="sub">Tycho's data, Kepler's ellipses</h3>

    <div class="drop-cap">
      <p>
        The Mars revolution began before the telescope.
      </p>
    </div>

    <p>
      <strong>Tycho Brahe</strong>, in late-16th-century Denmark, built the most accurate
      naked-eye observatory in history and measured Mars's positions with unprecedented precision.
    </p>

    <FigureCard
      name="Johannes Kepler"
      dates="1571–1630"
      role="German astronomer; derived the three laws of planetary motion from Mars data"
    />

    <p id="date-kepler">
      After Tycho's death in 1601, his German assistant <strong>Johannes Kepler</strong> wrestled
      for years with the data. Mars stubbornly refused to fit perfect circles.
    </p>

    <p>
      In 1609, in his book <em>Astronomia Nova</em>, Kepler announced that Mars (and every other
      planet) traces an <strong>ellipse</strong> with the Sun at one focus.
    </p>

    <PullQuote>
      It was the first of his three laws of planetary motion, a foundation of physics ever
      since, and Mars made him work for it.
    </PullQuote>

    <h3 class="sub">Timing a Martian day</h3>

    <p id="date-cassini">
      Telescopes added detail slowly. In 1659 the Dutch astronomer <strong>Christiaan Huygens</strong>
      sketched a dark feature on Mars (now called <em>Syrtis Major</em>) and used its rotation to
      time the Martian day at about 24 hours.
    </p>

    <p>
      <strong>Giovanni Cassini</strong> measured it more precisely in 1666: 24h 40m, just three
      minutes off the modern value.
    </p>

    <Figure
      src={marsSchiaparelliMap}
      alt="An 1888 map of Mars by Giovanni Schiaparelli, drawn in detailed pen-and-ink, showing a network of straight lines labelled in Latin."
      caption="Schiaparelli's 1888 map of Mars, with its much-debated network of straight 'canali' criss-crossing the surface."
      credit="Giovanni Schiaparelli, 1888 (public domain)"
    />

    <span id="date-canali" class="rail-anchor"></span>
    <DeepDive
      title='The "canali" mistranslation'
      teaser="Channels became canals, and a century of Martian-civilisation speculation followed."
    >
      <p>
        The 19th century turned Mars-watching into a frenzy. Italian astronomer
        <strong>Giovanni Schiaparelli</strong>, observing during the unusually close Mars opposition
        of <strong>1877</strong>, reported a network of straight, narrow features on the surface.
        He called them <em>canali</em>, Italian for "channels," meaning natural waterways. The
        English translation rendered it as "canals," with all the implications of artificial
        construction.
      </p>
      <p>
        The wealthy American amateur <strong>Percival Lowell</strong> built an entire observatory
        in Arizona to study them, and produced bestselling books arguing that Mars was a dying
        world whose inhabitants had built planet-spanning irrigation works. The canals weren't
        real, they were optical illusions and wishful pattern-matching, but the idea of Martian
        civilisation lodged in the public imagination and never fully left, fuelling everything
        from H. G. Wells's <em>War of the Worlds</em> (1898) to a century of science fiction.
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
    nextHint="Section 4: bringing rocks back, and humans someday"
  >
    <h3 class="sub">Mariner 4 ends the fiction</h3>

    <div class="drop-cap">
      <p id="date-mariner4">
        The reality, when it came, was a shock.
      </p>
    </div>

    <p>
      NASA's <strong>Mariner 4</strong> flew past Mars in July 1965 and returned 22 grainy
      black-and-white photographs of a cratered, lunar-looking surface, apparently dead, with no
      canals, no oceans, and a thin atmosphere of mostly carbon dioxide. The Mars of fiction died
      on impact.
    </p>

    <Factoid value="22 km">
      The height of <strong>Olympus Mons</strong>, the tallest volcano in the solar system,
      roughly two and a half times the height of Mount Everest.
    </Factoid>

    <p>
      <strong>Mariner 9</strong> (1971) became the first spacecraft to orbit another planet. It
      arrived during a global dust storm and, when the dust settled, revealed a far more
      interesting world: giant volcanoes, the enormous canyon system <strong>Valles Marineris</strong>,
      dried river beds, and signs of past flowing water.
    </p>

    <Figure
      src={marsVallesMarineris}
      alt="A Viking-era mosaic showing Valles Marineris, a colossal canyon system stretching across a quarter of Mars's circumference."
      caption="Valles Marineris, over 4,000 km long, named for the spacecraft (Mariner 9) that first revealed it."
      credit="NASA / USGS"
    />

    <h3 class="sub">Vikings on the surface</h3>

    <span id="date-viking" class="rail-anchor"></span>
    <MissionCard
      name="Viking 1 & 2"
      agency="NASA"
      dates="1976"
      summary="First successful Mars landers; carried experiments to detect microbial life."
    >
      <p>
        Two landers operated successfully on the surface, equipped with chemistry experiments
        designed to detect microbial life. The results were ambiguous and disputed; the consensus
        settled on "no clear evidence of life," though some scientists still argue with the
        original conclusion.
      </p>
    </MissionCard>

    <h3 class="sub">The age of rovers</h3>

    <MissionCard
      name="Spirit & Opportunity"
      agency="NASA"
      dates="2004–2010 / 2004–2018"
      summary="Twin rovers; both far outlasted their 90-day designs. Opportunity drove for 14 years."
    >
      <p>
        The twin Mars Exploration Rovers landed three weeks apart in January 2004, each with a
        planned mission of 90 Martian days. Both kept going for years. <strong>Spirit</strong>
        explored Gusev Crater until it became stuck in soft soil in 2009 and finally fell silent
        in 2010. <strong>Opportunity</strong>, working in Meridiani Planum, eventually drove
        more than 45 km, the longest distance any vehicle has covered on another world.
      </p>
      <p>
        Opportunity's mission ended in June 2018 when a planet-wide dust storm blacked out its
        solar panels. Its final transmission, paraphrased into a now-famous line, was reported
        as: "My battery is low and it's getting dark."
      </p>
    </MissionCard>

    <span id="date-curiosity" class="rail-anchor"></span>
    <MissionCard
      name="Curiosity"
      agency="NASA"
      dates="2012–present"
      summary="Nuclear-powered rover; still climbing Mount Sharp inside Gale Crater."
    >
      <p>
        Curiosity has confirmed that ancient Mars had liquid water, the right chemistry for life,
        and the conditions that could have sustained microbial organisms, though no evidence yet
        that any actually existed.
      </p>
    </MissionCard>

    <Figure
      src={marsCuriositySelfie}
      alt="A self-portrait of NASA's Curiosity rover stitched from many close-up images, showing the rover's instrument-laden deck against the rusty Martian terrain at the base of Mount Sharp."
      caption="Curiosity's self-portrait at the 'Big Sky' drilling site, October 2015, assembled from dozens of frames taken by the rover's robotic arm."
      credit="NASA / JPL-Caltech / MSSS"
    />

    <span id="date-ingenuity" class="rail-anchor"></span>
    <MissionCard
      name="Perseverance + Ingenuity"
      agency="NASA"
      dates="2021–present"
      summary="Sample-collecting rover; carried the first aircraft to fly on another world."
    >
      <p>
        Perseverance is collecting rock samples in Jezero Crater for a future return mission, and
        brought along <strong>Ingenuity</strong>, a small helicopter that became the first vehicle
        to fly under power on another world. Ingenuity made 72 flights before damaging a rotor
        blade in January 2024.
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
    <h3 class="sub">Bringing rocks back</h3>

    <p>
      The <strong>Mars Sample Return</strong> mission, a joint NASA/ESA effort to bring
      Perseverance's collected samples back to Earth, is the most ambitious robotic mission ever
      attempted, and is currently being redesigned for cost.
    </p>

    <p>
      China plans its own sample-return mission, <strong>Tianwen-3</strong>, around the end of
      this decade.
    </p>

    <h3 class="sub">Humans on Mars?</h3>

    <p>
      Crewed missions are seriously discussed for the 2030s and 2040s, with NASA, SpaceX, and
      others developing the necessary heavy-lift hardware.
    </p>

    <p>
      Big open questions: did Mars ever host life? Does it still, deep underground? And what
      happened to the thick early atmosphere that allowed liquid water to flow on the surface
      billions of years ago?
    </p>
  </RevealChapter>
</HistoryShell>
