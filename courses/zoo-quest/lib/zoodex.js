// Zoo Quest content + the shared persistence store helpers.
//
// One `usePersistence('zoodex')` object is read/written by the layout, the overworld,
// the animal pages, and the keeper page. Its shape:
//   { collected: string[], badges: string[], fieldNotes: string[],
//     map: string|null, avatar: {x,y}|null }
// Every writer goes through `updateStore` (below) so a single 'zoodex-change' event
// keeps the always-mounted HUD in sync.

// ---- Exhibit animals (the Zoodex cards) -----------------------------------------

export const ANIMALS = {
  lion: {
    id: 'lion',
    dex: '001',
    name: 'Lion',
    region: 'savanna',
    wanderMs: 1100, // how often it takes a step in its pen
    glideMs: 470, // how long each step's glide takes
    stats: 'Carnivore · lives in a pride · roar heard ~8 km',
    blurb: 'The only big cat that lives in a family group.',
    facts: [
      'Lions live in family groups called <strong>prides</strong>.',
      'The <strong>females hunt together</strong>; teamwork lets them take big prey.',
      'Males grow a <strong>mane</strong> and <strong>roar</strong> to mark their territory.',
      'They rest up to <strong>20 hours a day</strong> to save energy for the hunt.',
    ],
    // Walk-up exhibit copy (Discovery Center). Deliberately covers the themes the keeper
    // quiz tests, so a player who reads it can answer the keeper and earn the card.
    exhibit: {
      intro:
        'Lions are the only big cats that live in family groups. Read up before you meet the keeper!',
      facts: [
        'A lion family is called a <strong>pride</strong>, and they share their food and territory.',
        'Lions belong to the <strong>cat family</strong> and are <strong>carnivores</strong> — they eat meat from other animals.',
        'The <strong>females hunt as a team</strong>, stalking low and quiet so they can take prey bigger than one lion.',
        'A male grows a shaggy <strong>mane</strong>; besides looking grand, it helps protect his neck in fights.',
        'A lion’s <strong>roar</strong> can be heard about <strong>8 kilometres</strong> away — it marks territory and helps the pride find each other.',
        'A baby lion is a <strong>cub</strong>; cubs drink their mother’s milk and learn to hunt by watching and play-fighting.',
        'Most wild lions live on the <strong>African grasslands (savanna)</strong>, where their <strong>sandy coat</strong> blends into the dry grass.',
        'Lions rest <strong>up to 20 hours a day</strong> and are most active in the cooler hours of <strong>dawn and dusk</strong>.',
        'A big male can weigh about as much as <strong>two adult people</strong>, and can sprint as fast as a galloping horse in short bursts.',
      ],
    },
    // Keeper question bank — the keeper asks 10 random of these (all correct → card).
    quizBank: [
      { question: 'What is a lion family group called?', options: ['A pack', 'A pride', 'A herd', 'A troop'], correct: 1 },
      { question: 'In a pride, who does most of the hunting?', options: ['The males', 'The cubs', 'The females', 'Nobody — they scavenge'], correct: 2 },
      { question: 'What do lions mainly eat?', options: ['Grass and leaves', 'Meat from other animals', 'Fruit', 'Only insects'], correct: 1 },
      { question: "What is a male lion's fluffy neck hair called?", options: ['A beard', 'A mane', 'A ruff', 'A crest'], correct: 1 },
      { question: "How far away can a lion's roar be heard?", options: ['About 80 metres', 'About 800 metres', 'About 8 kilometres', 'About 80 kilometres'], correct: 2 },
      { question: 'How many hours a day can a lion sleep?', options: ['About 2 hours', 'About 8 hours', 'Up to 20 hours', 'Lions never sleep'], correct: 2 },
      { question: 'What is a baby lion called?', options: ['A kit', 'A cub', 'A pup', 'A calf'], correct: 1 },
      { question: 'Where do most wild lions live?', options: ['Rainforests', 'African grasslands (savanna)', 'Bare deserts', 'Snowy mountains'], correct: 1 },
      { question: 'Which lions usually grow a mane?', options: ['The females', 'The males', 'The cubs', 'All lions'], correct: 1 },
      { question: 'Why do lions roar?', options: ['To call for food', 'To mark territory and find each other', 'Because they fear water', 'To help them swim'], correct: 1 },
      { question: 'Lions belong to which animal family?', options: ['The dog family', 'The bear family', 'The cat family', 'The horse family'], correct: 2 },
      { question: 'How do lionesses usually catch prey?', options: ['Alone', 'By working together as a team', 'By climbing trees', 'By digging holes'], correct: 1 },
      { question: "What colour is a lion's coat?", options: ['Bright orange', 'Sandy gold', 'Black and white', 'Striped'], correct: 1 },
      { question: 'When are lions most active?', options: ['The hottest part of the day', 'The cooler hours of dawn and dusk', 'Only at noon', 'They never move'], correct: 1 },
      { question: 'What helps a lion blend into dry grass?', options: ['Its bright colour', 'Its sandy coat', 'Its stripes', 'Its spots'], correct: 1 },
      { question: 'About how heavy is a big male lion?', options: ['Like a house cat', 'Like a small dog', 'As much as two adult people', 'As much as an elephant'], correct: 2 },
      { question: 'What do very young lion cubs drink?', options: ['Water only', "Their mother's milk", 'Fruit juice', 'Nothing'], correct: 1 },
      { question: "Who mainly defends a pride's territory?", options: ['The cubs', 'The males', 'Nobody', 'The birds'], correct: 1 },
      { question: "What are a lion's sharp teeth for?", options: ['Grinding grass', 'Gripping and tearing meat', 'Cracking nuts', 'Brushing fur'], correct: 1 },
      { question: 'How do lions in a pride often greet each other?', options: ['By shaking paws', 'By rubbing heads and licking', 'By roaring at each other', 'By hiding'], correct: 1 },
      { question: 'What does a pride share?', options: ['Their food and territory', 'Nothing', 'Only water', 'Only their cubs'], correct: 0 },
      { question: 'What helps lions hunt after dark?', options: ['They cannot see at all', 'Good night vision', 'Echolocation like bats', 'They smell with their feet'], correct: 1 },
      { question: 'What do lionesses do for the cubs of the pride?', options: ['Ignore them', 'Help raise and feed all of them', 'Send them away', 'Nothing'], correct: 1 },
      { question: 'Besides looking grand, what does a mane do?', options: ['Protects the neck in fights', 'Helps the lion swim', 'Stores water', 'Catches food'], correct: 0 },
      { question: 'Which is TRUE about lions?', options: ['They always live alone', 'They are the only big cats that live in family groups', 'They cannot roar', 'They eat only plants'], correct: 1 },
      { question: 'What do lions do after a big meal?', options: ['Run a marathon', 'Rest for many hours', 'Climb the tallest tree', 'Swim a river'], correct: 1 },
      { question: 'How fast can a lion run in a short burst?', options: ['Walking speed', 'About as fast as a galloping horse', 'Faster than a jet', 'It cannot run'], correct: 1 },
      { question: 'Why do lions hunt as a team?', options: ['To take down prey bigger than one lion', 'To play games', 'To build nests', 'To fly'], correct: 0 },
      { question: 'How does a lioness get close to prey?', options: ['By roaring loudly', 'By stalking quietly and low', 'By flying above it', 'By honking'], correct: 1 },
      { question: 'How do cubs learn to hunt?', options: ['From books', 'By watching and play-fighting with adults', 'At school', 'Alone from birth'], correct: 1 },
    ],
  },
  elephant: {
    id: 'elephant',
    dex: '002',
    name: 'African Elephant',
    region: 'savanna',
    wanderMs: 2200, // slower and heavier than the lions
    glideMs: 900,
    stats: 'Herbivore · herd led by the oldest female · biggest on land',
    blurb: 'The biggest animal that walks the Earth.',
    facts: [
      'The <strong>largest land animal</strong> on Earth.',
      'Its <strong>trunk</strong> has tens of thousands of muscles — it breathes, smells, drinks, and grabs a single blade of grass with it.',
      'Big <strong>ears flap like fans</strong> to cool down.',
      'Herds follow the oldest female, the <strong>matriarch</strong>, who remembers where water is.',
    ],
    // Walk-up exhibit copy (Discovery Center). Deliberately covers the themes the keeper
    // quiz tests, so a player who reads it can answer the keeper and earn the card.
    exhibit: {
      intro:
        'The African elephant is the biggest animal that walks the Earth. Read up before you meet the keeper!',
      facts: [
        'The African elephant is the <strong>largest land animal</strong> on Earth — an adult can weigh as much as <strong>several cars</strong>.',
        'Its <strong>trunk</strong> has <strong>tens of thousands of muscles</strong>: it breathes, smells, drinks, trumpets, greets family, and is gentle enough to pick up a single blade of grass.',
        'Elephants are <strong>herbivores</strong>, eating plants like grass, leaves, and bark.',
        'A herd is mostly <strong>females and their young</strong>, led by the oldest female — the <strong>matriarch</strong> — who remembers where water is, even in a drought.',
        'A baby elephant is a <strong>calf</strong>; the mother is pregnant for almost <strong>two years</strong>, and the whole herd helps protect the young.',
        'Big <strong>ears flap like fans</strong> to release heat and cool the elephant down.',
        'The long white <strong>tusks</strong> are really very long <strong>teeth</strong>, used to dig for water and strip bark.',
        'A loud <strong>trumpet</strong> call carries across long distances, and elephants rely on <strong>smell and hearing</strong> to find food and family.',
        'They drink <strong>many buckets of water a day</strong> and coat themselves in <strong>mud and dust</strong> to block the sun and biting bugs.',
      ],
    },
    // Keeper question bank — the keeper asks 10 random of these (all correct → card).
    quizBank: [
      { question: 'What does an elephant use its trunk for?', options: ['Only drinking', 'Breathing, smelling, drinking and grabbing food', 'Only trumpeting', 'Only hearing'], correct: 1 },
      { question: 'Who leads an elephant herd?', options: ['The largest male', 'The youngest calf', 'The oldest female (the matriarch)', 'They take turns'], correct: 2 },
      { question: 'What is the largest land animal on Earth?', options: ['The lion', 'The African elephant', 'The giraffe', 'The hippo'], correct: 1 },
      { question: 'Why do elephants flap their big ears?', options: ['To fly', 'To cool themselves down', 'To dig', 'To swim'], correct: 1 },
      { question: 'What is a baby elephant called?', options: ['A cub', 'A calf', 'A foal', 'A kit'], correct: 1 },
      { question: 'What do elephants mainly eat?', options: ['Meat', 'Plants like grass, leaves and bark', 'Fish', 'Insects'], correct: 1 },
      { question: 'What do we call the female who leads the herd?', options: ['The matriarch', 'The alpha', 'The queen', 'The captain'], correct: 0 },
      { question: "An elephant's long white tusks are really very long...?", options: ['Claws', 'Teeth', 'Horns', 'Nails'], correct: 1 },
      { question: 'How do elephants greet family and friends?', options: ['By touching with their trunks', 'By roaring', 'By hiding', 'By spitting'], correct: 0 },
      { question: 'What do elephants use to dig for water or strip bark?', options: ['Their ears', 'Their tusks', 'Their tails', 'Their feet only'], correct: 1 },
      { question: 'About how much can an adult elephant weigh?', options: ['Like a big dog', 'Like a small car', 'As much as several cars', 'Like a mouse'], correct: 2 },
      { question: 'How do elephants protect their skin from the sun?', options: ['They wear hats', 'They spray water and dust on themselves', 'They eat ice', 'They stay underground'], correct: 1 },
      { question: 'What helps an elephant remember where water is?', options: ['Its great memory', 'Its tusks', 'Its tail', 'It cannot remember'], correct: 0 },
      { question: 'An elephant herd is mostly made up of...?', options: ['Adult males only', 'Females and their young', 'Only babies', 'Birds'], correct: 1 },
      { question: "About how many muscles are in an elephant's trunk?", options: ['Just a few', 'About one hundred', 'Tens of thousands', 'None'], correct: 2 },
      { question: 'What sound do elephants make to call across long distances?', options: ['A trumpet call', 'A meow', 'A bark', 'They are silent'], correct: 0 },
      { question: 'How much water can an elephant drink in a day?', options: ['A cup', 'A small bottle', 'Many buckets (over 100 litres)', 'None'], correct: 2 },
      { question: 'Why do elephants coat themselves in mud?', options: ['They eat the mud', 'To block sun and biting bugs', 'To build houses', 'They avoid mud'], correct: 1 },
      { question: 'How do baby elephants stay safe?', options: ['They live alone', 'The whole herd helps protect them', 'They hide underground', 'They fly away'], correct: 1 },
      { question: "An elephant's trunk can be gentle enough to do what?", options: ['Pick up a single blade of grass', 'Only smash things', 'Nothing small', 'Lift a car'], correct: 0 },
      { question: 'How do elephants help other animals in their habitat?', options: ['By spreading seeds and clearing paths', 'By scaring everyone away', 'They do not help', 'By building fences'], correct: 0 },
      { question: 'Which senses do elephants rely on most to find food and family?', options: ['Smell and hearing', 'Only sight', 'Only taste', 'None'], correct: 0 },
      { question: 'How does an elephant show it is excited or upset?', options: ['Flapping its ears and trumpeting', 'Sitting perfectly still', 'Changing colour', 'Glowing'], correct: 0 },
      { question: "What is special about an elephant's ears?", options: ['They are tiny', 'They are large and help release heat', 'They glow', 'They are used to dig'], correct: 1 },
      { question: 'How long is an elephant pregnant before a calf is born?', options: ['A few weeks', 'About 9 months', 'Almost 2 years', 'Ten years'], correct: 2 },
      { question: 'What do young elephants drink from their mothers?', options: ['Water', 'Milk', 'Juice', 'Mud'], correct: 1 },
      { question: 'How do elephants usually travel?', options: ['Alone always', 'In family herds', 'In pairs only', 'By flying'], correct: 1 },
      { question: 'What might a matriarch do during a drought?', options: ['Lead the herd to remembered water', 'Give up', 'Hide alone', 'Sleep all day'], correct: 0 },
      { question: 'Elephants are herbivores, which means they eat...?', options: ['Meat', 'Plants', 'Rocks', 'Plastic'], correct: 1 },
      { question: 'Which two features make elephants easy to recognise?', options: ['Their trunk and big ears', 'Their wings', 'Their stripes', 'Their shell'], correct: 0 },
    ],
  },
};

/**
 * Pick `n` questions from `bank` at random (Fisher–Yates on indices). Each returned
 * item is the question plus `n`: its 1-based position in the original bank, so callers
 * can build a stable LMS interaction id that survives re-rolls. `n >= bank.length`
 * returns the whole bank (shuffled). `rng` is injectable for deterministic tests.
 */
export function drawQuestions(bank, n, rng = Math.random) {
  const idx = bank.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, n).map((i) => ({ ...bank[i], n: i + 1 }));
}

/** Animal ids belonging to a region, e.g. regionAnimals('savanna') → ['lion','elephant']. */
export const regionAnimals = (regionId) =>
  Object.values(ANIMALS)
    .filter((a) => a.region === regionId)
    .map((a) => a.id);

// ---- Regions (badges) -----------------------------------------------------------

export const REGIONS = {
  savanna: {
    id: 'savanna',
    name: 'Savanna',
    badgeLabel: 'Savanna Badge',
  },
};

// ---- Keepers --------------------------------------------------------------------
// Appearance per animal's keeper, fed to <Keeper>. Keepers all wear the same staff
// uniform (safari khaki shirt/trousers/cap); they read as different people through
// skin tone and hair style (gender presentation), not their clothing.

const KEEPER_UNIFORM = {
  shirt: '#a78a52', // safari khaki
  trousers: '#6b5836',
  cap: '#5e4f30',
};

export const KEEPERS = {
  lion: {
    skin: '#c98a5a',
    hair: '#33271a',
    hairStyle: 'short',
    ...KEEPER_UNIFORM,
  },
  elephant: {
    skin: '#7c4f33',
    hair: '#1b1712',
    hairStyle: 'ponytail',
    ...KEEPER_UNIFORM,
  },
};

// ---- Path encounters (hidden Zoodex animals) ------------------------------------
// Found by exploring grass, not by visiting a keeper. Completing the (no-wrong-answer)
// interaction collects the animal into the Zoodex — it counts toward the Zoodex total
// (TOTAL_ANIMALS) but, since it's not in ANIMALS, awards no region badge. Each entry
// carries both the interaction (setup/choices/note) and Zoodex card fields (dex/stats/
// facts/blurb) so the overlay can reveal a card on collection.

export const ENCOUNTERS = {
  squirrel: {
    id: 'squirrel',
    name: 'Squirrel',
    dex: '003',
    stats: 'Rodent · caches food · agile climber',
    blurb: 'A tiny gardener that plants forests by forgetting its snacks.',
    facts: [
      'Squirrels <strong>bury extra food</strong> to save for leaner days.',
      'Forgotten stashes <strong>grow into new trees</strong> — accidental gardeners!',
      "Hiding food this way is called <strong>caching</strong>.",
      'They <strong>zigzag and leap</strong> many times their body length to escape.',
    ],
    setup: 'A Squirrel darts up and snatches a snack from your bag!',
    choices: [
      {
        label: 'Let it have it',
        reply:
          'Generous. Squirrels <strong>bury extra food</strong> for later — and forget some, which grows into new trees. Tiny gardeners!',
      },
      {
        label: 'Chase it',
        reply:
          'No chance. Squirrels zigzag and leap many times their length. Gone — with your granola.',
      },
      {
        label: 'Offer it a nut',
        reply:
          "It takes it and immediately buries it. That's called <strong>caching</strong>.",
      },
    ],
    note: 'Squirrel — caches food; forgotten stashes grow into trees.',
  },
};

// Everything the player can actually collect: the keeper exhibits (ANIMALS) plus the
// hidden grass animals (ENCOUNTERS). Derived so the HUD count (X / TOTAL_ANIMALS) and the
// completion target stay correct as animals are added — completion fires once all are in.
export const TOTAL_ANIMALS = Object.keys(ANIMALS).length + Object.keys(ENCOUNTERS).length;

// The full collectable set as one dex-ordered list, for the Zoodex modal to iterate.
// ANIMALS and ENCOUNTERS entries share the card fields (id/dex/name/stats/facts/
// blurb), so every entry renders through <ZoodexCard>. Sorted by dex so the grid reads
// #001, #002, #003…; its length equals TOTAL_ANIMALS.
export const ALL_CARDS = [...Object.values(ANIMALS), ...Object.values(ENCOUNTERS)].sort(
  (a, b) => a.dex.localeCompare(b.dex),
);

// ---- Store helpers --------------------------------------------------------------

const EVENT = 'zoodex-change';

/** Read the store, with every field defaulted so callers never see `undefined`. */
export function readStore(store) {
  const s = store.get() ?? {};
  return {
    collected: s.collected ?? [],
    badges: s.badges ?? [],
    fieldNotes: s.fieldNotes ?? [],
    map: s.map ?? null,
    avatar: s.avatar ?? null,
  };
}

/**
 * Apply an immutable update and persist it, then nudge the HUD. `fn` receives the
 * fully-defaulted current state and returns the next state.
 *   updateStore(store, s => ({ ...s, collected: [...s.collected, 'lion'] }))
 */
export function updateStore(store, fn) {
  const next = fn(readStore(store));
  store.set(next);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT));
  }
  return next;
}

/** Subscribe to store changes (e.g. the HUD). Returns an unsubscribe function. */
export function onStoreChange(handler) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

const addUnique = (arr, id) => (arr.includes(id) ? arr : [...arr, id]);

/**
 * Collect an animal's card (idempotent) and, if that completes its region — every
 * animal of the region now collected — award the region badge in the same write. This
 * one helper owns the "badge when the region is done" rule so callers don't repeat it.
 */
export const collect = (store, animalId) =>
  updateStore(store, (s) => {
    const collected = addUnique(s.collected, animalId);
    const region = ANIMALS[animalId]?.region;
    const done = region && regionAnimals(region).every((id) => collected.includes(id));
    return {
      ...s,
      collected,
      badges: done ? addUnique(s.badges, region) : s.badges,
    };
  });

/** Add a region id to `badges` (idempotent). */
export const earnBadge = (store, id) =>
  updateStore(store, (s) => ({ ...s, badges: addUnique(s.badges, id) }));

/** Add an encounter id to `fieldNotes` (idempotent). */
export const logFieldNote = (store, id) =>
  updateStore(store, (s) => ({ ...s, fieldNotes: addUnique(s.fieldNotes, id) }));
