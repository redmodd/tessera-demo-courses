// `home` is the tile a patron starts on; `roam: true` ones wander nearby.
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

export function pickChatter(rng = Math.random) {
  const pool = rng() < 0.5 ? CHATTER.greetings : CHATTER.facts;
  return pool[Math.floor(rng() * pool.length)];
}

export function pickSmug(rival, outcome, rng = Math.random) {
  const pool = outcome === 'won' ? rival.smug.won : rival.smug.lost;
  return pool[Math.floor(rng() * pool.length)];
}

export const PEOPLE = {
  plaza: [
    {
      id: 'pip',
      kind: 'friendly',
      name: 'Pip',
      home: { r: 2, c: 7 },
      roam: true,
      look: { skin: '#e8c49a', hair: '#3a2a1a', hairStyle: 'bun', shirt: '#4a7a8a', trousers: '#4a5060' },
    },
    {
      id: 'nora',
      kind: 'friendly',
      name: 'Nora',
      home: { r: 2, c: 22 },
      roam: false,
      look: { skin: '#c47a4a', hair: '#1a150f', hairStyle: 'ponytail', shirt: '#d06040', trousers: '#3a3a44', hat: 'sun' },
    },
    {
      id: 'lena',
      kind: 'friendly',
      name: 'Lena',
      home: { r: 6, c: 8 },
      roam: false,
      look: { skin: '#d4a074', hair: '#8a6030', hairStyle: 'ponytail', shirt: '#e8d040', trousers: '#4a5a4a', hat: 'cap' },
      lines: [
        'Scoops, sundaes, and our special Savanna Swirl — perfect for a hot day!',
        'Try the Elephant Tracks — chocolate chunks and peanut butter swirls. A crowd favourite.',
        'Nothing beats an ice cream by the fountain. What can I get you?',
        'The Mango Roar is new this week — mango sorbet with a chilli kick. Dare you!',
      ],
    },
    {
      id: 'rosa',
      kind: 'friendly',
      name: 'Rosa',
      home: { r: 6, c: 23 },
      roam: false,
      look: { skin: '#e8b080', hair: '#4a2a10', hairStyle: 'ponytail', shirt: '#5ab84a', trousers: '#3a4048' },
      lines: [
        'Fresh-squeezed lemonade, iced tea, and our famous Jungle Punch — get yours!',
        'The Jungle Punch has mango, passionfruit, and a secret ingredient. Very popular!',
        'Nothing beats a cold drink on a day like this. What can I get you?',
        'We also have sparkling water if you want something lighter. Staying hydrated is important at the zoo!',
      ],
    },
    {
      id: 'ed',
      kind: 'friendly',
      name: 'Ed',
      home: { r: 13, c: 23 },
      roam: false,
      look: { skin: '#c8785a', hair: '#2a1810', hairStyle: 'short', shirt: '#4a5ab4', trousers: '#3a3844' },
      lines: [
        'Plush lions, elephant keychains, snow globes — perfect souvenirs!',
        'The stuffed lion is our best seller. Honestly, I want one myself.',
        'Looking for a gift? The elephant keychain is cute and fits any budget.',
        'Everything here is zoo-exclusive — you can\'t get these anywhere else!',
      ],
    },
    {
      id: 'felix',
      kind: 'friendly',
      name: 'Felix',
      home: { r: 6, c: 20 },
      roam: true,
      look: { skin: '#b07840', hair: '#1a1510', hairStyle: 'short', shirt: '#e04020', trousers: '#3a3040', hat: 'cap' },
      lines: [
        'Balloons! Lion, elephant, giraffe — pick your favourite animal!',
        'Get a balloon before they float away! I only have so many.',
        'Elephant-shaped balloons are the best sellers today. Very popular with the little ones.',
        'A giraffe balloon is perfect — just like the real thing, very hard to miss!',
      ],
    },
    {
      id: 'cleo',
      kind: 'friendly',
      name: 'Cleo',
      home: { r: 7, c: 21 },
      roam: false,
      look: { skin: '#a06840', hair: '#2a1a0a', hairStyle: 'bun', shirt: '#506a8a', trousers: '#3a3038' },
      lines: [
        'The light by the fountain is gorgeous right now. I\'ve already taken two hundred shots.',
        'I\'m the official zoo photographer. Smile and I might feature you in the newsletter!',
        'The trick to a great animal photo? Patience. I once waited three hours for a lion to yawn.',
        'Tip from a pro: crouch down to the animal\'s eye level. Changes everything.',
      ],
    },
    {
      id: 'raj',
      kind: 'friendly',
      name: 'Raj',
      home: { r: 11, c: 6 },
      roam: true,
      look: { skin: '#7a4a28', hair: '#100c08', hairStyle: 'short', shirt: '#3a6a4a', trousers: '#3a3a4a' },
    },
    {
      id: 'jen',
      kind: 'friendly',
      name: 'Jen',
      home: { r: 8, c: 8 },
      roam: false,
      look: { skin: '#d8a07a', hair: '#2a1810', hairStyle: 'short', shirt: '#e07030', trousers: '#4a3a28', hat: 'cap' },
      lines: [
        'Pretzels, popcorn, fruit cups — proper fuel for a full day at the zoo!',
        'The caramel popcorn is fresh. Still warm!',
        'Cheesy pretzel or plain? Both are good, but the cheese is better. I\'m just saying.',
        'Keep your energy up — there\'s a lot of zoo left to explore!',
      ],
    },
    {
      id: 'walt',
      kind: 'rival',
      name: 'Walt',
      home: { r: 17, c: 14 },
      roam: false,
      look: { skin: '#b8845a', hair: '#8a8074', hairStyle: 'short', shirt: '#8a7a4a', trousers: '#4a4438', hat: 'cap' },
      intro:
        'Forty years I kept animals at this zoo. Forty years. Now I watch tourists wander past without a clue. You think you know animals? Let\'s find out.',
      quiz: [
        {
          question: "A lion yawns wide and bares its teeth at a rival. What's it communicating?",
          options: ["It's tired", "It's hungry", 'A threat or dominance display', 'A friendly greeting'],
          correct: 2,
        },
        {
          question: 'An elephant keeps splashing mud on its back at the water hole. What\'s the main reason?',
          options: ['It enjoys playing in water', 'Mud acts as sunscreen and repels insects', "It's marking its territory", "It's trying to attract a mate"],
          correct: 1,
        },
        {
          question: "A lion cub keeps batting and pouncing at its mother's tail. What is this?",
          options: ['Aggression toward the mother', 'A sign of hunger', 'Play — how cubs develop hunting skills', 'Asking to be groomed'],
          correct: 2,
        },
        {
          question: 'An elephant in the enclosure keeps rocking and swaying the same way, over and over. What does this signal?',
          options: ['Excitement and happiness', "It's about to charge", "It's preparing to sleep", 'Stress or boredom — a behaviour called stereotypy'],
          correct: 3,
        },
        {
          question: "At the morning feed you notice an elephant standing apart from its herd. As a keeper, what's your first concern?",
          options: ['Give it extra food', 'Call the vet — social separation often signals illness or injury', 'Leave it alone to rest', 'Move it to a different enclosure'],
          correct: 1,
        },
      ],
      reactions: {
        right: 'Hm. Not bad.',
        wrong: "Wrong. That's why you're not a keeper.",
        win: "...You know your animals. I'll give you that. Don't let it go to your head.",
        lose: "Just as I thought. Come back when you've put in the hours.",
      },
      smug: {
        won: [
          "You earned it. Still wouldn't hire you, but you earned it.",
          "Fine. You know your animals. Doesn't mean you know the zoo.",
          "I've said my piece. Go enjoy yourself.",
        ],
        lost: [
          "Still haven't cracked a book, I see.",
          'The animals could tell you if you\'d just watch them.',
          "Don't waste my time unless you're ready to learn.",
        ],
      },
    },
  ],

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
      id: 'vendor',
      kind: 'friendly',
      name: 'Marco',
      home: { r: 17, c: 24 },
      roam: false,
      look: { skin: '#c8813a', hair: '#2a1810', hairStyle: 'short', shirt: '#d4821a', trousers: '#4a3a28', hat: 'cap' },
      lines: [
        'Samosas, peanuts, iced drinks — all local recipes! Help yourself.',
        'The mango lemonade is our top seller. Perfect for a hot savanna day.',
        'Keeping your energy up is important on a long zoo day. What can I get you?',
        "Fresh roasted peanuts — the elephants don't share theirs, so I brought my own!",
      ],
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
      // Shown on any interaction after a completed challenge — no re-quiz. See pickSmug.
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

  // `sprite: 'keeper'` draws them with the Keeper sprite; `look` then takes Keeper's props.
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

  polar: [
    {
      id: 'aleksy',
      kind: 'friendly',
      name: 'Dr. Aleksy',
      // c20, not c19: the tent canvas rises above its own tiles and sprites draw over decor,
      // so standing him there put him on the roof.
      home: { r: 19, c: 20 },
      roam: false,
      sprite: 'keeper',
      look: { skin: '#d9b48f', hair: '#4a4038', hairStyle: 'short', shirt: '#2f5f8a', trousers: '#33414f', cap: '#24455f' },
      lines: [
        'This tent is our field camp. We watch the weather from here — and the ice itself tells us the rest.',
        'That mast with the spinning cups measures the wind and the cold, day and night, even when nobody is out here.',
        'We drill cores of ice, like a straw in a cake. Each layer froze in a different year, so the ice remembers hundreds of winters.',
        'Everything we learn out here ends up on the displays in the Research Station, up the path to the north. Go and have a look!',
      ],
    },
    {
      id: 'nina',
      kind: 'friendly',
      name: 'Nina',
      home: { r: 10, c: 4 },
      roam: false,
      look: { skin: '#e0b48c', hair: '#5a3a22', hairStyle: 'bun', shirt: '#3a6ea5', trousers: '#3a3a4a', hat: 'cap' },
    },
    {
      id: 'omar',
      kind: 'friendly',
      name: 'Omar',
      home: { r: 12, c: 5 },
      roam: true,
      look: { skin: '#8a5a3c', hair: '#1b1712', hairStyle: 'short', shirt: '#b23b3b', trousers: '#2e3a4a', hat: 'cap' },
    },
    {
      id: 'yuki',
      kind: 'friendly',
      name: 'Yuki',
      home: { r: 16, c: 10 },
      roam: true,
      look: { skin: '#e8c49a', hair: '#2a2018', hairStyle: 'ponytail', shirt: '#4e8a72', trousers: '#3a4658' },
    },
    {
      id: 'ben',
      kind: 'friendly',
      name: 'Ben',
      home: { r: 8, c: 18 },
      roam: false,
      look: { skin: '#6b4a30', hair: '#15110d', hairStyle: 'short', shirt: '#5a5a8a', trousers: '#34405a', hat: 'cap' },
    },
    {
      id: 'vendor-polar',
      kind: 'friendly',
      name: 'Pia',
      // She stands on the serving side of the hut, so walking down the west path bumps her.
      // There is no sign here — her lines are the hut's introduction.
      home: { r: 21, c: 7 },
      roam: false,
      look: { skin: '#d49a6a', hair: '#3a2418', hairStyle: 'ponytail', shirt: '#c0392b', trousers: '#3a3a4a', hat: 'cap' },
      lines: [
        'Hot cocoa, cinnamon buns, maple toffee — everything to warm you up!',
        'The cocoa has a marshmallow snowman on top. Cutest drink in the zoo.',
        'Cold out on the ice, isn’t it? A warm cup does wonders. What can I get you?',
        'The penguins keep eyeing my fish rolls. Sorry, penguins — these are for visitors!',
      ],
    },
    {
      id: 'glacier',
      kind: 'rival',
      name: 'Madame Glacier',
      home: { r: 15, c: 23 },
      roam: false,
      look: { skin: '#d8c0b0', hair: '#cdd6de', hairStyle: 'bun', shirt: '#2e5a8a', trousers: '#2a2e3a', hat: 'bowler', glasses: true, bowtie: true },
      intro:
        'A wanderer on MY ice? I am Madame Glacier, and the poles hold no secret from me. I wager you can’t answer a single question correctly.',
      quiz: [
        {
          question: 'When a polar bear hunts, which sense matters most?',
          options: ['Sight', 'Smell', 'Taste', 'Hearing'],
          correct: 1,
        },
        {
          question: 'Which of these can a penguin NOT do?',
          options: ['Swim', 'Walk', 'Fly through the air', 'Huddle for warmth'],
          correct: 2,
        },
        {
          question: 'A group of penguins on land is sometimes called a what?',
          options: ['A waddle', 'A pride', 'A pack', 'A flock'],
          correct: 0,
        },
        {
          question: 'A polar bear’s fur is not really white. What is it?',
          options: ['Blue', 'Grey', 'See-through', 'Painted'],
          correct: 2,
        },
        {
          question: 'Penguins and polar bears live at opposite poles. Which lives in the NORTH?',
          options: ['The penguin', 'The polar bear', 'Both of them', 'Neither of them'],
          correct: 1,
        },
      ],
      reactions: {
        right: 'Hmph. A lucky guess.',
        wrong: 'Ha! Frozen solid, just as I expected.',
        win: '…Astonishing. Every answer correct. Perhaps the ice has finally met its match.',
        lose: 'Just as I thought. Come back when you’ve thawed out that brain of yours!',
      },
      smug: {
        won: [
          'Back already? You bested me once. I shan’t risk it twice.',
          'Yes, yes, you won. No need to rub it in, wanderer.',
          'The champion of the cold returns. I’ve nothing left to ask. Hmph.',
        ],
        lost: [
          'Ah, the wanderer slinks back across my ice. Studied yet? I thought not.',
          'Come to lose again? I’ll spare us both the frostbite.',
          'Run along. The exhibits won’t learn themselves — and clearly neither will you.',
        ],
      },
    },
  ],

  'polar-discovery': [
    {
      id: 'frost',
      kind: 'friendly',
      name: 'Keeper Frost',
      home: { r: 6, c: 8 },
      roam: false,
      sprite: 'keeper',
      look: { skin: '#8a5a3c', hair: '#15110d', hairStyle: 'short', shirt: '#3a6ea5', trousers: '#2e3a4a', cap: '#28455f' },
      lines: [
        'Welcome to the Polar Research Station! Have a look around to learn all about our animals.',
        'Welcome in! Every display here teaches you something about the penguins and polar bears — explore them all.',
        'Welcome, explorer! Wander the room and read the exhibits to discover life at the freezing poles.',
        'Welcome! Take your time — each easel, case, and screen tells you more about the animals of the ice.',
      ],
    },
  ],
};

// The rival is beaten only on a clean sweep; `picks[i]` is null/undefined if unanswered.
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
