<script module>
  export const pageConfig = { title: "Uranus" };
</script>

<script>
  import { getPlanet } from '../../../lib/planets.js';
  import {
    HistoryShell, RevealChapter, PullQuote, Factoid, Figure, FigureCard, MissionCard, DeepDive,
  } from '../../../lib/history/index.js';
  import { useChapterReveal } from '../../../lib/history/useChapterReveal.svelte.js';
  import uranusVoyager from '$assets/uranus/uranus-voyager.jpg';

  const planet = getPlanet('uranus');

  const chapters = [
    { id: 'ancient', title: 'Ancient' },
    { id: 'telescope', title: 'Telescope' },
    { id: 'space-age', title: 'Space age' },
    { id: 'whats-next', title: "What's next" },
  ];

  const keyDates = [
    { year: '1690', event: 'Flamsteed records "34 Tauri", actually Uranus', anchor: 'date-flamsteed', chapterIndex: 0 },
    { year: '13 Mar 1781', event: 'Herschel discovers Uranus from Bath', anchor: 'date-herschel', chapterIndex: 1 },
    { year: '1787', event: 'Herschel finds Titania and Oberon', anchor: 'date-moons', chapterIndex: 1 },
    { year: '1846', event: 'Uranus\'s orbital wobble leads to Neptune', anchor: 'date-neptune', chapterIndex: 1 },
    { year: '1977', event: "Uranus's rings discovered by occultation", anchor: 'date-rings', chapterIndex: 1 },
    { year: '24 Jan 1986', event: 'Voyager 2 flyby, only spacecraft visit', anchor: 'date-voyager', chapterIndex: 2 },
    { year: '2030s', event: 'Proposed Uranus Orbiter and Probe', anchor: 'date-future', chapterIndex: 3 },
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
    title="Hiding in plain sight"
    eyebrow="Section 1"
    nextLabel="The telescope era"
    nextHint="Section 2: a musician in Bath finds a planet"
  >
    <h3 class="sub">At the edge of perception</h3>

    <div class="drop-cap">
      <p>
        Uranus is just barely visible to the naked eye on a dark, clear night, sitting at the very
        edge of human perception.
      </p>
    </div>

    <p>
      As a result, its discovery story is unique among planets: nobody noticed it for thousands
      of years.
    </p>

    <PullQuote>
      Pre-telescopic astronomers across every culture catalogued every star they could see. Many
      inadvertently catalogued Uranus, but always as a faint, fixed star, never as something that
      moved.
    </PullQuote>

    <h3 class="sub">Catalogued as a star, repeatedly</h3>

    <p id="date-flamsteed">
      The earliest definite observation now known is from December 1690, when the English Astronomer
      Royal <strong>John Flamsteed</strong> recorded it in his catalogue as the star
      <strong>34 Tauri</strong>.
    </p>

    <p>
      Over the following century other astronomers logged it at least twenty more times under
      various star numbers. The French astronomer <strong>Pierre Lemonnier</strong> observed it
      on twelve separate occasions between 1750 and 1771, and somehow never noticed that "his"
      star kept shifting position.
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
    nextHint="Section 3: a single flyby, ever"
  >
    <h3 class="sub">An outsider in Bath</h3>

    <div class="drop-cap">
      <p id="date-herschel">
        The discovery, when it came, was made by an outsider.
      </p>
    </div>

    <p>
      <strong>William Herschel</strong> was a Hanover-born musician working as an organist in
      Bath, England, who had taught himself astronomy in his spare time and built his own
      remarkably good reflecting telescopes.
    </p>

    <p>
      On the night of <strong>13 March 1781</strong>, while systematically sweeping the sky from
      his back garden, he noticed an object near the constellation Gemini that did not look quite
      like a star. It showed a small but definite disc.
    </p>

    <FigureCard
      name="William Herschel"
      dates="1738–1822"
      role="Hanover-born musician turned astronomer; discovered Uranus from his Bath garden"
    />

    <h3 class="sub">A planet, not a comet</h3>

    <p>
      Herschel initially thought he had found a comet and announced it as such. But other
      astronomers soon calculated that its orbit was nearly circular and lay far beyond Saturn's.
    </p>

    <p>
      Herschel had discovered a planet, the first ever found by anyone, in any culture, since
      prehistory. The known solar system doubled in size overnight.
    </p>

    <DeepDive
      title='The "Georgium Sidus" naming dispute'
      teaser="Herschel wanted to name his planet after King George III. The continent had other ideas."
    >
      <p>
        Herschel proposed naming the new planet <em>Georgium Sidus</em>, "George's Star", after
        his patron, King George III. Continental astronomers, predictably, were unenthusiastic.
        The German astronomer <strong>Johann Bode</strong> suggested <strong>Uranus</strong>, the
        Greek primordial god of the sky, father of Cronus (Saturn) and grandfather of Zeus
        (Jupiter).
      </p>
      <p>
        The naming kept the genealogical pattern of the planets and quickly stuck everywhere except
        England, where "the Georgian planet" lingered into the 19th century. Uranus is the only
        major planet named from Greek rather than Roman mythology.
      </p>
    </DeepDive>

    <h3 class="sub">Fame and bigger telescopes</h3>

    <p id="date-moons">
      The discovery made Herschel famous. King George awarded him a salary that allowed him to
      give up music and become a full-time astronomer.
    </p>

    <p>
      He went on to discover two of Uranus's largest moons (<strong>Titania</strong> and
      <strong>Oberon</strong>, in 1787) and to build the largest telescope of the age, a 40-foot
      reflector at Slough.
    </p>

    <h3 class="sub">An orbit that wouldn't add up</h3>

    <p id="date-neptune">
      The 19th century brought a strange new development. Uranus did not quite follow the orbit
      Newtonian mechanics predicted: a small, persistent discrepancy accumulated decade after
      decade.
    </p>

    <p>
      The suspicion of an unseen, more distant planet pulling on Uranus would lead, in 1846, to
      the discovery of Neptune.
    </p>

    <Factoid value="97.8°">
      Uranus's axial tilt, almost exactly on its side, with one pole pointing roughly toward the
      Sun for decades at a stretch. The most popular explanation is a colossal collision with an
      Earth-sized body very early in the solar system's history.
    </Factoid>

    <p id="date-rings">
      The planet's rings, discovered in 1977 from stellar occultations, are also nearly vertical
      as a consequence of the extreme tilt.
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
    nextHint="Section 4: a Decadal-Survey priority for the 2030s"
  >
    <h3 class="sub">A single flyby, ever</h3>

    <div class="drop-cap">
      <p id="date-voyager">
        Despite being one of the largest planets, Uranus has been visited just once.
      </p>
    </div>

    <p>
      <strong>Voyager 2</strong>, on its grand tour of the outer solar system, flew past Uranus
      on <strong>24 January 1986</strong> at a closest approach of about 81,500 km.
    </p>

    <Figure
      src={uranusVoyager}
      alt="A featureless pale blue-green sphere, Uranus as photographed by Voyager 2 in 1986."
      caption="Uranus, photographed by Voyager 2 in 1986, still the only close-up image humanity has of the planet."
      credit="NASA / JPL"
    />

    <MissionCard
      name="Voyager 2"
      agency="NASA"
      dates="1986 flyby"
      summary="The only spacecraft ever to visit Uranus. Hours of close observation; decades of analysis."
    >
      <p>
        Voyager 2 found that Uranus's pale blue-green colour comes from methane in the upper
        atmosphere, which absorbs red light. It detected a strange, lopsided magnetic field tilted
        nearly 60° from the rotation axis (and offset from the planet's centre). It discovered ten
        new small moons. Its photographs of <strong>Miranda</strong>, the smallest of the major
        moons, revealed a bizarre patchwork surface of cliffs and grooves that looks almost as if
        the moon had been smashed apart and reassembled, possibly more than once.
      </p>
    </MissionCard>

    <h3 class="sub">Decades of distant watching</h3>

    <PullQuote>
      Each pole gets 42 years of unbroken sunlight followed by 42 years of darkness, patterns of
      weather that play out on timescales no flyby could capture.
    </PullQuote>

    <p>
      Almost no other instruments since have been pointed seriously at Uranus. The Hubble Space
      Telescope and ground-based observatories have monitored its weather, watching dim cloud
      features slowly evolve as the planet's seasons turn. Each season lasts 21 Earth years.
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
    <h3 class="sub">A community priority</h3>

    <p id="date-future">
      In 2022 the U.S. <strong>Decadal Survey</strong> for planetary science recommended a
      dedicated <strong>Uranus Orbiter and Probe</strong> as the top large-mission priority for
      the 2030s.
    </p>

    <MissionCard
      name="Uranus Orbiter and Probe"
      agency="NASA (proposed)"
      dates="Early 2030s launch (if funded)"
      summary="Multi-year orbiter plus atmospheric probe, Cassini-style coverage for Uranus."
    >
      <p>
        Launch windows in the early 2030s are particularly favourable, using a Jupiter gravity
        assist; missing them adds years to the journey. The big questions: what is Uranus's interior
        structure? How does its weather system work? Is there an ocean inside any of its larger
        moons? Could Miranda's tortured surface tell us how icy moons evolve? After a forty-year
        gap since the only spacecraft visit, almost any answer would be new.
      </p>
    </MissionCard>
  </RevealChapter>
</HistoryShell>
