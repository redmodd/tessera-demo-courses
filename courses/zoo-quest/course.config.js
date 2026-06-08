export default {
  title: 'Zoo Quest',
  description: 'Explore a Pokémon-style zoo and fill your Zoodex.',
  language: 'en',
  branding: {
    primaryColor: '#985c20', // deep terracotta — 5.4:1 on white (AA for links + white-on-fill buttons)
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  navigation: { mode: 'free' },
  // Prototype: completion isn't wired yet (no Zoodex), so manual mode just prints a
  // harmless "completion never fired" dev warning after 60s. Faithful to the plan.
  completion: { mode: 'manual' },
  scoring: { passingScore: 70 },
  export: { standard: 'web' },
  a11y: { level: 'warn', standard: 'wcag2aa' },
};
