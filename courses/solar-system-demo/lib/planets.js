export const planets = [
  {
    slug: "mercury",
    name: "Mercury",
    color: "var(--planet-mercury)",
    accent: "#d9c9b0",
    size: 14,
    orbit: 90,
    duration: 80,
    blurb:
      "The smallest planet and the closest to the Sun, Mercury is a scorched, cratered world with almost no atmosphere. A day on Mercury, sunrise to sunrise, lasts longer than its year. Temperatures swing from 430°C in sunlight to −180°C in shadow.",
    stats: [
      { label: "Distance from Sun", value: "58 million km (0.39 AU)" },
      { label: "Day length", value: "176 Earth days" },
      { label: "Year length", value: "88 Earth days" },
      { label: "Moons", value: "0" },
    ],
    subtitle: "Where mythology mistook one bright dot for two.",
  },
  {
    slug: "venus",
    name: "Venus",
    color: "var(--planet-venus)",
    accent: "#f1d59c",
    size: 22,
    orbit: 130,
    duration: 120,
    blurb:
      "Earth's near-twin in size, but a hellscape underneath its clouds. A thick carbon-dioxide atmosphere traps heat so efficiently that Venus's surface, at around 465°C, is hotter than Mercury's. It rains sulphuric acid up high, and the planet rotates backwards compared to most others.",
    stats: [
      { label: "Distance from Sun", value: "108 million km (0.72 AU)" },
      { label: "Day length", value: "243 Earth days" },
      { label: "Year length", value: "225 Earth days" },
      { label: "Moons", value: "0" },
    ],
    subtitle: "The brightest object in our sky after the Sun and Moon.",
  },
  {
    slug: "earth",
    name: "Earth",
    color: "var(--planet-earth)",
    accent: "#7aa8d6",
    size: 24,
    orbit: 175,
    duration: 160,
    blurb:
      "Home. The only planet known to host life, with liquid water oceans, a protective magnetic field, and an atmosphere rich in oxygen. Earth has one large moon that stabilises its tilt and gives us tides.",
    stats: [
      { label: "Distance from Sun", value: "150 million km (1 AU)" },
      { label: "Day length", value: "24 hours" },
      { label: "Year length", value: "365.25 days" },
      { label: "Moons", value: "1" },
    ],
    subtitle: "How humans came to understand the ground beneath their feet.",
  },
  {
    slug: "mars",
    name: "Mars",
    color: "var(--planet-mars)",
    accent: "#dc7553",
    size: 18,
    orbit: 220,
    duration: 210,
    blurb:
      "The Red Planet, coloured by iron-rich dust. Mars has the tallest volcano and one of the deepest canyons in the solar system, polar ice caps, and seasonal weather. It's the most-explored planet beyond Earth, and the leading candidate for human visits.",
    stats: [
      { label: "Distance from Sun", value: "228 million km (1.52 AU)" },
      { label: "Day length", value: "24 hours 39 minutes" },
      { label: "Year length", value: "687 Earth days" },
      { label: "Moons", value: "2 (Phobos and Deimos)" },
    ],
    subtitle: "A century of mistaking optical illusions for canals.",
  },
  {
    slug: "jupiter",
    name: "Jupiter",
    color: "var(--planet-jupiter)",
    accent: "#e0bf95",
    size: 56,
    orbit: 290,
    duration: 290,
    blurb:
      "The giant of the solar system, more than twice as massive as all the other planets combined. Jupiter is a swirling ball of hydrogen and helium with a centuries-old storm, the Great Red Spot, large enough to swallow Earth. Its dozens of moons include four worlds large enough to be planets in their own right.",
    stats: [
      { label: "Distance from Sun", value: "778 million km (5.2 AU)" },
      { label: "Day length", value: "10 hours" },
      { label: "Year length", value: "12 Earth years" },
      { label: "Moons", value: "95+ (Io, Europa, Ganymede, Callisto)" },
    ],
    subtitle: "The night Galileo saw four little stars beside it.",
  },
  {
    slug: "saturn",
    name: "Saturn",
    color: "var(--planet-saturn)",
    accent: "#f3dca0",
    size: 48,
    orbit: 360,
    duration: 380,
    blurb:
      "Famous for its breathtaking rings, billions of pieces of ice and rock, from grains of sand to chunks the size of houses, sliced by gaps like the famous Cassini Division. Saturn is the second-largest planet, nearly as wide across as Jupiter, but so low in density it would float in water (if you had a big enough bathtub).",
    stats: [
      { label: "Distance from Sun", value: "1.4 billion km (9.5 AU)" },
      { label: "Day length", value: "10 hours 34 minutes" },
      { label: "Year length", value: "29 Earth years" },
      { label: "Moons", value: "270+ (Titan is the largest)" },
    ],
    subtitle: "\"Has Saturn devoured his children?\" Galileo, 1612.",
    hasRings: true,
  },
  {
    slug: "uranus",
    name: "Uranus",
    color: "var(--planet-uranus)",
    accent: "#b6e1e6",
    size: 32,
    orbit: 425,
    duration: 470,
    blurb:
      "The first planet discovered with a telescope, Uranus is a pale blue-green ice giant tipped almost completely on its side, likely the result of an ancient collision. Its seasons last 21 Earth years apiece, and its faint rings are nearly vertical.",
    stats: [
      { label: "Distance from Sun", value: "2.9 billion km (19.2 AU)" },
      { label: "Day length", value: "17 hours (rotates sideways)" },
      { label: "Year length", value: "84 Earth years" },
      { label: "Moons", value: "28" },
    ],
    subtitle: "How a sideways-spinning planet was discovered from a back garden in Bath.",
  },
  {
    slug: "neptune",
    name: "Neptune",
    color: "var(--planet-neptune)",
    accent: "#7090d3",
    size: 30,
    orbit: 485,
    duration: 560,
    blurb:
      "The most distant of the eight planets, a deep blue ice giant with the fastest winds in the solar system, blowing past 2,000 km/h. Neptune was discovered through mathematics before it was ever seen, and one orbit around the Sun takes 165 Earth years.",
    stats: [
      { label: "Distance from Sun", value: "4.5 billion km (30.1 AU)" },
      { label: "Day length", value: "16 hours" },
      { label: "Year length", value: "165 Earth years" },
      { label: "Moons", value: "16 (Triton is the largest)" },
    ],
    subtitle: "A planet found by pencil and paper before any telescope saw it.",
  },
];

export function getPlanet(slug) {
  return planets.find((p) => p.slug === slug);
}
