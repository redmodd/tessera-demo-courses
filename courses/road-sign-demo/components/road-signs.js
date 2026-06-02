// 58-sign data module + round-generation helper.
// Each record:
//   id        kebab-case slug; used in code, choice-interaction response, and DOM ids
//   name      display name (the "correct answer")
//   category  'regulatory' | 'warning' | 'guide'
//   shape     'octagon' | 'triangle' | 'rectangle-v' | 'rectangle-h' | 'square'
//             | 'diamond' | 'pentagon' | 'crossbuck' | 'shield'
//   color     simple palette tag (e.g. 'red-white', 'yellow-black')
//   file      MUTCD filename under $assets/signs/
//   blurb     short factual sentence shown as feedback
//   scenario  one-sentence driving situation (nullable: skip in scenario mode)

export const SIGNS = [
  // ---------- Regulatory ----------
  { id: 'stop', name: 'Stop', category: 'regulatory', shape: 'octagon', color: 'red-white', file: 'MUTCD_R1-1.svg',
    blurb: 'Come to a complete stop and proceed when safe.',
    scenario: "You're rolling up to a 4-way intersection with no traffic signals." },
  { id: 'yield', name: 'Yield', category: 'regulatory', shape: 'triangle', color: 'red-white', file: 'MUTCD_R1-2.svg',
    blurb: 'Slow down and give the right of way to other traffic.',
    scenario: "You're merging onto a busy street from a quiet side road." },
  { id: 'speed-limit', name: 'Speed Limit', category: 'regulatory', shape: 'rectangle-v', color: 'white-black', file: 'MUTCD_R2-1.svg',
    blurb: 'Maximum legal speed for this stretch of road.',
    scenario: "You want to know how fast you're legally allowed to drive here." },
  { id: 'no-right-turn', name: 'No Right Turn', category: 'regulatory', shape: 'square', color: 'red-black-white', file: 'MUTCD_R3-1.svg',
    blurb: 'Right turns are not permitted at this intersection.',
    scenario: "You can't take this turn. Right turns are not allowed here." },
  { id: 'no-left-turn', name: 'No Left Turn', category: 'regulatory', shape: 'square', color: 'red-black-white', file: 'MUTCD_R3-2.svg',
    blurb: 'Left turns are not permitted at this intersection.',
    scenario: "You're at an intersection where turning left would be illegal." },
  { id: 'no-u-turn', name: 'No U-Turn', category: 'regulatory', shape: 'square', color: 'red-black-white', file: 'MUTCD_R3-4.svg',
    blurb: 'You may not reverse direction at this location.',
    scenario: "You missed your exit and want to turn around, but you can't here." },
  { id: 'mandatory-right-lane', name: 'Mandatory Right Turn Lane', category: 'regulatory', shape: 'rectangle-v', color: 'white-black', file: 'MUTCD_R3-5R.svg',
    blurb: 'Drivers in this lane must turn right.',
    scenario: "You're in a lane that forces a right turn ahead." },
  { id: 'right-lane-turn-right', name: 'Right Lane Must Turn Right', category: 'regulatory', shape: 'rectangle-v', color: 'white-black', file: 'MUTCD_R3-7R.svg',
    blurb: 'If you stay in the right lane, you must turn right.',
    scenario: "If you stay in the right lane, you'll have to turn right at the intersection." },
  { id: 'do-not-pass', name: 'Do Not Pass', category: 'regulatory', shape: 'rectangle-v', color: 'white-black', file: 'MUTCD_R4-1.svg',
    blurb: 'Passing other vehicles is prohibited here.',
    scenario: "You're stuck behind a slow driver, and passing isn't allowed." },
  { id: 'pass-with-care', name: 'Pass With Care', category: 'regulatory', shape: 'rectangle-v', color: 'white-black', file: 'MUTCD_R4-2.svg',
    blurb: 'Passing is allowed, but check before you do.',
    scenario: 'A no-passing zone has just ended, and passing is now permitted.' },
  { id: 'keep-right', name: 'Keep Right', category: 'regulatory', shape: 'rectangle-v', color: 'white-black', file: 'MUTCD_R4-7.svg',
    blurb: 'Stay to the right of the obstacle ahead.',
    scenario: "There's an obstacle in the road. Stay on the right side of it." },
  { id: 'do-not-enter', name: 'Do Not Enter', category: 'regulatory', shape: 'square', color: 'red-white', file: 'MUTCD_R5-1.svg',
    blurb: 'This is a one-way street; entry is not permitted.',
    scenario: "This is a one-way street, and you're at the wrong end." },
  { id: 'wrong-way', name: 'Wrong Way', category: 'regulatory', shape: 'rectangle-h', color: 'red-white', file: 'MUTCD_R5-1a.svg',
    blurb: "You're driving against traffic. Turn around safely.",
    scenario: "You've started driving the wrong direction on a one-way road." },
  { id: 'no-trucks', name: 'No Trucks', category: 'regulatory', shape: 'square', color: 'red-black-white', file: 'MUTCD_R5-2.svg',
    blurb: 'Heavy trucks are prohibited on this road.',
    scenario: "Heavy trucks aren't allowed on this road." },
  { id: 'one-way-right', name: 'One Way (right)', category: 'regulatory', shape: 'rectangle-h', color: 'white-black', file: 'MUTCD_R6-1R.svg',
    blurb: 'Traffic flows in one direction only: to the right.',
    scenario: 'Traffic only flows to the right on this street.' },
  { id: 'one-way-left', name: 'One Way (left)', category: 'regulatory', shape: 'rectangle-h', color: 'white-black', file: 'MUTCD_R6-1L.svg',
    blurb: 'Traffic flows in one direction only: to the left.',
    scenario: 'Traffic only flows to the left on this street.' },
  { id: 'no-parking-any-time', name: 'No Parking Any Time', category: 'regulatory', shape: 'rectangle-v', color: 'red-black-white', file: 'MUTCD_R7-1.svg',
    blurb: 'Parking is prohibited here at all times.',
    scenario: 'Parking is not allowed in this spot at any time, day or night.' },
  { id: 'no-parking', name: 'No Parking', category: 'regulatory', shape: 'square', color: 'red-black-white', file: 'MUTCD_R8-3.svg',
    blurb: 'Parking is prohibited in this area.',
    scenario: 'You want to park, but it is not permitted at this location.' },
  { id: 'stop-here-on-red', name: 'Stop Here on Red', category: 'regulatory', shape: 'rectangle-v', color: 'white-black', file: 'MUTCD_R10-6.svg',
    blurb: 'When the light is red, this is where to stop.',
    scenario: "The traffic light is red. This is where you should stop." },
  { id: 'no-turn-on-red', name: 'No Turn on Red', category: 'regulatory', shape: 'rectangle-v', color: 'red-black-white', file: 'MUTCD_R10-11.svg',
    blurb: 'You may not turn while the signal is red.',
    scenario: "The light is red and you'd like to turn right, but it is not allowed here." },
  { id: 'railroad-crossing', name: 'Railroad Crossing (Crossbuck)', category: 'regulatory', shape: 'crossbuck', color: 'white-black', file: 'MUTCD_R15-1.svg',
    blurb: 'Train tracks cross the road ahead. Yield to trains.',
    scenario: "You're approaching train tracks that cross the road." },

  // ---------- Warning ----------
  { id: 'turn', name: 'Turn', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W1-1.svg',
    blurb: 'A sharp change of direction is ahead.',
    scenario: 'A sharp turn is ahead. Slow down before you reach it.' },
  { id: 'curve', name: 'Curve', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W1-2.svg',
    blurb: 'A gradual curve in the road is coming up.',
    scenario: 'A gradual curve in the road is coming up.' },
  { id: 'reverse-turn', name: 'Reverse Turn', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W1-3.svg',
    blurb: 'Two sharp turns in opposite directions are ahead.',
    scenario: 'Two sharp turns in opposite directions are coming up.' },
  { id: 'reverse-curve', name: 'Reverse Curve', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W1-4.svg',
    blurb: 'Two gradual curves in opposite directions are ahead.',
    scenario: 'Two gradual curves in opposite directions are coming up.' },
  { id: 'winding-road', name: 'Winding Road', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W1-5.svg',
    blurb: 'Three or more curves in a row are ahead.',
    scenario: 'The road snakes back and forth for the next few kilometres.' },
  { id: 'large-arrow', name: 'One-Direction Large Arrow', category: 'warning', shape: 'rectangle-h', color: 'yellow-black', file: 'MUTCD_W1-6.svg',
    blurb: 'A sharp change in direction. Follow the arrow.',
    scenario: "There's a sharp change in direction ahead. Follow the arrow." },
  { id: 'chevron', name: 'Chevron Alignment', category: 'warning', shape: 'rectangle-v', color: 'yellow-black', file: 'MUTCD_W1-8.svg',
    blurb: 'Marks the alignment of a sharp curve.',
    scenario: 'Lined up along the outside of a sharp curve to mark its path.' },
  { id: 'cross-road', name: 'Cross Road (Intersection Ahead)', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W2-1.svg',
    blurb: 'A four-way intersection is ahead. Watch for cross traffic.',
    scenario: 'A four-way intersection is ahead. Watch for cross traffic.' },
  { id: 'side-road', name: 'Side Road', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W2-2.svg',
    blurb: 'A road joins from the side ahead.',
    scenario: 'A road joins from the side ahead. Watch for entering traffic.' },
  { id: 'stop-ahead', name: 'Stop Ahead', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W3-1.svg',
    blurb: 'A stop sign is coming up. Start slowing now.',
    scenario: 'A stop sign is coming up. Start slowing now.' },
  { id: 'yield-ahead', name: 'Yield Ahead', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W3-2.svg',
    blurb: 'A yield sign is coming up. Be ready to give way.',
    scenario: 'A yield sign is coming up. Be ready to give way.' },
  { id: 'signal-ahead', name: 'Signal Ahead', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W3-3.svg',
    blurb: 'Traffic signals are coming. Check the lights.',
    scenario: 'Traffic signals are coming up. Check the lights.' },
  { id: 'merge', name: 'Merge', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W4-1.svg',
    blurb: 'A lane is joining yours. Prepare for merging traffic.',
    scenario: 'A lane is joining yours. Prepare for merging traffic.' },
  { id: 'lane-ends', name: 'Lane Ends (Lane Reduction)', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W4-2.svg',
    blurb: "Your lane is ending. You'll need to merge.",
    scenario: "Your lane is ending. You'll need to merge soon." },
  { id: 'added-lane', name: 'Added Lane', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W4-3.svg',
    blurb: 'An extra lane is being added; no merging required.',
    scenario: 'An extra lane is being added ahead; no merging required.' },
  { id: 'two-way-traffic', name: 'Two-Way Traffic', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W6-3.svg',
    blurb: 'The road changes from one-way to two-way ahead.',
    scenario: 'The road changes from one-way to two-way ahead.' },
  { id: 'hill', name: 'Hill', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W7-1.svg',
    blurb: 'A steep downhill grade is ahead. Manage your speed.',
    scenario: 'A steep downhill grade is ahead. Manage your speed.' },
  { id: 'bump', name: 'Bump', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W8-1.svg',
    blurb: 'An abrupt bump in the road surface is ahead.',
    scenario: 'An abrupt bump in the road surface is ahead.' },
  { id: 'slippery-when-wet', name: 'Slippery When Wet', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W8-5.svg',
    blurb: 'The road becomes slick when it rains.',
    scenario: 'The road surface becomes slick when it rains.' },
  { id: 'low-shoulder', name: 'Low Shoulder', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W8-9.svg',
    blurb: 'The shoulder drops off lower than the lane.',
    scenario: 'The shoulder drops off lower than the travelled lane.' },
  { id: 'bicycle', name: 'Bicycle', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W11-1.svg',
    blurb: 'Watch for cyclists sharing the road.',
    scenario: 'Watch for cyclists on the road ahead.' },
  { id: 'pedestrian', name: 'Pedestrian', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W11-2.svg',
    blurb: 'Watch for people on foot crossing the road.',
    scenario: 'Watch for pedestrians crossing the road ahead.' },
  { id: 'deer-crossing', name: 'Deer Crossing', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W11-3.svg',
    blurb: 'Wildlife may cross the road, especially at dawn and dusk.',
    scenario: 'Wildlife may cross the road here, especially at dawn and dusk.' },
  { id: 'emergency-vehicle', name: 'Emergency Vehicle (Fire Station)', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W11-8.svg',
    blurb: 'A fire station is ahead. Emergency vehicles may enter the road.',
    scenario: "There's a fire station ahead. Emergency vehicles may enter the road." },
  { id: 'double-arrow', name: 'Double Arrow', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W12-1.svg',
    blurb: 'Traffic can go either left or right ahead.',
    scenario: 'You can go either left or right at the intersection ahead.' },
  { id: 'dead-end', name: 'Dead End', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W14-1.svg',
    blurb: 'The road ends ahead with no way through.',
    scenario: 'The road ends ahead with no way through.' },
  { id: 'no-outlet', name: 'No Outlet', category: 'warning', shape: 'diamond', color: 'yellow-black', file: 'MUTCD_W14-2.svg',
    blurb: 'The road and any side streets all terminate.',
    scenario: 'The road and any side streets ahead all terminate; no through route.' },
  { id: 'road-work-ahead', name: 'Road Work Ahead', category: 'warning', shape: 'diamond', color: 'orange-black', file: 'MUTCD_W20-1.svg',
    blurb: 'Construction zone ahead. Slow down and watch for workers.',
    scenario: 'A construction zone is coming up. Slow down and watch for workers.' },
  { id: 'school-zone', name: 'School Zone', category: 'warning', shape: 'pentagon', color: 'fyg-black', file: 'MUTCD_S1-1.svg',
    blurb: "You're entering a school zone. Watch for children.",
    scenario: "You're approaching an elementary school." },

  // ---------- Guide / info ----------
  { id: 'telephone', name: 'Telephone', category: 'guide', shape: 'square', color: 'blue-white', file: 'MUTCD_D9-1.svg',
    blurb: 'A public telephone is available at this location.',
    scenario: 'You need to make a phone call from the roadside.' },
  { id: 'hospital', name: 'Hospital', category: 'guide', shape: 'square', color: 'blue-white', file: 'MUTCD_D9-2.svg',
    blurb: 'A hospital is nearby.',
    scenario: 'Someone needs medical care and you want to know where the hospital is.' },
  { id: 'camping', name: 'Camping', category: 'guide', shape: 'square', color: 'blue-white', file: 'MUTCD_D9-3.svg',
    blurb: 'A campground is available at this exit.',
    scenario: "You're road-tripping and looking for a place to pitch a tent." },
  { id: 'gas', name: 'Gas / Fuel', category: 'guide', shape: 'square', color: 'blue-white', file: 'MUTCD_D9-7.svg',
    blurb: 'Fuel stations are available at this exit.',
    scenario: "You're running low on fuel and need to refuel." },
  { id: 'food', name: 'Food / Restaurant', category: 'guide', shape: 'square', color: 'blue-white', file: 'MUTCD_D9-8.svg',
    blurb: 'Food services are available at this exit.',
    scenario: "You're hungry and looking for a place to eat." },
  { id: 'lodging', name: 'Lodging', category: 'guide', shape: 'square', color: 'blue-white', file: 'MUTCD_D9-9.svg',
    blurb: 'Hotels or motels are available at this exit.',
    scenario: "It's late and you want to find a place to spend the night." },
  { id: 'interstate-marker', name: 'Interstate Route Marker', category: 'guide', shape: 'shield', color: 'shield-red', file: 'MUTCD_M1-1.svg',
    blurb: 'Marks a route on the U.S. Interstate Highway System.',
    scenario: "You're trying to confirm which Interstate highway you're on." },
  { id: 'us-route-marker', name: 'U.S. Route Marker', category: 'guide', shape: 'shield', color: 'shield-bw', file: 'MUTCD_M1-4.svg',
    blurb: 'Marks a U.S. numbered highway.',
    scenario: "You're trying to confirm which U.S. highway you're on." },
];

export const SIGNS_BY_ID = Object.fromEntries(SIGNS.map((s) => [s.id, s]));

// ---------- Round generation ----------

// Modes the game rotates through. Shape/color mode is excluded from tier 3
// (rounds 11-15); distractors share shape+color there, which makes the
// shape/color prompt unanswerable.
export const MODES = ['name-to-sign', 'sign-to-name', 'scenario-to-sign', 'shape-color-to-sign'];

// Rounds 0-4 = tier 0, 5-9 = tier 1, 10-14 = tier 2.
function tierFor(roundIndex) {
  if (roundIndex < 5) return 0;
  if (roundIndex < 10) return 1;
  return 2;
}

const TIER_RULES = [
  { distractors: 'random',         cards: 3, seconds: 15 },
  { distractors: 'same-category',  cards: 4, seconds: 11 },
  { distractors: 'same-shape-color', cards: 5, seconds: 8 },
];

const CATEGORY_LABEL = { regulatory: 'regulatory', warning: 'warning', guide: 'guide / info' };

function shuffle(arr, rand) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(target, pool, tier, count, rand) {
  // Try the tier's preferred pool, then progressively relax so a rare
  // shape/color combo (e.g. pentagon, crossbuck) still yields enough cards.
  const candidates = pool.filter((s) => s.id !== target.id);
  const strategies = [];
  if (tier === 2) {
    strategies.push((s) => s.shape === target.shape && s.color === target.color);
    strategies.push((s) => s.shape === target.shape);
    strategies.push((s) => s.color === target.color);
    strategies.push((s) => s.category === target.category);
    strategies.push(() => true);
  } else if (tier === 1) {
    strategies.push((s) => s.category === target.category);
    strategies.push(() => true);
  } else {
    strategies.push((s) => s.category !== target.category);
    strategies.push(() => true);
  }
  for (const pred of strategies) {
    const pool2 = candidates.filter(pred);
    if (pool2.length >= count) return shuffle(pool2, rand).slice(0, count);
  }
  return shuffle(candidates, rand).slice(0, count);
}

function pickShapeColorDistractors(target, pool, count, rand) {
  // For "Which is a warning sign?": distractors must be from other
  // categories so the prompt has a single right answer.
  const candidates = pool.filter((s) => s.id !== target.id && s.category !== target.category);
  return shuffle(candidates, rand).slice(0, count);
}

// Mode rotation: cycle Name → Sign → Scenario → Shape/color, with the cycle
// offset per attempt so retries don't feel identical. Shape/color skipped in
// tier 3. If the chosen mode is scenario but the target has no scenario, the
// caller falls back to the next mode in the cycle.
function modeForRound(roundIndex, attemptOffset) {
  return MODES[(roundIndex + attemptOffset) % MODES.length];
}

function pickMode(roundIndex, target, attemptOffset) {
  const tier = tierFor(roundIndex);
  for (let i = 0; i < MODES.length; i++) {
    const m = modeForRound(roundIndex + i, attemptOffset);
    if (tier === 2 && m === 'shape-color-to-sign') continue;
    if (m === 'scenario-to-sign' && !target.scenario) continue;
    return m;
  }
  return 'sign-to-name';
}

export function generateRounds({ count = 15, attemptOffset = 0, rand = Math.random } = {}) {
  const pool = SIGNS;
  const targets = shuffle(pool, rand).slice(0, count);
  const rounds = [];

  for (let i = 0; i < count; i++) {
    const target = targets[i];
    const tier = tierFor(i);
    const rules = TIER_RULES[tier];
    const mode = pickMode(i, target, attemptOffset);

    let distractors;
    if (mode === 'shape-color-to-sign') {
      distractors = pickShapeColorDistractors(target, pool, rules.cards - 1, rand);
    } else {
      distractors = pickDistractors(target, pool, tier, rules.cards - 1, rand);
    }

    const cards = shuffle([target, ...distractors], rand);

    let prompt;
    if (mode === 'name-to-sign') {
      prompt = { kind: 'text', text: target.name };
    } else if (mode === 'sign-to-name') {
      prompt = { kind: 'sign', sign: target };
    } else if (mode === 'scenario-to-sign') {
      prompt = { kind: 'text', text: target.scenario };
    } else {
      prompt = { kind: 'text', text: `Which of these is a ${CATEGORY_LABEL[target.category]} sign?` };
    }

    rounds.push({
      index: i,
      tier,
      mode,
      seconds: rules.seconds,
      prompt,
      cards,
      cardKind: mode === 'sign-to-name' ? 'name' : 'sign',
      target,
    });
  }
  return rounds;
}
