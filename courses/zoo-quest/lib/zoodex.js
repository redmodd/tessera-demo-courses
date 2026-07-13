// The `usePersistence('zoodex')` store, shared by the layout, overworld, and keepers:
//   { collected: string[], badges: string[], map: string|null, avatar: {x,y}|null }
// Write it through `updateStore` so the always-mounted HUD gets its 'zoodex-change' event.

export const ANIMALS = {
  lion: {
    id: 'lion',
    dex: '001',
    name: 'Lion',
    region: 'savanna',
    wanderMs: 1100,
    glideMs: 470,
    stats: 'Carnivore · lives in a pride · roar heard ~8 km',
    blurb: 'The only big cat that lives in a family group.',
    facts: [
      'Lions live in family groups called <strong>prides</strong>.',
      'The <strong>females hunt together</strong>; teamwork lets them take big prey.',
      'Males grow a <strong>mane</strong> and <strong>roar</strong> to mark their territory.',
      'They rest up to <strong>20 hours a day</strong> to save energy for the hunt.',
    ],
    // `type` selects the on-map art (InteriorDecor) and the overlay layout (ExhibitOverlay).
    exhibit: {
      displays: {
        pride: {
          type: 'poster',
          title: 'Life in the Pride',
          intro: 'Lions are the only big cats that live in family groups.',
          facts: [
            'A lion family is called a <strong>pride</strong>, and they share their food and territory.',
            'Prides greet one another by <strong>rubbing heads</strong> and licking.',
            'A baby lion is a <strong>cub</strong>; the whole pride helps raise and feed the cubs.',
          ],
        },
        diet: {
          type: 'diet',
          title: 'Hunters of the Grassland',
          intro: 'Lions belong to the cat family and are <strong>carnivores</strong> — they eat meat.',
          facts: [
            'The <strong>females hunt as a team</strong>, stalking low and quiet to take prey bigger than one lion.',
            'Sharp <strong>teeth</strong> grip and tear meat, and good night vision helps them hunt at dusk.',
            'They are most active in the cooler hours of <strong>dawn and dusk</strong>.',
          ],
        },
        size: {
          type: 'size',
          title: 'How Big Is a Lion?',
          intro: 'Powerful cats built for short, explosive bursts of speed.',
          facts: [
            'A big male weighs about as much as <strong>two adult people</strong>.',
            'In a sprint a lion runs about as fast as a <strong>galloping horse</strong> — but only briefly.',
          ],
        },
        roar: {
          type: 'touchscreen',
          title: 'Did You Know?',
          question: 'How far away can a lion’s roar be heard?',
          answer:
            'About <strong>8 kilometres</strong>! A roar marks territory and helps the pride find each other. Between hunts, a lion may rest <strong>up to 20 hours a day</strong>.',
        },
        build: {
          type: 'specimen',
          title: 'Built to Hunt',
          specimen: 'Mane & claws',
          intro: 'A closer look at a lion’s body.',
          facts: [
            'A male grows a shaggy <strong>mane</strong> — it looks grand and protects his neck in fights.',
            'A <strong>sandy coat</strong> blends into dry grass for sneaking up on prey.',
            'Strong paws and <strong>claws</strong>, plus meat-tearing teeth, make the lion a top hunter.',
          ],
        },
        range: {
          type: 'map',
          title: 'Where Lions Live',
          region: 'African savanna',
          intro: 'Most wild lions live on the African grasslands.',
          facts: [
            'They roam the open <strong>savanna</strong>, where a sandy coat is perfect camouflage.',
            'Grasslands give them space to hunt and tall grass to hide in.',
          ],
        },
      },
    },
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
    wanderMs: 2200,
    glideMs: 900,
    stats: 'Herbivore · herd led by the oldest female · biggest on land',
    blurb: 'The biggest animal that walks the Earth.',
    facts: [
      'The <strong>largest land animal</strong> on Earth.',
      'Its <strong>trunk</strong> has tens of thousands of muscles — it breathes, smells, drinks, and grabs a single blade of grass with it.',
      'Big <strong>ears flap like fans</strong> to cool down.',
      'Herds follow the oldest female, the <strong>matriarch</strong>, who remembers where water is.',
    ],
    // `type` selects the on-map art (InteriorDecor) and the overlay layout (ExhibitOverlay).
    exhibit: {
      displays: {
        herd: {
          type: 'poster',
          title: 'The Herd',
          intro: 'Elephants live in close family herds.',
          facts: [
            'A herd is mostly <strong>females and their young</strong>, led by the oldest female — the <strong>matriarch</strong>.',
            'The matriarch <strong>remembers where water is</strong>, even in a drought.',
            'A baby is a <strong>calf</strong>; the whole herd helps protect the young.',
          ],
        },
        diet: {
          type: 'diet',
          title: 'A Plant-Powered Giant',
          intro: 'Elephants are <strong>herbivores</strong> — they eat only plants.',
          facts: [
            'They munch <strong>grass, leaves, and bark</strong> for many hours a day.',
            'They drink <strong>many buckets of water</strong> daily and coat themselves in <strong>mud and dust</strong> to block the sun and biting bugs.',
          ],
        },
        size: {
          type: 'size',
          title: 'The Biggest on Land',
          intro: 'The largest animal that walks the Earth.',
          facts: [
            'An adult can weigh as much as <strong>several cars</strong>.',
            'It towers over a person — the biggest land animal alive today.',
          ],
        },
        ears: {
          type: 'touchscreen',
          title: 'Did You Know?',
          question: 'Why do elephants flap their big ears?',
          answer:
            'To <strong>cool down</strong> — the ears work like fans, releasing heat on a hot day.',
        },
        tusks: {
          type: 'specimen',
          title: 'Tusks & Trunk',
          specimen: 'Tusk (a giant tooth)',
          intro: 'Two amazing tools an elephant is born with.',
          facts: [
            'The long white <strong>tusks</strong> are really very long <strong>teeth</strong> — used to dig for water and strip bark.',
            'The <strong>trunk</strong> has tens of thousands of muscles: it breathes, smells, drinks, trumpets, and can pick up a single blade of grass.',
          ],
        },
        range: {
          type: 'map',
          title: 'Where Elephants Live',
          region: 'African savanna',
          intro: 'African elephants roam the grasslands and woodlands.',
          facts: [
            'They travel long distances across the <strong>savanna</strong> in search of food and water.',
            'A loud <strong>trumpet</strong> call carries across the open plains to keep the herd together.',
          ],
        },
      },
    },
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
  penguin: {
    id: 'penguin',
    dex: '004',
    name: 'Penguin',
    region: 'polar',
    wanderMs: 900,
    glideMs: 420,
    stats: 'Eats fish & krill · lives in the far South · a flightless bird',
    blurb: 'A bird that swims instead of flies.',
    facts: [
      'A <strong>bird that cannot fly</strong> through the air — but it "<strong>flies</strong>" underwater.',
      'They <strong>huddle together</strong> for warmth, taking turns on the cold outside edge.',
      'Emperor penguin <strong>dads balance the egg on their feet</strong> through the winter.',
      'Black-and-white colouring is <strong>camouflage</strong> from above and below.',
    ],
    // `type` selects the on-map art (InteriorDecor) and the overlay layout (ExhibitOverlay).
    exhibit: {
      displays: {
        colony: {
          type: 'poster',
          title: 'Life in the Colony',
          intro: 'Penguins live together in huge groups.',
          facts: [
            'A big group of penguins is called a <strong>colony</strong> (a breeding group is a <strong>rookery</strong>).',
            'To beat the cold they <strong>huddle tightly together</strong>, taking turns on the freezing outside edge so everyone stays warm.',
            'A baby penguin is a <strong>chick</strong>, and <strong>both parents</strong> help feed and protect it.',
          ],
        },
        diet: {
          type: 'diet',
          title: 'Hunters of the Sea',
          intro: 'Penguins are <strong>carnivores</strong> — they hunt food in the ocean.',
          facts: [
            'They eat <strong>fish, krill, and squid</strong>, chasing them down underwater.',
            'They have <strong>no teeth</strong>; a spiny tongue and beak grip slippery prey so it can be swallowed whole.',
            'Penguins can <strong>drink seawater</strong> — a special gland near the eyes removes the salt.',
          ],
        },
        size: {
          type: 'size',
          title: 'How Big Is a Penguin?',
          intro: 'Penguins come in many sizes.',
          facts: [
            'The <strong>emperor penguin</strong> is the tallest — about as tall as a <strong>six-year-old child</strong>.',
            'The <strong>little blue penguin</strong> is the smallest, only about as tall as a ruler.',
          ],
        },
        swim: {
          type: 'touchscreen',
          title: 'Did You Know?',
          question: 'If a penguin can’t fly, how does it move so fast?',
          answer:
            'It "<strong>flies</strong>" underwater! Its wings are stiff <strong>flippers</strong> and its body is smooth and streamlined, so it shoots through the sea after fish.',
        },
        build: {
          type: 'specimen',
          title: 'Built for the Cold',
          specimen: 'Feathers & blubber',
          intro: 'A closer look at how a penguin stays warm and dry.',
          facts: [
            'Dense, <strong>waterproof feathers</strong> over a layer of fat (<strong>blubber</strong>) keep out the cold and wet.',
            'Its <strong>wings are flippers</strong> and its feet are <strong>webbed</strong> for swimming and steering.',
            'A black back and white belly is <strong>countershading</strong> — hard to spot from above or below.',
          ],
        },
        range: {
          type: 'map',
          title: 'Where Penguins Live',
          region: 'The far South',
          intro: 'Almost all wild penguins live in the Southern Hemisphere.',
          facts: [
            'They live around <strong>Antarctica</strong> and southern coasts — never at the North Pole.',
            'So penguins and polar bears <strong>never meet</strong> in the wild: opposite ends of the Earth.',
          ],
        },
      },
    },
    quizBank: [
      { question: 'What kind of animal is a penguin?', options: ['A fish', 'A bird', 'A mammal', 'A reptile'], correct: 1 },
      { question: 'Can a penguin fly through the air?', options: ['Yes, very high', 'No — but it "flies" underwater', 'Only at night', 'Yes, like an eagle'], correct: 1 },
      { question: 'What do penguins mainly eat?', options: ['Grass and leaves', 'Fish, krill and squid', 'Fruit', 'Seeds'], correct: 1 },
      { question: 'How do penguins keep warm in the cold?', options: ['They huddle together in a group', 'They light a fire', 'They dig deep tunnels', 'They fly south'], correct: 0 },
      { question: 'What is a group of penguins called?', options: ['A pride', 'A colony', 'A pack', 'A herd'], correct: 1 },
      { question: 'What is a baby penguin called?', options: ['A cub', 'A chick', 'A calf', 'A joey'], correct: 1 },
      { question: 'Where do almost all wild penguins live?', options: ['The far North', 'The far South', 'Hot deserts', 'Rainforests'], correct: 1 },
      { question: 'Do penguins live at the North Pole with polar bears?', options: ['Yes, side by side', 'No — penguins live in the south', 'Only in summer', 'Yes, in winter'], correct: 1 },
      { question: "What are a penguin's wings shaped like?", options: ['Feathered fans for flying', 'Flippers for swimming', 'Tiny claws', 'Long arms'], correct: 1 },
      { question: 'Why are penguins black on top and white underneath?', options: ['To look smart', 'For camouflage from above and below', 'To stay warm', 'To scare fish'], correct: 1 },
      { question: 'Which penguin dad balances the egg on his feet all winter?', options: ['The little blue penguin', 'The emperor penguin', 'The rockhopper', 'No penguin does this'], correct: 1 },
      { question: 'How do penguins move quickly in the water?', options: ['By paddling slowly', 'By "flying" with their flippers', 'By floating still', 'They sink'], correct: 1 },
      { question: 'Besides feathers, what keeps a penguin warm?', options: ['A layer of fat (blubber)', 'A wool sweater', 'Hot breath', 'Nothing'], correct: 0 },
      { question: 'When penguins huddle, how do they stay fair?', options: ['The biggest stays warmest', 'They take turns on the cold outside edge', 'Nobody moves', 'They push the babies out'], correct: 1 },
      { question: 'Which is the tallest kind of penguin?', options: ['The little blue penguin', 'The emperor penguin', 'The macaroni penguin', 'They are all the same'], correct: 1 },
      { question: 'How does a penguin grip a slippery fish?', options: ['With sharp teeth', 'With a spiny tongue and beak', 'With its flippers', 'With its feet'], correct: 1 },
      { question: 'A penguin is best described as a...?', options: ['Great flier', 'Great swimmer', 'Fast runner', 'Tree climber'], correct: 1 },
      { question: "What keeps water off a penguin's body?", options: ['Dense, waterproof feathers', 'A raincoat', 'Dry skin', 'Scales'], correct: 0 },
      { question: 'How do penguin parents share the work?', options: ['Only the mother helps', 'Both parents feed and care for the chick', 'The chick is left alone', 'A keeper does it'], correct: 1 },
      { question: 'How can penguins drink seawater safely?', options: ['They boil it first', 'A special gland removes the salt', 'They cannot — they only eat snow', 'They do not drink at all'], correct: 1 },
      { question: "Why can't a penguin fly in the air?", options: ['It is too lazy', 'Its wings are flippers, built for swimming', 'It has no wings', 'It is afraid of heights'], correct: 1 },
      { question: 'What is a large penguin breeding group called?', options: ['A rookery', 'A nest box', 'A flock pad', 'A burrow'], correct: 0 },
      { question: 'How do penguins dive deep for food?', options: ['They hold their breath and swim down', 'They use scuba tanks', 'They float and wait', 'They cannot dive'], correct: 0 },
      { question: 'How do emperor penguins survive the freezing wind?', options: ['By huddling tightly together', 'By flying away', 'By burrowing in mud', 'By swimming all winter'], correct: 0 },
      { question: 'What colour are most penguins?', options: ['Brown and green', 'Black and white', 'Bright red', 'Spotted'], correct: 1 },
      { question: 'How do penguins often travel quickly over ice?', options: ['By sliding on their bellies', 'By hopping like a kangaroo', 'By rolling', 'By flying low'], correct: 0 },
      { question: "Sliding along on its belly over the ice is called...?", options: ['Tobogganing', 'Galloping', 'Soaring', 'Burrowing'], correct: 0 },
      { question: 'Which pole do penguins NOT live at?', options: ['The South Pole', 'The North Pole', 'Both poles', 'Neither pole'], correct: 1 },
      { question: 'What do webbed feet help a penguin do?', options: ['Climb trees', 'Steer and push through the water', 'Dig burrows', 'Catch insects'], correct: 1 },
      { question: 'Which is TRUE about penguins?', options: ['They are birds that swim instead of fly', 'They are fish with feathers', 'They live with polar bears', 'They breathe underwater'], correct: 0 },
    ],
  },
  'polar-bear': {
    id: 'polar-bear',
    dex: '005',
    name: 'Polar Bear',
    region: 'polar',
    wanderMs: 2000,
    glideMs: 850,
    stats: 'Carnivore · lives in the far North · biggest land hunter',
    blurb: 'White fur, black skin, master of the ice.',
    facts: [
      'The <strong>largest land meat-eater</strong> on the planet.',
      'Its <strong>fur looks white but is see-through</strong>; the <strong>skin underneath is black</strong> to soak up the sun’s warmth.',
      '<strong>Huge paws</strong> act like snowshoes and paddles.',
      'It can <strong>smell a seal from over a kilometre</strong> away.',
    ],
    // `type` selects the on-map art (InteriorDecor) and the overlay layout (ExhibitOverlay).
    exhibit: {
      displays: {
        arctic: {
          type: 'poster',
          title: 'Life on the Ice',
          intro: 'Polar bears roam the frozen Arctic, mostly alone.',
          facts: [
            'A polar bear is a <strong>solitary wanderer</strong>, travelling huge distances across the <strong>sea ice</strong>.',
            'A baby is a <strong>cub</strong>, born tiny in a cosy <strong>snow den</strong> in winter.',
            'Cubs stay with their mother for about <strong>two years</strong>, learning to hunt.',
          ],
        },
        diet: {
          type: 'diet',
          title: 'The Top Hunter',
          intro: 'Polar bears are <strong>carnivores</strong> — they eat meat.',
          facts: [
            'They mainly hunt <strong>seals</strong>, waiting patiently beside holes in the ice where seals come up to breathe.',
            'They need <strong>sea ice</strong> as a platform to hunt from — without it, hunting is hard.',
          ],
        },
        size: {
          type: 'size',
          title: 'The Biggest Land Hunter',
          intro: 'The largest meat-eater that lives on land.',
          facts: [
            'A big male can weigh as much as <strong>five or six adult people</strong>.',
            'Standing up on its back legs, it <strong>towers over a person</strong>.',
          ],
        },
        nose: {
          type: 'touchscreen',
          title: 'Did You Know?',
          question: 'How does a polar bear find a seal hidden under the snow?',
          answer:
            'By <strong>smell</strong>! A polar bear can smell a seal from <strong>over a kilometre away</strong> — even through thick snow and ice.',
        },
        coat: {
          type: 'specimen',
          title: 'Fur, Skin & Paws',
          specimen: 'A tuft of see-through fur',
          intro: 'A closer look at how a polar bear beats the Arctic cold.',
          facts: [
            'Its fur <strong>looks white but is actually see-through</strong> — it scatters light and matches the snow.',
            'The <strong>skin underneath is black</strong> to soak up the sun’s warmth, over a thick layer of <strong>blubber</strong>.',
            'Its <strong>huge paws</strong> work like snowshoes on snow and like paddles when swimming.',
          ],
        },
        range: {
          type: 'map',
          title: 'Where Polar Bears Live',
          region: 'The far North (the Arctic)',
          intro: 'Polar bears live around the North Pole.',
          facts: [
            'They roam the <strong>Arctic sea ice</strong> over the ocean and are <strong>strong swimmers</strong> between ice floes.',
            'Penguins live at the opposite end of the Earth, so the two <strong>never meet</strong> in the wild.',
          ],
        },
      },
    },
    quizBank: [
      { question: 'What is the largest land meat-eater on Earth?', options: ['The lion', 'The polar bear', 'The wolf', 'The tiger'], correct: 1 },
      { question: "What colour is a polar bear's skin under its fur?", options: ['White', 'Pink', 'Black', 'Grey'], correct: 2 },
      { question: "Is a polar bear's fur truly white?", options: ['Yes, pure white', 'No — it is see-through and only looks white', 'It is painted white', 'It is grey'], correct: 1 },
      { question: 'What do polar bears mainly hunt and eat?', options: ['Seals', 'Grass', 'Fruit', 'Insects'], correct: 0 },
      { question: 'Where do polar bears live?', options: ['The far North (the Arctic)', 'The far South', 'Hot deserts', 'Rainforests'], correct: 0 },
      { question: 'What is a baby polar bear called?', options: ['A chick', 'A cub', 'A calf', 'A joey'], correct: 1 },
      { question: "Why is a polar bear's skin black?", options: ['To look scary', 'To soak up the sun’s warmth', 'To hide from seals', 'It is just paint'], correct: 1 },
      { question: 'How far away can a polar bear smell a seal?', options: ['A few steps', 'Over a kilometre away', 'Only when touching it', 'They cannot smell'], correct: 1 },
      { question: "What do a polar bear's huge paws act like?", options: ['Snowshoes and paddles', 'Wings', 'Shovels only', 'Skis'], correct: 0 },
      { question: 'Are polar bears good swimmers?', options: ['No, they sink', 'Yes, they are excellent swimmers', 'Only babies swim', 'They hate water'], correct: 1 },
      { question: 'What keeps a polar bear warm in the Arctic?', options: ['Thick fur and a layer of fat', 'A coat from the keeper', 'Warm rocks', 'Nothing'], correct: 0 },
      { question: 'What do polar bears need in order to hunt seals?', options: ['Sea ice to hunt from', 'Tall trees', 'Warm sand', 'Deep mud'], correct: 0 },
      { question: 'Do polar bears live with penguins?', options: ['Yes, all the time', 'No — penguins live in the south', 'Only in zoos', 'Yes, at the South Pole'], correct: 1 },
      { question: 'About how heavy is a big male polar bear?', options: ['Like a house cat', 'Like a small dog', 'As much as five or six people', 'As much as a mouse'], correct: 2 },
      { question: 'What helps a polar bear walk on slippery ice?', options: ['Rough pads and claws on its paws', 'Tiny smooth feet', 'Suction cups', 'Wheels'], correct: 0 },
      { question: 'How does a polar bear usually catch a seal?', options: ['It waits patiently by a hole in the ice', 'It climbs a tree', 'It digs underground', 'It uses a net'], correct: 0 },
      { question: 'Why does a polar bear look white?', options: ['Its see-through fur scatters light and matches the snow', 'It is painted', 'It rolls in flour', 'Its skin is white'], correct: 0 },
      { question: "What is a polar bear's strongest sense for finding food?", options: ['Sight', 'Smell', 'Taste', 'Touch'], correct: 1 },
      { question: 'Where are polar bear cubs born?', options: ['In a snow den', 'In a tree', 'In the water', 'In tall grass'], correct: 0 },
      { question: 'About how long do cubs stay with their mother?', options: ['A few days', 'About two years', 'Ten years', 'Forever'], correct: 1 },
      { question: 'Polar bears are carnivores, which means they eat...?', options: ['Plants', 'Meat', 'Rocks', 'Ice only'], correct: 1 },
      { question: 'What does a polar bear use to paddle through the water?', options: ['Its big front paws', 'A tail fin', 'Its ears', 'A shell'], correct: 0 },
      { question: 'Which pole do polar bears live near?', options: ['The South Pole', 'The North Pole', 'Both', 'Neither'], correct: 1 },
      { question: 'What lies under a polar bear’s fur to trap heat?', options: ['A thick layer of fat (blubber)', 'A metal plate', 'Feathers', 'Nothing'], correct: 0 },
      { question: 'How do polar bears usually live?', options: ['In big herds', 'Mostly alone', 'In pairs only', 'In flocks'], correct: 1 },
      { question: 'Why are polar bears such strong swimmers?', options: ['Big paddle-like paws and a streamlined shape', 'They have fins', 'They are very light', 'They float on air'], correct: 0 },
      { question: 'What is a danger to polar bears as the world warms?', options: ['Too much snow', 'Less sea ice to hunt from', 'Too many seals', 'Bright sunshine'], correct: 1 },
      { question: 'What is special about a polar bear’s nose?', options: ['It glows', 'It can smell prey far away and under the snow', 'It is just for show', 'It cannot smell'], correct: 1 },
      { question: 'How does a polar bear cross open water between ice?', options: ['It swims', 'It flies', 'It builds a boat', 'It waits for it to freeze'], correct: 0 },
      { question: 'Which is TRUE about a polar bear?', options: ['It has white-looking fur but black skin', 'It has white skin and black fur', 'It is a kind of penguin', 'It eats only plants'], correct: 0 },
    ],
  },
};

// Each drawn question carries `n`, its 1-based position in the bank, so an LMS interaction
// id stays stable across re-rolls.
export function drawQuestions(bank, n, rng = Math.random) {
  const idx = bank.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, n).map((i) => ({ ...bank[i], n: i + 1 }));
}

export const regionAnimals = (regionId) =>
  Object.values(ANIMALS)
    .filter((a) => a.region === regionId)
    .map((a) => a.id);

export const REGIONS = {
  savanna: {
    id: 'savanna',
    name: 'Savanna',
    badgeLabel: 'Savanna Badge',
  },
  polar: {
    id: 'polar',
    name: 'Polar',
    badgeLabel: 'Polar Badge',
  },
};

// Keepers share one uniform and read as different people through skin tone and hair.
const KEEPER_UNIFORM = {
  shirt: '#a78a52',
  trousers: '#6b5836',
  cap: '#5e4f30',
};

const POLAR_UNIFORM = {
  shirt: '#3a6ea5',
  trousers: '#2e3a4a',
  cap: '#28455f',
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
  penguin: {
    skin: '#e3b48c',
    hair: '#2a2018',
    hairStyle: 'ponytail',
    ...POLAR_UNIFORM,
  },
  'polar-bear': {
    skin: '#9a6440',
    hair: '#15110c',
    hairStyle: 'short',
    ...POLAR_UNIFORM,
  },
};

// Hidden animals found in the grass. They count toward TOTAL_ANIMALS but, not being in
// ANIMALS, award no region badge.

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
  'snowy-owl': {
    id: 'snowy-owl',
    name: 'Snowy Owl',
    dex: '006',
    stats: 'Bird of prey · Arctic hunter · silent flight',
    blurb: 'A ghost-white owl that hunts in silence over the snow.',
    facts: [
      'Snowy owls have <strong>thick feathers down to their toes</strong> to survive the Arctic cold.',
      'They fly almost <strong>silently</strong>, so prey never hears them coming.',
      'Unlike most owls, they often <strong>hunt by day</strong>.',
      'They can <strong>turn their heads</strong> remarkably far around to look behind them.',
    ],
    setup: 'A Snowy Owl lands on a post, swivelling its head to watch you with huge yellow eyes.',
    choices: [
      {
        label: 'Stay very still',
        reply:
          'Wise. Snowy owls fly almost <strong>silently</strong> and miss nothing — it studies you, then glides off without a sound.',
      },
      {
        label: 'Wave hello',
        reply:
          'It tilts its head almost all the way around to keep watching you. Owls can <strong>turn their heads</strong> very far — handy when your eyes can’t move in their sockets.',
      },
      {
        label: 'Whisper a hoot',
        reply:
          'It blinks, unimpressed. Snowy owls are quieter than most owls and often <strong>hunt by day</strong> across the open snow.',
      },
    ],
    note: 'Snowy Owl — silent flight, hunts by day, turns its head remarkably far.',
  },
};

export const TOTAL_ANIMALS = Object.keys(ANIMALS).length + Object.keys(ENCOUNTERS).length;

export const ALL_CARDS = [...Object.values(ANIMALS), ...Object.values(ENCOUNTERS)].sort(
  (a, b) => a.dex.localeCompare(b.dex),
);

const EVENT = 'zoodex-change';

export function readStore(store) {
  const s = store.get() ?? {};
  return {
    collected: s.collected ?? [],
    badges: s.badges ?? [],
    map: s.map ?? null,
    avatar: s.avatar ?? null,
  };
}

export function updateStore(store, fn) {
  const next = fn(readStore(store));
  store.set(next);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT));
  }
  return next;
}

export function onStoreChange(handler) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

const addUnique = (arr, id) => (arr.includes(id) ? arr : [...arr, id]);

// Collecting the last animal of a region awards its badge in the same write.
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

