<script module>
  export const pageConfig = { title: "Earth" };
</script>

<script>
  import { getPlanet } from '../../../lib/planets.js';
  import {
    HistoryShell, RevealChapter, PullQuote, Factoid, Figure, FigureCard, MissionCard, DeepDive,
    NameTile, EratosthenesDiagram, CosmosCompare, PhotoStrip,
  } from '../../../lib/history/index.js';
  import { useChapterReveal } from '../../../lib/history/useChapterReveal.svelte.js';
  import earthEarthrise from '$assets/earth/earth-earthrise.jpg';
  import earthBlueMarble from '$assets/earth/earth-blue-marble.jpg';
  import earthArtemis2 from '$assets/earth/earth-artemis2.jpg';

  const planet = getPlanet('earth');

  const chapters = [
    { id: 'home', title: 'Home' },
    { id: 'flat-to-orbit', title: 'Flat to orbit' },
    { id: 'space', title: 'Seeing ourselves' },
    { id: 'whats-next', title: "What's next" },
  ];

  const keyDates = [
    { year: '~500 BCE', event: 'Pythagoras argues Earth is a sphere', anchor: 'date-pythagoras', chapterIndex: 1 },
    { year: '~270 BCE', event: 'Aristarchus proposes Sun-centred model', anchor: 'date-aristarchus', chapterIndex: 1 },
    { year: '~240 BCE', event: 'Eratosthenes measures Earth\'s circumference', anchor: 'date-eratosthenes', chapterIndex: 1 },
    { year: '1543', event: 'Copernicus publishes On the Revolutions', anchor: 'date-copernicus', chapterIndex: 1 },
    { year: '1687', event: 'Newton\'s Principia ties physics together', anchor: 'date-newton', chapterIndex: 1 },
    { year: '1957', event: 'Sputnik 1, first artificial satellite', anchor: 'date-sputnik', chapterIndex: 2 },
    { year: '1961', event: 'Yuri Gagarin, first human in orbit', anchor: 'date-gagarin', chapterIndex: 2 },
    { year: '1968', event: 'Apollo 8, Earthrise', anchor: 'date-earthrise', chapterIndex: 2 },
    { year: '1972', event: 'Apollo 17, The Blue Marble', anchor: 'date-bluemarble', chapterIndex: 2 },
    { year: '2000', event: 'ISS continuously occupied', anchor: 'date-iss', chapterIndex: 2 },
    { year: '2026', event: 'Artemis II, first crewed lunar flyby since Apollo', anchor: 'date-artemis', chapterIndex: 3 },
  ];

  const nameTiles = [
    { word: 'Earth', language: 'Old English', meaning: 'eorþe, "ground, soil"' },
    { word: 'Terra', language: 'Latin', meaning: '"land, earth"' },
    { word: 'Erde', language: 'German', meaning: '"ground"' },
    { word: 'Zemlya', language: 'Russian', meaning: '"land, soil"' },
  ];

  const photos = [
    {
      year: '1946',
      title: 'V-2 from White Sands',
      caption: "First photograph from space, a curving Earth horizon shot from a captured German V-2 rocket above the Kármán line.",
      placeholderLabel: 'Grainy 35 mm photograph of Earth\'s curving horizon (1946 V-2 mission).',
    },
    {
      year: '1957',
      title: 'Sputnik 1',
      caption: "Earth's first artificial satellite. The Space Age begins.",
      placeholderLabel: 'Sputnik 1, first artificial satellite, launched October 1957.',
    },
    {
      year: '1968',
      title: 'Earthrise',
      src: earthEarthrise,
      alt: 'Earth rising above the lunar horizon, photographed by Apollo 8.',
      caption: 'Apollo 8, Bill Anders photographs Earth rising above the Moon on Christmas Eve.',
      credit: 'NASA / Bill Anders',
    },
    {
      year: '1972',
      title: 'The Blue Marble',
      src: earthBlueMarble,
      alt: 'A fully illuminated Earth viewed from Apollo 17.',
      caption: 'Apollo 17, Earth fully illuminated from 45,000 km away.',
      credit: 'NASA / Apollo 17 crew',
    },
    {
      year: 'today',
      title: 'Constant watch',
      caption: 'Thousands of satellites watching ice, oceans, vegetation, urban growth, atmosphere, and a warming climate.',
      placeholderLabel: 'A modern Earth-observation composite, ice, ocean colour, city lights.',
    },
  ];

  const reveal = useChapterReveal(chapters);
  const total = chapters.length;
</script>

<HistoryShell {planet} {chapters} {keyDates} revealedCount={reveal.revealedCount}>
  <RevealChapter
    index={0}
    {reveal}
    {total}
    id="home"
    title="Knowing our home"
    eyebrow="Section 1"
    nextLabel="From flat to orbiting"
    nextHint="Section 2: the geometry that proved Earth round"
  >
    <div class="drop-cap">
      <p>
        Earth's history page is a different shape from the others. We live here, so the
        story is less about distant observation and more about how humans came to
        understand the place under their feet.
      </p>
    </div>

    <PullQuote>
      Almost universally, our planet is named not for a deity but for the dirt.
    </PullQuote>

    <div class="name-grid">
      {#each nameTiles as t}
        <NameTile word={t.word} language={t.language} meaning={t.meaning} />
      {/each}
    </div>

    <p class="epigraph">
      Every other planet borrowed a god from Greek or Roman mythology. Earth borrowed a
      shovelful of soil.
    </p>

    <h3 class="sub">Not yet a planet</h3>

    <p>
      For most of human history, Earth wasn't thought of as a planet at all. It was a
      flat or domed world at the centre of everything, with the sky and its lights moving
      around it. Babylonian, Egyptian, Norse, and Chinese cosmologies all pictured a
      bounded world supported by pillars, animals, or oceans.
    </p>
  </RevealChapter>

  <RevealChapter
    index={1}
    {reveal}
    {total}
    id="flat-to-orbit"
    title="From flat to round to orbiting"
    eyebrow="Section 2"
    nextLabel="Seeing ourselves from space"
    nextHint="Section 3: the photographs that reframed home"
  >
    <p id="date-pythagoras">
      The first people we know of to argue Earth was a sphere were Greek philosophers,
      <strong>Pythagoras</strong> around 500 BCE, then <strong>Aristotle</strong> a
      century later, who collected the evidence: ships disappearing hull-first over the
      horizon, the round shadow Earth casts on the Moon during a lunar eclipse, the way
      constellations shift as you travel north or south.
    </p>

    <span id="date-eratosthenes" class="rail-anchor"></span>
    <EratosthenesDiagram />

    <FigureCard
      name="Eratosthenes"
      dates="~276–~194 BCE"
      role="Greek polymath; first to measure Earth's circumference"
    />

    <DeepDive
      title="How a stick and a well measured a planet"
      teaser="The full setup at Syene and Alexandria, with the angle and the maths."
    >
      <p>
        Around 240 BCE, working at the Library of Alexandria, Eratosthenes knew that at
        noon on the summer solstice, in <strong>Syene</strong> (modern Aswan), the Sun
        shone straight down a deep well, meaning it was directly overhead.
      </p>
      <p>
        In Alexandria, hundreds of kilometres north, a vertical stick at the same moment
        cast a shadow at <strong>about 7°</strong>. That angle equalled the angular
        distance between the two cities along Earth's curve. Knowing the ground distance
        between them, he scaled up to the full 360° and got Earth's circumference,
        within a few percent of the modern value.
      </p>
    </DeepDive>

    <h3 class="sub">A new centre</h3>

    <p id="date-aristarchus">
      Knowing Earth's shape didn't dislodge it from the cosmic centre, though.
      <strong>Aristarchus of Samos</strong> proposed a Sun-centred model around 270 BCE,
      but it was overshadowed for nearly two millennia by <strong>Ptolemy</strong>'s
      elaborate geocentric system. Tap to compare:
    </p>

    <CosmosCompare />

    <p id="date-copernicus">
      Only in <strong>1543</strong>, with <em>On the Revolutions of the Heavenly
      Spheres</em>, did <strong>Copernicus</strong> put the Sun back at the centre and
      Earth into orbit. <strong>Tycho Brahe</strong>'s observations,
      <strong>Kepler</strong>'s laws (1609–19), and <strong>Galileo</strong>'s telescope
      made the new picture impossible to ignore.
    </p>

    <p id="date-newton">
      <strong>Newton</strong>'s <em>Principia</em> (1687) closed the loop with universal
      gravitation: Earth obeyed the same physics as everything else.
    </p>
  </RevealChapter>

  <RevealChapter
    index={2}
    {reveal}
    {total}
    id="space"
    title="Seeing ourselves from space"
    eyebrow="Section 3"
    nextLabel="What's next"
    nextHint="Section 4: Artemis and the return to deep space"
  >
    <p>
      For thousands of years, no human had seen Earth from outside it. The 20th century
      changed that in a single generation.
    </p>

    <span id="date-sputnik" class="rail-anchor"></span>
    <span id="date-gagarin" class="rail-anchor"></span>
    <span id="date-earthrise" class="rail-anchor"></span>
    <span id="date-bluemarble" class="rail-anchor"></span>
    <span id="date-iss" class="rail-anchor"></span>
    <PhotoStrip {photos} />

    <PullQuote>
      Two photographs in particular reshaped how humanity thinks about its home.
    </PullQuote>

    <p>
      <strong>Earthrise</strong> (Apollo 8, 1968) showed our world as a small, blue,
      fragile sphere against the void. <strong>The Blue Marble</strong> (Apollo 17,
      1972) became one of the most reproduced images in history, a touchstone for the
      environmental movement just then emerging.
    </p>

    <Factoid value="25+ years">
      Continuous human presence in low-Earth orbit aboard the International Space
      Station, uninterrupted since 2 November 2000.
    </Factoid>

    <p>
      The view from outside has only sharpened. Today, thousands of satellites watch
      Earth at every wavelength, mapping ice, oceans, vegetation, urban growth,
      atmospheric chemistry, and (since the 1970s) the steady changes of a warming
      climate.
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
    <p>
      Earth is the most-studied object in the universe and yet still full of unknowns.
      Most of the deep ocean has never been seen by human eyes; the interior of the
      planet is more mysterious than the surface of Mars.
    </p>

    <span id="date-artemis" class="rail-anchor"></span>
    <MissionCard
      name="Artemis"
      agency="NASA"
      dates="2022 → present"
      summary="A return to the Moon, Artemis I tested the hardware uncrewed in 2022; Artemis II flew a crewed lunar flyby in April 2026."
    >
      <p>
        After Artemis I's uncrewed flight in late 2022, <strong>Artemis II</strong>
        launched on <strong>1 April 2026</strong> with four astronauts aboard the Orion
        spacecraft <em>Integrity</em>: <strong>Reid Wiseman</strong> (commander),
        <strong>Victor Glover</strong> (pilot), <strong>Christina Koch</strong>, and
        Canadian Space Agency astronaut <strong>Jeremy Hansen</strong>. Their
        free-return lunar flyby took them farther from Earth than any humans have ever
        travelled, surpassing the record set by Apollo 13 in 1970, before
        <em>Integrity</em> splashed down in the Pacific on 10 April 2026.
      </p>
      <p>
        It was the first crewed flight beyond low Earth orbit since Apollo 17 in
        December 1972, a 53-year gap. <strong>Artemis III</strong> is planned as the
        first crewed lunar landing since Apollo. China is targeting its own crewed lunar
        landing by 2030.
      </p>
    </MissionCard>

    <Figure
      src={earthArtemis2}
      alt="The Orion spacecraft Integrity descending under three red-and-white parachutes against a blue sky, moments before splashdown in the Pacific Ocean."
      caption="Orion's Integrity capsule splashes down in the Pacific on 10 April 2026, completing Artemis II."
      credit="NASA"
    />

    <p>
      Earth is the launchpad for every other mission in this module, and our home base
      for everything we know about the rest of the solar system.
    </p>
  </RevealChapter>
</HistoryShell>

<style>
  .epigraph {
    font-size: 1.15rem;
    color: var(--tessera-text-light);
    font-style: italic;
    line-height: 1.55;
    max-width: 60ch;
  }
</style>
