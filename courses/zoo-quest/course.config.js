export default {
  title: 'Zoo Quest',
  id: 'urn:uuid:4870f455-5b57-4b77-a3f0-482abd7c37f0',
  description: 'Explore a Pokémon-style zoo and fill your Zoodex.',
  language: 'en',
  branding: {
    primaryColor: '#985c20', // deep terracotta — 5.4:1 on white (AA for links + white-on-fill buttons)
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  navigation: { mode: 'free' },
  completion: { mode: 'manual' },
  scoring: { passingScore: 70 },
  export: { standard: 'web' },
  a11y: { level: 'warn', standard: 'wcag2aa' },
};
