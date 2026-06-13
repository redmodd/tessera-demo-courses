// Zoo patrons that populate a region's map: friendly visitors who greet you or share a
// "did you know" fact, plus one adversarial know-it-all who quizzes you. Appearance is
// fed to <Patron>; `home` is the tile they start on; `roam: true` ones wander nearby.

// Shared small-talk for friendly patrons. Each interaction shows one, picked at random.
export const CHATTER = {
  greetings: [
    'Lovely day at the zoo, isn’t it?',
    'Have you seen the lions yet? Magnificent creatures!',
    'Mind the tall grass — you never know who’s hiding in there.',
    'The elephants are my favourite. So gentle for their size.',
    'Welcome to the savanna, explorer. Enjoy your visit!',
  ],
  facts: [
    'Did you know? A lion’s roar can be heard up to 8 km away.',
    'Did you know? Lionesses do most of the hunting for the pride.',
    'Did you know? Lions can sleep up to 20 hours a day.',
    'Did you know? An elephant’s trunk has around 40,000 muscles.',
    'Did you know? Elephant herds are led by the oldest female — the matriarch.',
    'Did you know? Elephants flap their big ears to cool themselves down.',
  ],
};

/** A random greeting or "did you know" fact (50/50). */
export function pickChatter(rng = Math.random) {
  const pool = rng() < 0.5 ? CHATTER.greetings : CHATTER.facts;
  return pool[Math.floor(rng() * pool.length)];
}

/**
 * A random smug remark for a faced rival, from the pool matching the past outcome
 * ('won' → grudging/dismissive, anything else → gloating).
 */
export function pickSmug(rival, outcome, rng = Math.random) {
  const pool = outcome === 'won' ? rival.smug.won : rival.smug.lost;
  return pool[Math.floor(rng() * pool.length)];
}

export const PEOPLE = {
  savanna: [
    {
      id: 'maya',
      kind: 'friendly',
      name: 'Maya',
      home: { r: 10, c: 4 },
      roam: false,
      look: { skin: '#e0b48c', hair: '#5a3a22', hairStyle: 'ponytail', shirt: '#4a6f8a', trousers: '#46506b', hat: 'sun' },
    },
    {
      id: 'theo',
      kind: 'friendly',
      name: 'Theo',
      home: { r: 12, c: 6 },
      roam: true,
      look: { skin: '#8a5a3c', hair: '#1b1712', hairStyle: 'short', shirt: '#9a4b3f', trousers: '#3a3a44', hat: 'cap' },
    },
    {
      id: 'ada',
      kind: 'friendly',
      name: 'Ada',
      home: { r: 16, c: 6 },
      roam: true,
      look: { skin: '#c98a5a', hair: '#2a2018', hairStyle: 'bun', shirt: '#4e7a52', trousers: '#5a4634' },
    },
    {
      id: 'sam',
      kind: 'friendly',
      name: 'Sam',
      home: { r: 11, c: 22 },
      roam: false,
      look: { skin: '#6b4a30', hair: '#15110d', hairStyle: 'short', shirt: '#6b5a8a', trousers: '#3a3a44' },
    },
    {
      id: 'quibble',
      kind: 'rival',
      name: 'Professor Quibble',
      home: { r: 12, c: 15 },
      roam: false,
      look: { skin: '#cda07a', hair: '#8a8378', hairStyle: 'short', shirt: '#6e3b3b', trousers: '#2e2a26', hat: 'bowler', glasses: true, bowtie: true },
      intro:
        'Ah, a novice! I am Professor Quibble, and I know EVERYTHING about these beasts. I doubt you can answer even one of my questions.',
      quiz: [
        {
          question: 'When a lion walks, which part of its foot touches the ground?',
          options: ['Its heels', 'Its toes', 'Its knees', 'Its tail'],
          correct: 1,
        },
        {
          question: 'Which of these can an elephant NOT do?',
          options: ['Jump', 'Walk', 'Swim', 'Eat'],
          correct: 0,
        },
        {
          question: 'A group of elephants is sometimes called a what, besides a herd?',
          options: ['A parade', 'A pack', 'A pride', 'A flock'],
          correct: 0,
        },
        {
          question: "A lion's tongue is so rough it can do what?",
          options: ['Scrape meat off bones', 'Cut paper', 'Glow in the dark', 'Whistle'],
          correct: 0,
        },
        {
          question: 'How can elephants sense rumbles from far away?',
          options: ['By feeling vibrations through their feet and trunk', 'By smelling them', 'By tasting them', 'They cannot'],
          correct: 0,
        },
      ],
      reactions: {
        right: 'Hmph. A lucky guess.',
        wrong: 'Ha! Wrong, just as I expected.',
        win: '…Impossible. You answered every one. Hmph — perhaps you’re not entirely hopeless.',
        lose: 'Just as I thought. Come back when you’ve actually studied, novice!',
      },
      // Shown on any interaction AFTER a completed challenge — no re-quiz. Picked at
      // random from the pool matching how the player did. See pickSmug.
      smug: {
        won: [
          'Back already? You won fair and square — once. I shan’t embarrass myself again.',
          'Yes, yes, you beat me. No need to gloat, novice.',
          'The victor returns. I’ve nothing left to ask you. Hmph.',
        ],
        lost: [
          'Ah, the novice slinks back. Studied yet? I thought not.',
          'Come to lose again? I’ll spare us both the trouble.',
          'Run along. The exhibits won’t learn themselves — and clearly neither will you.',
        ],
      },
    },
  ],

  centre: [
    {
      id: 'gus',
      kind: 'friendly',
      name: 'Gus',
      home: { r: 7, c: 9 },
      roam: false,
      look: { skin: '#8a5a3c', hair: '#15110d', hairStyle: 'short', shirt: '#9a4b3f', trousers: '#46506b', hat: 'cap' },
      lines: [
        'Welcome to the gift shop! Plush lions are our best sellers.',
        'Every postcard helps support the animals — take two!',
        'We’ve got keychains, mugs, tees, and little stuffed elephants.',
        'A souvenir to remember your visit? Right this way.',
      ],
    },
  ],

  // The Discovery Center greeter: a friendly keeper standing in the middle of the room who
  // welcomes the player and points them at the exhibits. Stationary so they stay centred.
  // `sprite: 'keeper'` draws them with the Keeper sprite (peaked cap + uniform) instead of
  // the default Patron civilian look; the `look` fields are the Keeper component's props.
  discovery: [
    {
      id: 'iris',
      kind: 'friendly',
      name: 'Keeper Iris',
      home: { r: 6, c: 8 },
      roam: false,
      sprite: 'keeper',
      look: { skin: '#e0b48c', hair: '#5a3a22', hairStyle: 'ponytail', shirt: '#3f6b4a', trousers: '#4f4030', cap: '#33523a' },
      lines: [
        'Welcome to the Savanna Discovery Center! Have a look around to learn all about our animals.',
        'Welcome in! Every display here teaches you something about the savanna’s animals — explore them all.',
        'Welcome, explorer! Wander the room and read the exhibits to discover the lions and elephants of the savanna.',
        'Welcome! Take your time — each easel, case, and screen tells you more about the animals of the savanna.',
      ],
    },
  ],
};

/**
 * Grade a rival challenge. `picks[i]` is the chosen 0-based option index for
 * question `i`, or null/undefined if unanswered. The rival is only beaten when every
 * question was answered correctly — there are no retries, so a single miss loses.
 */
export function gradeRival(picks, quiz) {
  let answered = 0;
  let correctCount = 0;
  quiz.forEach((q, i) => {
    if (picks[i] == null) return;
    answered += 1;
    if (picks[i] === q.correct) correctCount += 1;
  });
  return {
    answered,
    correctCount,
    won: answered === quiz.length && correctCount === quiz.length,
  };
}
