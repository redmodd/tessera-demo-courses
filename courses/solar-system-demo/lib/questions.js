import jupiterHubbleGrs from '$assets/jupiter/jupiter-hubble-grs.jpg';
import jupiterGalileanMoons from '$assets/jupiter/jupiter-galilean-moons.jpg';
import saturnEquinox from '$assets/saturn/saturn-equinox.jpg';
import { getPlanet } from './planets.js';

export const questions = [
  {
    planet: "mercury",
    question: "A single day on Mercury (sunrise to sunrise) lasts about how long?",
    options: ["24 hours", "88 Earth days", "176 Earth days", "1 Earth year"],
    correct: 2,
    reveal: "Mercury rotates three times for every two orbits, a 3:2 spin-orbit resonance that makes its solar day twice as long as its year.",
  },
  {
    planet: "mercury",
    question: "Which planet has almost no atmosphere and a Moon-like, heavily cratered surface?",
    options: ["Venus", "Mercury", "Mars", "Pluto"],
    correct: 1,
    reveal: "Without an atmosphere to soften the blows, every meteor leaves its mark.",
  },
  {
    planet: "mercury",
    question: "NASA's MESSENGER spacecraft confirmed something surprising at Mercury's poles. What?",
    options: [
      "Active volcanoes",
      "Water ice in permanently shadowed craters",
      "A thin oxygen atmosphere",
      "Buried Roman coins",
    ],
    correct: 1,
    reveal: "Even the closest planet to the Sun has frozen water, in craters where the sunlight never reaches.",
  },
  {
    planet: "mercury",
    question: "Mercury is named for which Roman god?",
    options: [
      "The god of war",
      "The god of the underworld",
      "The fast-footed messenger god",
      "The god of fire",
    ],
    correct: 2,
    reveal: "It earned the name because it darts across the sky faster than any other planet.",
  },
  {
    planet: "mercury",
    question: "What's the temperature swing on Mercury between sunlight and shadow?",
    options: ["About 50°C", "About 200°C", "About 610°C", "About 1000°C"],
    correct: 2,
    reveal: "From 430°C in sunlight to −180°C in shadow. Bring a sweater. And a cooling suit.",
  },
  {
    planet: "mercury",
    question: "How many moons does Mercury have?",
    options: ["0", "1", "2", "5"],
    correct: 0,
    reveal: "Mercury and Venus are the only planets with no moons at all.",
  },
  {
    planet: "mercury",
    question: "The first transit of any planet ever observed was Mercury's, in 1631, predicted by Kepler and watched by which French astronomer?",
    options: ["Pierre Gassendi", "Christiaan Huygens", "Giovanni Cassini", "Edmond Halley"],
    correct: 0,
    reveal: "Gassendi watched Mercury cross the Sun's face from Paris, exactly when Kepler's tables said it would.",
  },
  {
    planet: "mercury",
    question: "Mercury's orbit drifts forward by 43 arcseconds per century beyond Newton's predictions. What finally explained it?",
    options: [
      "A hidden planet called Vulcan",
      "An error in the measurements",
      "Einstein's general relativity",
      "Tidal forces from the Sun",
    ],
    correct: 2,
    reveal: "In 1915 Einstein showed the Sun's gravity warps space-time enough to produce exactly that drift, Vulcan was never needed.",
  },
  {
    planet: "mercury",
    question: "Mariner 10 (1974–75) reached Mercury using the first-ever interplanetary gravity assist, slingshotting off which planet?",
    options: ["Earth", "Venus", "Mars", "Jupiter"],
    correct: 1,
    reveal: "Venus's gravity bent Mariner 10's path enough to set up three Mercury flybys with a single launch.",
  },
  {
    planet: "mercury",
    question: "Compared to Earth's, Mercury's iron core is...",
    options: [
      "Tiny",
      "About the same proportion",
      "Proportionally much bigger",
      "Mostly nickel rather than iron",
    ],
    correct: 2,
    reveal: "Mercury is unusually dense, its iron core takes up a much bigger fraction of the planet than Earth's does.",
  },
  {
    planet: "mercury",
    question: "BepiColombo, the next mission to enter Mercury orbit, is a joint project of which two space agencies?",
    options: ["NASA and Roscosmos", "ESA and JAXA", "NASA and ESA", "JAXA and ISRO"],
    correct: 1,
    reveal: "Europe's MPO and Japan's Mio orbiters travelled together and will separate after arrival in 2026.",
  },

  {
    planet: "venus",
    question: "The hottest planet in our solar system is...",
    options: ["Mercury (closest to the Sun)", "Venus", "Mars", "Jupiter"],
    correct: 1,
    reveal: "Venus's thick CO₂ atmosphere traps heat so well that it's hotter than Mercury, even though it's farther from the Sun.",
  },
  {
    planet: "venus",
    question: "What rains in Venus's clouds?",
    options: ["Water", "Methane", "Sulphuric acid", "Diamonds"],
    correct: 2,
    reveal: "High in the atmosphere, sulphuric acid clouds drop acid rain that evaporates before reaching the ground.",
  },
  {
    planet: "venus",
    question: "Which way does Venus rotate, compared to most planets?",
    options: [
      "Same direction, but very slowly",
      "Backwards",
      "It doesn't rotate",
      "On its side",
    ],
    correct: 1,
    reveal: "On Venus, the Sun rises in the west and sets in the east.",
  },
  {
    planet: "venus",
    question: "A day on Venus is longer than...",
    options: ["An hour", "An Earth day", "A week", "A year on Venus"],
    correct: 3,
    reveal: "A Venusian day takes 243 Earth days; a Venusian year takes only 225. Time gets weird out there.",
  },
  {
    planet: "venus",
    question: "The first successful landings on another planet were made by which country's space programme?",
    options: ["USA", "Soviet Union", "China", "Japan"],
    correct: 1,
    reveal: "The Venera probes landed on Venus in the 1970s and survived only minutes before being crushed by the heat and pressure.",
  },
  {
    planet: "venus",
    question: "Why did Galileo's observation of Venus's phases (1610) shake up astronomy?",
    options: [
      "It proved Venus had moons",
      "It only made sense if Venus orbited the Sun, not Earth",
      "It showed Venus had an atmosphere",
      "It revealed Venus was made of gas",
    ],
    correct: 1,
    reveal: "The phases were a death blow to the Earth-centred model of the cosmos.",
  },
  {
    planet: "venus",
    question: "The Maya tracked Venus's appearances using a famous pre-Columbian astronomical document, which one?",
    options: ["The Madrid Codex", "The Dresden Codex", "The Aztec Sun Stone", "The Popol Vuh"],
    correct: 1,
    reveal: "The Dresden Codex contains tables predicting Venus's appearances centuries in advance.",
  },
  {
    planet: "venus",
    question: "In 1761, who correctly inferred that Venus had an atmosphere from a thin halo of light seen during its transit?",
    options: ["Edmond Halley", "Mikhail Lomonosov", "James Cook", "Pierre Gassendi"],
    correct: 1,
    reveal: "Lomonosov saw the halo from St. Petersburg and read it correctly: sunlight was being refracted by Venus's atmosphere.",
  },
  {
    planet: "venus",
    question: "Captain James Cook's first Pacific voyage was, ostensibly, a mission to observe...",
    options: [
      "A solar eclipse",
      "A transit of Venus",
      "The discovery of a new continent",
      "An aurora",
    ],
    correct: 1,
    reveal: "The Royal Society sent Cook to Tahiti to time the 1769 transit of Venus from the Pacific.",
  },
  {
    planet: "venus",
    question: "NASA's Magellan spacecraft mapped 98% of Venus's surface in the early 1990s using...",
    options: ["Infrared cameras", "Radar (to pierce the clouds)", "Atmospheric sampling", "X-rays"],
    correct: 1,
    reveal: "Visible light can't reach the surface through Venus's clouds, radar can.",
  },
  {
    planet: "venus",
    question: "Venus's atmospheric pressure at the surface is roughly...",
    options: ["A tenth of Earth's", "Equal to Earth's", "10 times Earth's", "90 times Earth's"],
    correct: 3,
    reveal: "About the same pressure you'd feel under nearly a kilometre of ocean on Earth.",
  },

  {
    planet: "earth",
    question: "Which planet's English name does NOT come from Greek or Roman mythology?",
    options: ["Mars", "Earth", "Venus", "Saturn"],
    correct: 1,
    reveal: "\"Earth\" comes from Old English and Germanic words meaning, simply, \"ground.\"",
  },
  {
    planet: "earth",
    question: "Around 240 BCE, who calculated Earth's circumference using the angle of shadows?",
    options: ["Aristotle", "Pythagoras", "Eratosthenes", "Ptolemy"],
    correct: 2,
    reveal: "His estimate was off by only a few percent, using nothing but geometry and a well in southern Egypt.",
  },
  {
    planet: "earth",
    question: "The famous \"Earthrise\" photo was taken from which mission?",
    options: ["Apollo 11", "Apollo 8", "Voyager 1", "The ISS"],
    correct: 1,
    reveal: "Apollo 8's crew took it on Christmas Eve, 1968, as Earth rose above the Moon's horizon.",
  },
  {
    planet: "earth",
    question: "Which feature of Earth helps stabilise its tilt and seasons?",
    options: [
      "Its magnetic field",
      "Its atmosphere",
      "Its unusually large Moon",
      "The Sun's gravity",
    ],
    correct: 2,
    reveal: "Without our oversized Moon, Earth's axis could wobble wildly over millions of years.",
  },
  {
    planet: "earth",
    question: "The International Space Station has been continuously occupied since...",
    options: ["1985", "2000", "2010", "2020"],
    correct: 1,
    reveal: "Humans have lived in space without interruption for over 25 years.",
  },
  {
    planet: "earth",
    question: "Around 270 BCE, who first proposed that Earth orbits the Sun, almost 1,800 years before Copernicus?",
    options: ["Pythagoras", "Aristotle", "Aristarchus of Samos", "Eratosthenes"],
    correct: 2,
    reveal: "His Sun-centred model was overshadowed by Ptolemy's Earth-centred system for nearly two thousand years before Copernicus revived the idea.",
  },
  {
    planet: "earth",
    question: "The first artificial satellite, Sputnik 1, was launched in October 1957 by which country?",
    options: ["United States", "Soviet Union", "United Kingdom", "France"],
    correct: 1,
    reveal: "Sputnik's beeping shocked the West and triggered the Space Race.",
  },
  {
    planet: "earth",
    question: "The famous \"Blue Marble\" photograph of a fully illuminated Earth was taken in 1972 by the crew of...",
    options: ["Apollo 11", "Apollo 17", "Skylab", "Voyager 1"],
    correct: 1,
    reveal: "Apollo 17 photographed Earth from about 45,000 km away on its way to the Moon, the last crewed lunar mission to date.",
  },
  {
    planet: "earth",
    question: "Who was the first human ever to reach orbit?",
    options: ["Neil Armstrong", "Yuri Gagarin", "Alan Shepard", "John Glenn"],
    correct: 1,
    reveal: "Gagarin orbited Earth once aboard Vostok 1 in April 1961, looking down through a small porthole.",
  },
  {
    planet: "earth",
    question: "Newton's 1687 work that united gravity and planetary motion under a single theory was titled...",
    options: ["Optics", "Principia", "On the Revolutions", "Astronomia Nova"],
    correct: 1,
    reveal: "Philosophiæ Naturalis Principia Mathematica showed that the same physics governs an apple, the Moon, and the planets.",
  },
  {
    planet: "earth",
    question: "Eratosthenes measured Earth's circumference by comparing the noon shadow in Alexandria with the sunlight reaching the bottom of a well in...",
    options: [
      "Athens",
      "Babylon",
      "Syene (modern Aswan)",
      "Memphis",
    ],
    correct: 2,
    reveal: "At Syene, on the summer solstice, the Sun shone straight down the well, directly overhead.",
  },

  {
    planet: "mars",
    question: "Why is Mars red?",
    options: [
      "Volcanic ash",
      "Iron-rich dust on the surface",
      "A reflection from the Sun",
      "It's actually orange, that's just how it photographs",
    ],
    correct: 1,
    reveal: "Mars is rusting. Iron in the surface dust has oxidised over billions of years.",
  },
  {
    planet: "mars",
    question: "The tallest volcano in the solar system is on which planet?",
    options: ["Earth", "Venus", "Mars", "Jupiter"],
    correct: 2,
    reveal: "Olympus Mons rises about 22 km, roughly two and a half times the height of Mount Everest.",
  },
  {
    planet: "mars",
    question: "Mars's two moons, Phobos and Deimos, are named for the Greek personifications of...",
    options: [
      "Day and night",
      "Fear and dread",
      "Victory and defeat",
      "Earth and sky",
    ],
    correct: 1,
    reveal: "They're the sons of Ares (the Greek Mars), fitting moons for the planet of war.",
  },
  {
    planet: "mars",
    question: "The first powered flight on another world was made in 2021 by...",
    options: [
      "The Perseverance rover",
      "Ingenuity, a small helicopter",
      "A SpaceX prototype",
      "A Chinese drone",
    ],
    correct: 1,
    reveal: "Ingenuity flew dozens of times in Mars's thin atmosphere before damaging a blade in 2024.",
  },
  {
    planet: "mars",
    question: "Kepler used Mars to figure out something fundamental about the planets. What?",
    options: [
      "That they're made of rock",
      "That they travel on ellipses, not circles",
      "That they have moons",
      "That Mars has water",
    ],
    correct: 1,
    reveal: "Tycho Brahe's observations of Mars gave Kepler the data he needed for his three laws of planetary motion.",
  },
  {
    planet: "mars",
    question: "In 1877, Italian astronomer Schiaparelli reported seeing what on Mars, a claim that, mistranslated, sparked a century of speculation?",
    options: [
      "Volcanoes",
      "Forests",
      "\"Canali\" (channels), mistranslated as \"canals\"",
      "Cities",
    ],
    correct: 2,
    reveal: "The mistranslation launched decades of speculation about Martian civilisations.",
  },
  {
    planet: "mars",
    question: "NASA's Curiosity rover, which landed in 2012, is exploring which Martian crater?",
    options: ["Jezero Crater", "Gusev Crater", "Gale Crater", "Endurance Crater"],
    correct: 2,
    reveal: "Curiosity is still climbing Mount Sharp inside Gale Crater more than a decade after landing.",
  },
  {
    planet: "mars",
    question: "The 1976 NASA mission that put the first successful landers on Mars, and ran experiments to test for microbial life, was...",
    options: ["Mariner", "Viking", "Pathfinder", "Phoenix"],
    correct: 1,
    reveal: "Vikings 1 and 2 ran chemistry experiments whose results are still mildly disputed today.",
  },
  {
    planet: "mars",
    question: "The wealthy American amateur astronomer who built an Arizona observatory specifically to study Mars's supposed \"canals\" was...",
    options: ["Edwin Hubble", "Percival Lowell", "George Hale", "Asaph Hall"],
    correct: 1,
    reveal: "Lowell's bestselling books popularised the idea of a dying Martian civilisation building irrigation works.",
  },
  {
    planet: "mars",
    question: "The huge canyon system on Mars, named for the spacecraft that discovered it, is...",
    options: ["Olympus Mons", "Valles Marineris", "Hellas Basin", "Vallis Schiaparelli"],
    correct: 1,
    reveal: "Mariner 9 spotted the canyon system, over 4,000 km long, when a global dust storm finally cleared.",
  },
  {
    planet: "mars",
    question: "Mariner 9, which arrived at Mars in 1971, set what other milestone?",
    options: [
      "First spacecraft to land on another planet",
      "First spacecraft to orbit another planet",
      "First spacecraft to leave the solar system",
      "First crewed mission beyond Earth orbit",
    ],
    correct: 1,
    reveal: "It arrived during a global dust storm and, when the dust settled, revealed Olympus Mons and Valles Marineris.",
  },

  {
    planet: "jupiter",
    question: "Jupiter is more massive than...",
    options: [
      "Earth",
      "Mars and Earth combined",
      "All the other planets combined",
      "The Sun",
    ],
    correct: 2,
    reveal: "Jupiter is more than twice as massive as everything else in the solar system put together (excluding the Sun).",
  },
  {
    planet: "jupiter",
    question: "The Great Red Spot is...",
    options: [
      "A volcano",
      "A giant storm that's lasted centuries",
      "A dust patch",
      "A reflection of the Sun",
    ],
    correct: 1,
    reveal: "It's been raging for at least 350 years and is wide enough to swallow Earth.",
  },
  {
    planet: "jupiter",
    question: "In 1610 Galileo discovered four moons orbiting Jupiter. Why was this such a big deal?",
    options: [
      "It proved Jupiter was a planet",
      "It was the first direct evidence that not everything orbits Earth",
      "It made him rich",
      "It explained the seasons",
    ],
    correct: 1,
    reveal: "The four \"Galilean moons\" cracked the Earth-centred model of the cosmos.",
  },
  {
    planet: "jupiter",
    question: "Which Jovian moon is widely considered one of the best places to look for life beyond Earth?",
    options: ["Io", "Europa", "Ganymede", "Callisto"],
    correct: 1,
    reveal: "Europa is thought to hide a salty ocean beneath its icy crust.",
  },
  {
    planet: "jupiter",
    question: "How long is a day on Jupiter?",
    options: ["1 Earth day", "About 10 hours", "About 30 hours", "1 Earth week"],
    correct: 1,
    reveal: "Jupiter spins so fast that it bulges noticeably at the equator.",
  },
  {
    planet: "jupiter",
    question: "NASA's mission currently studying Jupiter's interior and magnetic field is called...",
    options: ["Galileo", "Cassini", "Juno", "Voyager"],
    correct: 2,
    reveal: "In Roman myth, Juno was Jupiter's wife, the only one who could see through the clouds he hid behind.",
  },
  {
    planet: "jupiter",
    question: "The four Galilean moons of Jupiter are Io, Europa, Ganymede, and...",
    options: ["Titan", "Callisto", "Triton", "Phobos"],
    correct: 1,
    reveal: "All four are still called the Galilean moons in Galileo's honour.",
  },
  {
    planet: "jupiter",
    question: "In 1676 Ole Rømer used the timing of eclipses of Jupiter's moon Io to make the first measurement of...",
    options: [
      "Jupiter's mass",
      "The speed of light",
      "The astronomical unit",
      "Jupiter's distance from the Sun",
    ],
    correct: 1,
    reveal: "Io's eclipses arrived earlier or later depending on Earth's distance from Jupiter, only possible if light has a finite speed.",
  },
  {
    planet: "jupiter",
    question: "NASA's Galileo orbiter dropped a probe directly into Jupiter's atmosphere. How long did the probe transmit before being destroyed?",
    options: ["A few seconds", "About 58 minutes", "Several hours", "More than a day"],
    correct: 1,
    reveal: "It was crushed and melted at depths where pressures exceed 22 atmospheres, the only spacecraft ever to enter a giant planet.",
  },
  {
    planet: "jupiter",
    question: "ESA's JUICE mission (Jupiter Icy Moons Explorer) will eventually settle into orbit around which Jovian moon?",
    options: ["Europa", "Io", "Ganymede", "Callisto"],
    correct: 2,
    reveal: "Ganymede is the largest moon in the solar system, bigger than Mercury, and JUICE will be the first spacecraft to orbit a moon other than our own.",
  },
  {
    planet: "jupiter",
    question: "Active volcanism beyond Earth was first observed by Voyager in 1979 on which Jovian moon?",
    options: ["Europa", "Io", "Ganymede", "Callisto"],
    correct: 1,
    reveal: "Io's volcanoes are powered by tidal flexing as it's pulled by Jupiter and the other Galilean moons.",
  },

  {
    planet: "saturn",
    question: "Saturn's rings are mostly made of...",
    options: ["Solid rock", "Ice and rocky particles", "Gas", "Light"],
    correct: 1,
    reveal: "From sand-grain-sized to house-sized chunks of ice, all orbiting in a paper-thin disc.",
  },
  {
    planet: "saturn",
    question: "Saturn would do something unusual if you put it in a (very large) bathtub. What?",
    options: ["Sink instantly", "Float", "Dissolve", "Boil"],
    correct: 1,
    reveal: "Saturn's average density is less than water's. The bathtub would have to be cosmically huge.",
  },
  {
    planet: "saturn",
    question: "Saturn's largest moon, Titan, is famous for...",
    options: [
      "Active volcanoes",
      "A thick atmosphere and lakes of liquid methane",
      "Rings of its own",
      "About to crash into Saturn",
    ],
    correct: 1,
    reveal: "Titan is the only moon in the solar system with a substantial atmosphere, and it's bigger than Mercury.",
  },
  {
    planet: "saturn",
    question: "Christiaan Huygens was the first to correctly identify Saturn's \"ears\" (which had baffled Galileo) as...",
    options: [
      "A second planet",
      "A flat ring around the planet",
      "Two large moons",
      "A trick of light",
    ],
    correct: 1,
    reveal: "With a better telescope in 1655, Huygens finally saw what Galileo couldn't resolve.",
  },
  {
    planet: "saturn",
    question: "The Cassini–Huygens mission ended in 2017 by...",
    options: [
      "Returning to Earth",
      "Plunging into Saturn's atmosphere on purpose",
      "Drifting off into space",
      "Crashing into Titan",
    ],
    correct: 1,
    reveal: "The \"Grand Finale\" was a deliberate dive to protect the moons from any earthly contamination on the spacecraft.",
  },
  {
    planet: "saturn",
    question: "Saturn is named for the Roman god of...",
    options: ["The sea", "War", "Agriculture and time", "The underworld"],
    correct: 2,
    reveal: "He was Jupiter's father, the king of the older generation of gods.",
  },
  {
    planet: "saturn",
    question: "Saturn's largest moon, Titan, was discovered in 1655 by...",
    options: ["Galileo Galilei", "Christiaan Huygens", "Giovanni Cassini", "William Herschel"],
    correct: 1,
    reveal: "Huygens spotted Titan the same year he resolved Saturn's rings, both with a telescope he had ground himself.",
  },
  {
    planet: "saturn",
    question: "The dark gap between Saturn's two main rings, discovered in 1675, is called...",
    options: ["The Cassini Division", "The Encke Gap", "The Roche Limit", "The Maxwell Gap"],
    correct: 0,
    reveal: "Giovanni Cassini, then director of the Paris Observatory, spotted the gap and four more Saturnian moons within a decade.",
  },
  {
    planet: "saturn",
    question: "In 2005, the Cassini spacecraft discovered enormous geyser-like plumes erupting from which icy Saturnian moon?",
    options: ["Titan", "Mimas", "Enceladus", "Iapetus"],
    correct: 2,
    reveal: "The plumes are jets of water from a global subsurface ocean, making Enceladus a top candidate in the search for life.",
  },
  {
    planet: "saturn",
    question: "NASA's upcoming mission to Titan, a nuclear-powered drone designed to fly between sites on the moon's surface, is called...",
    options: ["Dragonfly", "Hummingbird", "Albatross", "Aerobot"],
    correct: 0,
    reveal: "Dragonfly is an octocopter due to launch in 2028 and arrive at Titan in the mid-2030s.",
  },
  {
    planet: "saturn",
    question: "Saturn takes roughly how long to complete one orbit around the Sun?",
    options: ["1 Earth year", "12 Earth years", "29 Earth years", "84 Earth years"],
    correct: 2,
    reveal: "Saturn's slow, 29-year journey through the zodiac helped earn it associations with time and old age.",
  },

  {
    planet: "uranus",
    question: "Uranus is unique among planets because...",
    options: [
      "It rotates backwards",
      "It rotates almost completely on its side",
      "It has no moons",
      "It glows green",
    ],
    correct: 1,
    reveal: "Its axis is tilted about 98°, likely the result of an ancient collision.",
  },
  {
    planet: "uranus",
    question: "Uranus was the first planet discovered with a telescope. By whom?",
    options: ["Galileo", "William Herschel", "Edmond Halley", "Tycho Brahe"],
    correct: 1,
    reveal: "He spotted it from his back garden in Bath in 1781, and at first wanted to name it after King George III.",
  },
  {
    planet: "uranus",
    question: "How many spacecraft have ever visited Uranus?",
    options: ["0", "1", "5", "More than 10"],
    correct: 1,
    reveal: "Voyager 2 in 1986, that's it. Every close-up image we have of Uranus is from that single flyby.",
  },
  {
    planet: "uranus",
    question: "A season on Uranus lasts about...",
    options: ["3 months", "1 Earth year", "21 Earth years", "100 Earth years"],
    correct: 2,
    reveal: "Each pole spends decades in continuous sunlight or darkness.",
  },
  {
    planet: "uranus",
    question: "Uranus is the only major planet named for a...",
    options: [
      "Roman emperor",
      "Greek god (rather than Roman)",
      "Real person",
      "Constellation",
    ],
    correct: 1,
    reveal: "He's the Greek god of the sky, and the grandfather of Jupiter (Zeus).",
  },
  {
    planet: "uranus",
    question: "What did the irregularities in Uranus's orbit lead astronomers to do?",
    options: [
      "Decide Newton's laws were wrong",
      "Predict, and then discover, Neptune",
      "Send the first probe to deep space",
      "Recalculate the size of the Sun",
    ],
    correct: 1,
    reveal: "Uranus wasn't quite where it should be, so a hidden eighth planet must be tugging on it. Right on both counts.",
  },
  {
    planet: "uranus",
    question: "Voyager 2's flyby of Uranus, the only spacecraft visit, ever, happened in which year?",
    options: ["1972", "1977", "1986", "1989"],
    correct: 2,
    reveal: "On 24 January 1986 Voyager 2 passed within about 81,500 km of Uranus's cloud tops, then headed on toward Neptune.",
  },
  {
    planet: "uranus",
    question: "Uranus's pale blue-green colour comes from...",
    options: [
      "Reflected ocean below the clouds",
      "Methane in the upper atmosphere absorbing red light",
      "Iron-rich dust",
      "Sulphur compounds",
    ],
    correct: 1,
    reveal: "Methane preferentially absorbs longer (red) wavelengths, so what we see is the bluer light bounced back.",
  },
  {
    planet: "uranus",
    question: "Herschel originally proposed naming his new planet after which person?",
    options: ["Isaac Newton", "King George III", "Julius Caesar", "Himself"],
    correct: 1,
    reveal: "He called it Georgium Sidus, \"George's Star\", after his royal patron. The continent was unimpressed and Uranus stuck.",
  },
  {
    planet: "uranus",
    question: "Two of Uranus's largest moons, discovered by Herschel in 1787, take their names from Shakespeare. Which two?",
    options: [
      "Titan and Oberon",
      "Titania and Oberon",
      "Miranda and Ariel",
      "Puck and Mab",
    ],
    correct: 1,
    reveal: "Most Uranian moons are named for characters from Shakespeare and Pope, breaking the usual planet-mythology pattern.",
  },
  {
    planet: "uranus",
    question: "The 2022 U.S. Decadal Survey for planetary science recommended which mission as the top large-mission priority for the 2030s?",
    options: [
      "A Neptune orbiter",
      "A Uranus Orbiter and Probe",
      "A return to Pluto",
      "A second Mars sample-return",
    ],
    correct: 1,
    reveal: "Launch windows in the early 2030s are particularly favourable, using a Jupiter gravity assist.",
  },

  {
    planet: "neptune",
    question: "Neptune is unusual in the history of astronomy because it was discovered...",
    options: [
      "By accident",
      "Through mathematical prediction",
      "From Mars",
      "In the 20th century",
    ],
    correct: 1,
    reveal: "Mathematicians predicted exactly where to look, and there it was.",
  },
  {
    planet: "neptune",
    question: "Who pointed his telescope at the predicted spot in 1846 and confirmed Neptune?",
    options: ["Le Verrier", "John Couch Adams", "Johann Galle", "William Herschel"],
    correct: 2,
    reveal: "Le Verrier did the math; Galle in Berlin did the looking.",
  },
  {
    planet: "neptune",
    question: "Neptune has the solar system's...",
    options: [
      "Tallest mountains",
      "Fastest winds",
      "Brightest auroras",
      "Largest moon",
    ],
    correct: 1,
    reveal: "Winds on Neptune can blow past 2,000 km/h, supersonic by Earth standards.",
  },
  {
    planet: "neptune",
    question: "Neptune's largest moon, Triton, is unusual because it...",
    options: [
      "Is bigger than Earth",
      "Orbits backwards (probably a captured Kuiper Belt object)",
      "Has a ring",
      "Is shaped like a cube",
    ],
    correct: 1,
    reveal: "Triton orbits the \"wrong way,\" strongly suggesting it was captured rather than formed in place.",
  },
  {
    planet: "neptune",
    question: "How long does Neptune take to orbit the Sun?",
    options: ["84 years", "100 years", "165 years", "500 years"],
    correct: 2,
    reveal: "Neptune has only completed one full orbit since it was discovered.",
  },
  {
    planet: "neptune",
    question: "Past Neptune lies the Kuiper Belt, home to...",
    options: [
      "Mostly metal asteroids",
      "Pluto, Eris, and other icy dwarf worlds",
      "Active comets",
      "The edge of the Sun",
    ],
    correct: 1,
    reveal: "Pluto was reclassified as a dwarf planet in 2006, but it's still the most famous resident of the Kuiper Belt.",
  },
  {
    planet: "neptune",
    question: "Galileo unwittingly observed Neptune in his Jupiter notebooks, in which year?",
    options: ["1543", "1610", "1612", "1781"],
    correct: 2,
    reveal: "On 28 December 1612 he drew Neptune as a \"fixed star\"; a follow-up sketch a month later shows it had moved, but he didn't pursue it.",
  },
  {
    planet: "neptune",
    question: "John Couch Adams began calculating where an unseen planet beyond Uranus must lie in...",
    options: ["1781", "1820", "1843", "1869"],
    correct: 2,
    reveal: "Adams was a young Cambridge mathematician working alone with little observational support.",
  },
  {
    planet: "neptune",
    question: "Adams sent his Neptune prediction to Britain's Astronomer Royal, who then sat on it for nearly a year. Who was he?",
    options: ["George Airy", "James Challis", "John Herschel", "William Lassell"],
    correct: 0,
    reveal: "Airy's delay is one reason the discovery credit eventually went to a French/German team rather than a British one.",
  },
  {
    planet: "neptune",
    question: "Neptune's largest moon, Triton, was discovered just 17 days after Neptune itself, by which astronomer?",
    options: ["Johann Galle", "Heinrich d'Arrest", "William Lassell", "Gerard Kuiper"],
    correct: 2,
    reveal: "Lassell observed it from his private observatory in Liverpool, a wealthy amateur with very good telescopes.",
  },
  {
    planet: "neptune",
    question: "Voyager 2 photographed an enormous storm on Neptune in 1989, comparable to Jupiter's Great Red Spot. It was called...",
    options: [
      "The Great Black Storm",
      "The Great Dark Spot",
      "The Eye of Neptune",
      "The Triton Vortex",
    ],
    correct: 1,
    reveal: "The Great Dark Spot vanished by the time Hubble looked again in 1994, Neptune's storms are short-lived.",
  },
];

export const interactive = [
  {
    planet: "jupiter",
    kind: "sequencing",
    question: "Drag the Galilean moons into order, closest to Jupiter first.",
    items: ["Io", "Europa", "Ganymede", "Callisto"],
    reveal:
      "Galileo's \"Medicean Stars\" of 1610, listed inside-out: Io, Europa, Ganymede, Callisto.",
  },
  {
    planet: "earth",
    kind: "sequencing",
    question: "Order these milestones of the early Space Age, earliest first.",
    items: [
      "Sputnik 1 launched",
      "Yuri Gagarin orbits Earth",
      "Apollo 8's \"Earthrise\" photo",
      "Apollo 11 lands on the Moon",
    ],
    reveal:
      "1957, 1961, 1968, 1969, twelve years from a beeping satellite to bootprints on the Moon.",
  },
  {
    planet: "mars",
    kind: "sequencing",
    question: "Order these Mars missions by arrival date, earliest first.",
    items: [
      "Mariner 9 enters orbit",
      "Viking 1 lands",
      "Curiosity rover lands",
      "Ingenuity makes the first powered flight",
    ],
    reveal: "1971, 1976, 2012, 2021, fifty years of Mars exploration in four steps.",
  },

  {
    planet: "jupiter",
    kind: "matching",
    question: "Match each moon to the planet it orbits.",
    pairs: [
      { left: "Phobos", right: "Mars" },
      { left: "Europa", right: "Jupiter" },
      { left: "Titan", right: "Saturn" },
      { left: "Triton", right: "Neptune" },
    ],
    reveal:
      "Triton is the odd one out, it orbits Neptune backwards, almost certainly a captured Kuiper Belt object.",
  },
  {
    planet: "saturn",
    kind: "matching",
    question: "Match each planet to its signature feature.",
    pairs: [
      { left: "Mars", right: "Olympus Mons" },
      { left: "Saturn", right: "Cassini Division" },
      { left: "Jupiter", right: "Great Red Spot" },
      { left: "Venus", right: "Maxwell Montes" },
    ],
    reveal:
      "Maxwell Montes, the highest range on Venus, is the only major Venusian feature named for a man (James Clerk Maxwell).",
  },
  {
    planet: "neptune",
    kind: "matching",
    question: "Match each astronomer to what they discovered.",
    pairs: [
      { left: "William Herschel", right: "Uranus" },
      { left: "Johann Galle", right: "Neptune" },
      { left: "Christiaan Huygens", right: "Titan" },
      { left: "William Lassell", right: "Triton" },
    ],
    reveal:
      "Lassell spotted Triton just 17 days after Galle confirmed Neptune itself, an extraordinary fortnight in 1846.",
  },

  {
    planet: "mars",
    kind: "slider",
    question: "How tall is Olympus Mons, the solar system's tallest volcano?",
    min: 0,
    max: 30,
    step: 1,
    correct: 22,
    tolerance: 3,
    unit: "km",
    reveal: "About 22 km, roughly two-and-a-half times the height of Mount Everest.",
  },
  {
    planet: "neptune",
    kind: "slider",
    question: "What's the top wind speed measured on Neptune?",
    min: 0,
    max: 3000,
    step: 50,
    correct: 2100,
    tolerance: 250,
    unit: "km/h",
    reveal:
      "Around 2,100 km/h, supersonic, and the fastest winds anywhere in the solar system.",
  },
  {
    planet: "earth",
    kind: "slider",
    question: "In what year was Sputnik 1, the first artificial satellite, launched?",
    min: 1940,
    max: 2000,
    step: 1,
    correct: 1957,
    tolerance: 3,
    unit: "",
    reveal: "October 1957, the start of the Space Age.",
  },
  {
    planet: "venus",
    kind: "slider",
    question: "What's the average surface temperature on Venus?",
    min: 0,
    max: 700,
    step: 10,
    correct: 465,
    tolerance: 40,
    unit: "°C",
    reveal: "About 465°C, hot enough to melt lead. Hotter than Mercury, despite being farther out.",
  },

  {
    planet: "jupiter",
    kind: "hotspot",
    question: "Click the Great Red Spot.",
    image: jupiterHubbleGrs,
    alt: "Hubble portrait of Jupiter showing its banded clouds and the Great Red Spot.",
    target: { cx: 72, cy: 68, r: 9 },
    reveal:
      "A storm wider than Earth, raging for at least 350 years, though it's been slowly shrinking in recent decades.",
  },
  {
    planet: "jupiter",
    kind: "hotspot",
    question: "Click Europa, the icy moon thought to hide a salty ocean.",
    image: jupiterGalileanMoons,
    alt: "Composite of Jupiter and its four Galilean moons: Io, Europa, Ganymede, and Callisto.",
    target: { cx: 64, cy: 45, r: 12 },
    reveal:
      "Europa, the smallest of the Galilean four, and one of the best places in the solar system to look for life.",
  },
  {
    planet: "saturn",
    kind: "hotspot",
    question: "Click the Cassini Division, the dark gap that runs all the way around Saturn's rings.",
    image: saturnEquinox,
    alt: "Saturn from Cassini, with rings nearly edge-on at equinox.",
    target: [
      { cx: 14, cy: 55, r: 8 },
      { cx: 86, cy: 47, r: 8 },
      { cx: 50, cy: 53, r: 12 },
    ],
    reveal:
      "Discovered in 1675, the Cassini Division separates the bright A and B rings, and is kept clear by a resonance with the moon Mimas. It wraps the entire planet; you could have clicked anywhere along the dark line.",
  },
];

export function planetNameFor(slug) {
  return getPlanet(slug)?.name ?? slug;
}

function takeRandom(pool, n) {
  const out = [];
  const copy = [...pool];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function drawTen() {
  const targetInteractive = Math.min(3, interactive.length);
  const interactivePicks = takeRandom(interactive, targetInteractive);
  const mcPicks = takeRandom(questions, 10 - interactivePicks.length);
  return shuffle([...interactivePicks, ...mcPicks]);
}

export function isAnswerCorrect(q, answer) {
  const kind = q.kind ?? "mc";
  if (answer == null) return false;
  switch (kind) {
    case "mc":
      return answer === q.correct;
    case "sequencing":
      return (
        Array.isArray(answer) &&
        answer.length === q.items.length &&
        answer.every((v, i) => v === q.items[i])
      );
    case "matching":
      return q.pairs.every((p) => answer[p.left] === p.right);
    case "slider":
      return Math.abs(answer - q.correct) <= q.tolerance;
    case "hotspot": {
      const zones = Array.isArray(q.target) ? q.target : [q.target];
      return zones.some((z) => {
        const dx = answer.x - z.cx;
        const dy = answer.y - z.cy;
        return Math.sqrt(dx * dx + dy * dy) <= z.r;
      });
    }
    default:
      return false;
  }
}

export function scoreBand(score) {
  if (score === 10) return { title: "Mission Commander", icon: "rocket" };
  if (score >= 7) return { title: "Cosmic Explorer", icon: "sparkles" };
  if (score >= 4) return { title: "Space Cadet", icon: "satellite" };
  return { title: "Earthbound, try again, captain!", icon: "globe" };
}
