/**
 * Static game content for VitFinity Budget Simulator
 */

/** Expense items used across phases */
export const EXPENSE_ITEMS = {
  needs: [
    { id: 'n1', name: 'School Lunch', cost: 15, icon: '🍱', description: 'Nutritious meals at school' },
    { id: 'n2', name: 'Bus Pass', cost: 10, icon: '🚌', description: 'Transportation to school' },
    { id: 'n3', name: 'School Supplies', cost: 12, icon: '📚', description: 'Notebooks, pens, essentials' },
    { id: 'n4', name: 'Hygiene Kit', cost: 8, icon: '🧴', description: 'Soap, toothpaste, basics' },
    { id: 'n5', name: 'Water Bottle', cost: 5, icon: '💧', description: 'Staying hydrated daily' },
    { id: 'n6', name: 'Warm Jacket', cost: 20, icon: '🧥', description: 'Protection from cold weather' },
  ],
  wants: [
    { id: 'w1', name: 'Video Game', cost: 25, icon: '🎮', description: 'Latest trending game' },
    { id: 'w2', name: 'Movie Ticket', cost: 12, icon: '🎬', description: 'Weekend movie with friends' },
    { id: 'w3', name: 'Candy & Snacks', cost: 8, icon: '🍫', description: 'Sweet treats from the store' },
    { id: 'w4', name: 'Trendy Shoes', cost: 30, icon: '👟', description: 'Cool sneakers everyone wants' },
    { id: 'w5', name: 'Music Subscription', cost: 10, icon: '🎵', description: 'Stream unlimited music' },
    { id: 'w6', name: 'Pizza Party', cost: 15, icon: '🍕', description: 'Pizza with friends after school' },
  ],
  smartAlternatives: [
    { id: 'sa1', name: 'Home Lunch', cost: 5, icon: '🥪', replaces: 'n1', description: 'Pack lunch from home — save money!' },
    { id: 'sa2', name: 'Walking/Cycling', cost: 0, icon: '🚲', replaces: 'n2', description: 'Free transport + exercise' },
    { id: 'sa3', name: 'Library Books', cost: 0, icon: '📖', replaces: 'w1', description: 'Free entertainment and learning' },
    { id: 'sa4', name: 'Free Music App', cost: 0, icon: '🎶', replaces: 'w5', description: 'Free tier with some ads' },
    { id: 'sa5', name: 'Homemade Snacks', cost: 3, icon: '🍪', replaces: 'w3', description: 'Bake your own treats!' },
    { id: 'sa6', name: 'Movie at Home', cost: 0, icon: '📺', replaces: 'w2', description: 'Family movie night — zero cost!' },
  ],
};

/** Emergency scenarios */
export const EMERGENCIES = [
  {
    id: 'e1',
    title: 'Broken Phone Screen',
    description: 'You accidentally dropped your phone and the screen cracked!',
    cost: 25,
    icon: '📱',
    urgency: 'high',
  },
  {
    id: 'e2',
    title: 'Lost School Book',
    description: 'You lost your textbook and need to replace it before exams.',
    cost: 15,
    icon: '📕',
    urgency: 'high',
  },
  {
    id: 'e3',
    title: 'Friend\'s Birthday',
    description: 'Your best friend\'s birthday is this week. You forgot to save for a gift!',
    cost: 12,
    icon: '🎂',
    urgency: 'medium',
  },
  {
    id: 'e4',
    title: 'Medical Expense',
    description: 'You need medicine for a sudden cold.',
    cost: 10,
    icon: '💊',
    urgency: 'high',
  },
  {
    id: 'e5',
    title: 'School Trip Fee',
    description: 'An exciting school trip was announced! The fee is due this week.',
    cost: 20,
    icon: '🏕️',
    urgency: 'medium',
  },
  {
    id: 'e6',
    title: 'Bike Repair',
    description: 'Your bicycle got a flat tire and needs fixing.',
    cost: 8,
    icon: '🔧',
    urgency: 'low',
  },
];

/** Reward definitions */
export const REWARDS = [
  { id: 'r1', title: 'Smart Saver', description: 'You kept your savings untouched!', icon: '⭐', points: 50 },
  { id: 'r2', title: 'Budget Master', description: 'You stayed within all budget categories!', icon: '🏆', points: 100 },
  { id: 'r3', title: 'Wise Chooser', description: 'You picked a smart alternative!', icon: '🧠', points: 30 },
  { id: 'r4', title: 'Crisis Survivor', description: 'You handled an emergency without panic!', icon: '🛡️', points: 75 },
  { id: 'r5', title: 'Perfect Planner', description: 'Your plan matched your spending!', icon: '📋', points: 120 },
  { id: 'r6', title: 'Needs First', description: 'You prioritized needs over wants!', icon: '💪', points: 40 },
];

/** Educational tips shown throughout the game */
export const TIPS = [
  { id: 't1', text: 'The 50-30-20 rule: 50% for needs, 30% for wants, 20% for savings.', phase: 2 },
  { id: 't2', text: 'Smart alternatives can save you money without sacrificing happiness!', phase: 1 },
  { id: 't3', text: 'An emergency fund protects you from unexpected expenses.', phase: 4 },
  { id: 't4', text: 'Tracking your spending helps you understand where your money goes.', phase: 3 },
  { id: 't5', text: 'Delayed gratification: saving now means bigger rewards later!', phase: 5 },
  { id: 't6', text: 'Needs are things you must have. Wants are things you\'d like to have.', phase: 1 },
  { id: 't7', text: 'It\'s okay to spend on wants — just do it wisely!', phase: 3 },
  { id: 't8', text: 'Always pay for needs first before spending on wants.', phase: 2 },
];

/** Phase metadata */
export const PHASES = [
  {
    id: 1,
    title: 'The Sorting Ceremony',
    subtitle: 'Needs vs Wants vs Smart Alternatives',
    description: 'Learn to tell apart what you need from what you want — and discover smarter choices!',
    icon: '🔮',
    color: 'plasma-purple',
    gradient: 'from-plasma-purple to-plasma-blue',
  },
  {
    id: 2,
    title: 'Budget Allocation',
    subtitle: 'The 50-30-20 Rule',
    description: 'Divide your money wisely into needs, wants, and savings.',
    icon: '🏦',
    color: 'plasma-blue',
    gradient: 'from-plasma-blue to-nova-green',
  },
  {
    id: 3,
    title: 'Expense Run',
    subtitle: 'A Month of Spending',
    description: 'Navigate real-world spending decisions across a simulated month.',
    icon: '🛒',
    color: 'nova-green',
    gradient: 'from-nova-green to-solar-yellow',
  },
  {
    id: 4,
    title: 'Crisis Management',
    subtitle: 'Expect the Unexpected',
    description: 'Handle surprise expenses and learn financial resilience.',
    icon: '⚡',
    color: 'comet-red',
    gradient: 'from-solar-yellow to-comet-red',
  },
  {
    id: 5,
    title: 'Financial Review',
    subtitle: 'Reflect & Grow',
    description: 'Review your journey and see how your decisions shaped your finances.',
    icon: '📊',
    color: 'solar-yellow',
    gradient: 'from-comet-red to-solar-yellow',
  },
];

/** Avatar options */
export const AVATARS = [
  { id: 'astronaut', emoji: '👨‍🚀', label: 'Astronaut' },
  { id: 'scientist', emoji: '🧑‍🔬', label: 'Scientist' },
  { id: 'explorer', emoji: '🧭', label: 'Explorer' },
  { id: 'pilot', emoji: '👩‍✈️', label: 'Pilot' },
  { id: 'robot', emoji: '🤖', label: 'Robot' },
  { id: 'alien', emoji: '👽', label: 'Alien' },
];

/* ========================================
   PHASE 1: THE SORTING CEREMONY
   ======================================== */

/** Drop zone definitions */
export const SORTING_ZONES = [
  {
    id: 'need',
    label: 'Need',
    icon: '✅',
    description: 'Essential for health, school, or safety',
    color: 'nova-green',
    glowClass: 'glow-green',
    bgGradient: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.05))',
    borderColor: 'rgba(52,211,153,0.4)',
  },
  {
    id: 'want',
    label: 'Want',
    icon: '⭐',
    description: 'Fun, luxury, or entertainment',
    color: 'solar-yellow',
    glowClass: 'glow-yellow',
    bgGradient: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))',
    borderColor: 'rgba(251,191,36,0.4)',
  },
  {
    id: 'smart',
    label: 'Smart Alternative',
    icon: '💡',
    description: 'A lower-cost or smarter option',
    color: 'plasma-blue',
    glowClass: 'glow-blue',
    bgGradient: 'linear-gradient(135deg, rgba(79,140,255,0.15), rgba(79,140,255,0.05))',
    borderColor: 'rgba(79,140,255,0.4)',
  },
];

/** Items to sort — exactly 6 as specified */
export const SORTING_ITEMS = [
  {
    id: 'si1',
    name: 'School Bus Pass',
    icon: '🚌',
    cost: 10,
    correctZone: 'need',
    explanation: 'A bus pass gets you to school safely every day. Transportation for education is a basic need!',
    wrongFeedback: {
      want: 'Hmm... this helps you get to school safely. That sounds like a need!',
      smart: `This is already essential — there's nothing to replace it with.`,
    },
  },
  {
    id: 'si2',
    name: 'Fancy LED School Bag',
    icon: '🎒',
    cost: 35,
    correctZone: 'want',
    explanation: 'A school bag is a need, but expensive branded bags with LED lights become a want. A regular bag works just fine!',
    wrongFeedback: {
      need: `A bag is a need, but a fancy LED one? That's more of a luxury upgrade!`,
      smart: 'There might be a smarter option, but this flashy bag is definitely a want first.',
    },
  },
  {
    id: 'si3',
    name: 'Homemade Lunch',
    icon: '🥪',
    cost: 5,
    correctZone: 'smart',
    explanation: 'Making lunch at home costs much less than buying it. You save money and can still eat well!',
    wrongFeedback: {
      need: 'Food is a need, but homemade lunch is the *smart* way to meet that need.',
      want: `This isn't a luxury — it's actually a clever way to save money!`,
    },
  },
  {
    id: 'si4',
    name: 'Brand Sneakers',
    icon: '👟',
    cost: 45,
    correctZone: 'want',
    explanation: 'Shoes can be a need, but expensive branded sneakers become a want. You can find good shoes for less!',
    wrongFeedback: {
      need: `Shoes are a need, but *brand name* sneakers? That's a want!`,
      smart: 'There may be a smarter option, but brand sneakers are definitely a want.',
    },
  },
  {
    id: 'si5',
    name: 'Library Comic Rental',
    icon: '📖',
    cost: 0,
    correctZone: 'smart',
    explanation: 'Borrowing or renting comics from the library is FREE! You still get to enjoy reading without spending a cent.',
    wrongFeedback: {
      need: `Comics are fun, not essential. But renting free ones? That's smart!`,
      want: 'Buying comics would be a want — but renting free from the library is even smarter!',
    },
  },
  {
    id: 'si6',
    name: 'Prescription Glasses',
    icon: '👓',
    cost: 20,
    correctZone: 'need',
    explanation: 'If you need glasses to see, they are essential for your health and school performance. Definitely a need!',
    wrongFeedback: {
      want: `Without glasses you can't see clearly! This is essential for health.`,
      smart: 'Prescription glasses are a medical need — not something to find an alternative for.',
    },
  },
];

/** AI guide message pools */
export const AI_GUIDE = {
  intro: [
    'Welcome to the Money Academy Vault.',
    'Before you receive your monthly pocket money, you must prove you can protect it wisely.',
    'Sort each item into the correct zone. Show me your money wisdom!',
  ],
  correct: [
    'Smart thinking! 🧠',
    'Excellent choice! ⭐',
    "You're protecting your future money! 💰",
    'Spot on! You really know your stuff! 🎯',
    'Perfect! Your money wisdom is growing! 📈',
    `Brilliant! That's exactly right! ✨`,
  ],
  wrong: {
    need: "Hmm... life would still continue without this. Think again!",
    want: "This helps with safety, school, or health. Is it really just a want?",
    smart: "There may be a smarter, lower-cost option. But is this one?",
  },
  completion: [
    'Congratulations! 🎉',
    'You unlocked your monthly budget!',
    'You proved you can tell the difference between needs, wants, and smart alternatives.',
    "You're ready to manage real money wisely!",
  ],
};

/* ========================================
   PHASE 2: BUDGET ALLOCATION
   ======================================== */

/** Budget jar definitions */
export const BUDGET_JARS = [
  {
    id: 'needs',
    label: 'Needs',
    icon: '✅',
    emoji: '🏥',
    targetPct: 50,
    targetAmount: 55,
    purpose: 'School, health, transport, essentials',
    color: 'nova-green',
    rgb: '52, 211, 153',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.25), rgba(52,211,153,0.08))',
    borderColor: 'rgba(52,211,153,0.4)',
    lesson: 'Needs keep your daily life running. Always fund these first!',
  },
  {
    id: 'wants',
    label: 'Wants',
    icon: '⭐',
    emoji: '🎮',
    targetPct: 30,
    targetAmount: 33,
    purpose: 'Entertainment, fun, upgrades',
    color: 'solar-yellow',
    rgb: '251, 191, 36',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.25), rgba(251,191,36,0.08))',
    borderColor: 'rgba(251,191,36,0.4)',
    lesson: 'Wants are okay when balanced carefully. Enjoy, but stay in control!',
  },
  {
    id: 'savings',
    label: 'Savings',
    icon: '💎',
    emoji: '🔮',
    targetPct: 20,
    targetAmount: 22,
    purpose: 'Future goals and emergencies',
    color: 'plasma-blue',
    rgb: '79, 140, 255',
    gradient: 'linear-gradient(135deg, rgba(79,140,255,0.25), rgba(79,140,255,0.08))',
    borderColor: 'rgba(79,140,255,0.4)',
    lesson: 'Saving today protects tomorrow. Your future self will thank you!',
  },
];

/** Phase 2 AI guide messages */
export const PHASE2_AI = {
  intro: [
    'Great job unlocking your money!',
    'Now you must learn how to divide it wisely.',
    'Use the 50-30-20 rule: 50% Needs, 30% Wants, 20% Savings.',
  ],
  overfillWants: `Whoa! Your Wants jar is getting too heavy. If fun spending grows too much, future problems become harder to handle.`,
  neglectSavings: `Your future jar looks almost empty. Savings protect you from surprises later.`,
  neglectNeeds: `Your Needs jar is too low! Essentials like school and health come first.`,
  goodBalance: `Excellent balance! You're thinking like a smart planner. 🧠`,
  nearTarget: `Almost there! Fine-tune your allocation to hit the targets.`,
  completion: [
    'Budget Complete! 🎉',
    'Every Unit now has a purpose.',
    `You've mastered the 50-30-20 rule!`,
    `You're ready to start spending wisely.`,
  ],
};

/* ========================================
   PHASE 3: THE EXPENSE RUN
   ======================================== */

/** Week-by-week event data */
export const PHASE3_WEEKS = [
  {
    id: 1,
    title: 'Essential Expenses',
    subtitle: 'Bills come first',
    icon: '📋',
    intro: 'Week 1 begins. Your essential bills have arrived — these must be paid.',
    events: [
      {
        id: 'w1e1',
        type: 'mandatory',
        title: 'School Project Supplies',
        description: 'Your science project is due. You need poster board, markers, and glue.',
        icon: '🎨',
        cost: 40,
        category: 'needs',
        lesson: 'School supplies are a need — education always comes first.',
      },
      {
        id: 'w1e2',
        type: 'mandatory',
        title: 'Weekly Bus Fare',
        description: 'You need to get to school every day this week.',
        icon: '🚌',
        cost: 15,
        category: 'needs',
        lesson: 'Transportation to school is a basic need you cannot skip.',
      },
    ],
    aiEnd: 'Great job. Needs come first because they keep life moving.',
  },
  {
    id: 2,
    title: 'The Temptation',
    subtitle: 'Peer pressure arrives',
    icon: '🎭',
    intro: 'Week 2. Your friends have exciting plans — but your wallet has limits.',
    events: [
      {
        id: 'w2e1',
        type: 'choice',
        title: 'Limited Edition Comic Book',
        description: 'Your friends are buying a Limited Edition Comic Book. Everyone is talking about it!',
        icon: '📚',
        category: 'wants',
        choices: [
          {
            id: 'buy_new',
            label: 'Buy New Comic',
            icon: '🛒',
            cost: 25,
            happiness: 15,
            badge: null,
            feedback: 'Fun purchase! But it took a big chunk of your Wants budget.',
          },
          {
            id: 'borrow',
            label: 'Borrow From Friend',
            icon: '🤝',
            cost: 0,
            happiness: 5,
            badge: { title: 'Social Connector', icon: '🤝', points: 15 },
            feedback: 'Smart move! You still get to enjoy it AND keep your money.',
          },
          {
            id: 'buy_used',
            label: 'Buy Used Comic',
            icon: '♻️',
            cost: 10,
            happiness: 10,
            badge: { title: 'Smart Shopper', icon: '🧠', points: 20 },
            feedback: 'A used copy is just as fun to read — and half the price!',
          },
          {
            id: 'skip',
            label: 'Skip It',
            icon: '⏭️',
            cost: 0,
            happiness: -3,
            badge: null,
            feedback: "It's okay to say no. You can always read it later at the library!",
          },
        ],
        lesson: 'Borrowing or buying used can be just as fun — and much smarter for your wallet.',
      },
    ],
    aiEnd: 'Every spending choice shapes your month. Balance is key!',
  },
  {
    id: 3,
    title: 'Small Daily Decisions',
    subtitle: 'Little costs add up',
    icon: '🍦',
    intro: 'Week 3. Small temptations pop up every day — stay sharp!',
    events: [
      {
        id: 'w3e1',
        type: 'choice',
        title: 'Ice Cream After School',
        description: 'It is a hot day and your friends are heading to the ice cream shop.',
        icon: '🍦',
        category: 'wants',
        choices: [
          {
            id: 'buy_ice',
            label: 'Buy Ice Cream',
            icon: '🍨',
            cost: 5,
            happiness: 6,
            badge: null,
            feedback: 'A small treat feels great! Just watch those small costs.',
          },
          {
            id: 'share_ice',
            label: 'Share With Friend',
            icon: '🤝',
            cost: 3,
            happiness: 5,
            badge: null,
            feedback: 'Sharing is fun AND cheaper. Nice thinking!',
          },
          {
            id: 'skip_ice',
            label: 'Drink Water Instead',
            icon: '💧',
            cost: 0,
            happiness: -1,
            badge: null,
            feedback: 'Water is free and healthy. Smart self-control!',
          },
        ],
        lesson: 'Small purchases can slowly drain your budget without you noticing.',
      },
      {
        id: 'w3e2',
        type: 'choice',
        title: 'Mobile Game Skin',
        description: 'A cool new character skin is on sale in your favorite game. Limited time only!',
        icon: '🎮',
        category: 'wants',
        choices: [
          {
            id: 'buy_skin',
            label: 'Buy the Skin',
            icon: '✨',
            cost: 8,
            happiness: 8,
            badge: null,
            feedback: 'Looks cool! But digital items can add up fast.',
          },
          {
            id: 'use_free',
            label: 'Use Free Skin',
            icon: '🆓',
            cost: 0,
            happiness: 0,
            badge: { title: 'Wise Gamer', icon: '🎮', points: 10 },
            feedback: 'Free skins work just fine. Your gameplay is what really matters!',
          },
        ],
        lesson: 'Digital purchases feel small but add up. Ask yourself: will this still matter next week?',
      },
      {
        id: 'w3e3',
        type: 'choice',
        title: 'Snack With Friends',
        description: 'Your group is getting chips and juice from the corner shop after school.',
        icon: '🧃',
        category: 'wants',
        choices: [
          {
            id: 'buy_snack',
            label: 'Buy Snack Pack',
            icon: '🍿',
            cost: 4,
            happiness: 4,
            badge: null,
            feedback: 'Fun with friends! But small snack runs add up over a month.',
          },
          {
            id: 'bring_own',
            label: 'Bring Snack From Home',
            icon: '🥪',
            cost: 0,
            happiness: 3,
            badge: null,
            feedback: 'Bringing your own is free and you still get to hang out!',
          },
        ],
        lesson: 'Fun spending is healthiest when balanced. You can enjoy time with friends without spending every time.',
      },
    ],
    aiEnd: 'Small purchases can slowly drain your budget. Every coin counts!',
  },
  {
    id: 4,
    title: 'Month End',
    subtitle: 'How did you do?',
    icon: '📅',
    intro: 'Week 4. The month is almost over. Time to see where you stand.',
    events: [],
    aiEnd: 'You made it through the month. But surprises can happen anytime...',
  },
];

/** Phase 3 AI guide messages */
export const PHASE3_AI = {
  intro: [
    'Your budget is ready.',
    `Now let's see if it survives a real month.`,
  ],
  mandatoryPaid: 'Bills paid! The essentials are covered. ✅',
  weekComplete: 'Another week down. Keep watching your balance!',
  microLessons: [
    'Small purchases can slowly drain your budget.',
    'Borrowing can sometimes be smarter than buying.',
    'Fun spending is healthiest when balanced.',
    'Good budgeting creates flexibility.',
    'Ask yourself: do I need it, or just want it right now?',
  ],
  completion: [
    'You made it through the month! 🎉',
    'But surprises can happen anytime...',
    'Ready for the unexpected?',
  ],
};

/* ========================================
   PHASE 4: CRISIS MANAGEMENT
   ======================================== */

/** Emergency event definition */
export const PHASE4_EMERGENCY = {
  title: 'School Bag Emergency',
  icon: '🎒',
  alertIcon: '⚠️',
  description: 'Your school bag zipper broke completely. You need a replacement bag before school tomorrow.',
  replaceCost: 20,
  repairCost: 8,
  emergencyAccessCost: 3,
  /** Resolution options — dynamically filtered based on player state */
  options: [
    {
      id: 'replace_wants',
      label: 'Buy New Bag',
      sublabel: 'Use Wants money',
      icon: '🛍️',
      source: 'wants',
      cost: 20,
      happinessChange: -5,
      stabilityChange: 0,
      condition: 'hasEnoughWants', // wants >= 20
      feedback: 'You used your flexible spending to cover the emergency. Smart budget management!',
      lesson: 'Because you avoided overspending earlier, your budget stayed flexible.',
    },
    {
      id: 'repair_wants',
      label: 'Repair Old Bag',
      sublabel: 'Cheaper fix from Wants',
      icon: '🔧',
      source: 'wants',
      cost: 8,
      happinessChange: -3,
      stabilityChange: 5,
      condition: 'hasEnoughWantsForRepair', // wants >= 8
      badge: { title: 'Resourceful Fixer', icon: '🔧', points: 25 },
      feedback: 'Repairing costs less than replacing — and your bag works just fine!',
      lesson: 'Repairing can sometimes be smarter and cheaper than replacing.',
    },
    {
      id: 'replace_savings',
      label: 'Buy New Bag',
      sublabel: 'Break into Savings',
      icon: '💎',
      source: 'savings',
      cost: 20,
      accessCost: 3, // Emergency Access Cost
      totalCost: 23,
      happinessChange: -10,
      stabilityChange: -15,
      condition: 'mustUseSavings', // wants < 20
      feedback: 'You had to dip into savings. The emergency is solved, but your safety net is smaller now.',
      lesson: 'Savings exist to protect you when unexpected problems happen. Using them is not failure — it is preparation.',
    },
    {
      id: 'repair_savings',
      label: 'Repair Old Bag',
      sublabel: 'Smaller savings dip',
      icon: '🔧',
      source: 'savings',
      cost: 8,
      accessCost: 2,
      totalCost: 10,
      happinessChange: -5,
      stabilityChange: -8,
      condition: 'mustUseSavingsForRepair', // wants < 8
      badge: { title: 'Resourceful Fixer', icon: '🔧', points: 25 },
      feedback: 'Repairing with a small savings dip — you minimized the damage!',
      lesson: 'Even in emergencies, choosing the cheaper option protects your future.',
    },
  ],
};

/** Phase 4 AI guide messages */
export const PHASE4_AI = {
  intro: [
    'You handled normal spending well...',
    'But real life can still surprise you.',
  ],
  hasFlexibility: `Great job keeping some flexibility in your budget. You can use your remaining Wants money to handle this emergency.`,
  mustUseSavings: `Your Wants money is not enough to cover this emergency. You must use your Savings Jar.`,
  savingsReassurance: `Remember: savings are not meant to sit untouched forever. They exist to protect you when unexpected problems happen.`,
  resolved: `You adapted to an unexpected problem. That's what real budgeting is about.`,
  microLessons: [
    'Emergencies become easier when money is reserved ahead of time.',
    'Flexibility is one of the most powerful financial skills.',
    'Saving creates protection, not restriction.',
    'Repairing can sometimes reduce costs dramatically.',
    'Financial resilience means bouncing back from surprises.',
  ],
  completion: [
    'Crisis resolved! 🎉',
    `You proved you can handle the unexpected.`,
    'Financial resilience is a superpower.',
  ],
};

/** Stability thresholds */
export const STABILITY_LEVELS = {
  high: { min: 70, label: 'Stable', emoji: '🟢', color: '52,211,153' },
  medium: { min: 40, label: 'Cautious', emoji: '🟡', color: '251,191,36' },
  low: { min: 0, label: 'At Risk', emoji: '🔴', color: '248,113,113' },
};

/* ========================================
   PHASE 5: THE FINANCIAL REVIEW
   ======================================== */

/** Financial personality types */
export const PHASE5_PERSONALITIES = [
  {
    id: 'careful_planner',
    title: 'The Careful Planner',
    emoji: '📋',
    description: 'You balance fun and future thinking well. Every coin has purpose in your world.',
    color: 'nova-green',
    rgb: '52,211,153',
    condition: (stats) => stats.savingsRemaining >= 18 && stats.wantsSpent <= 20,
  },
  {
    id: 'smart_saver',
    title: 'The Smart Saver',
    emoji: '💎',
    description: 'You protect your money carefully and adapt well to surprises. Your future self thanks you!',
    color: 'plasma-blue',
    rgb: '79,140,255',
    condition: (stats) => stats.savingsRemaining >= 15 && stats.badgeCount >= 1,
  },
  {
    id: 'flexible_thinker',
    title: 'The Flexible Thinker',
    emoji: '🧠',
    description: 'You use alternatives and creative solutions wisely. Not every problem needs a big spend!',
    color: 'plasma-purple',
    rgb: '168,85,247',
    condition: (stats) => stats.badgeCount >= 2,
  },
  {
    id: 'big_spender',
    title: 'The Experience Lover',
    emoji: '🎉',
    description: 'You enjoy life to the fullest! With a little more planning, you can enjoy AND protect your future.',
    color: 'solar-yellow',
    rgb: '251,191,36',
    condition: (stats) => stats.wantsSpent >= 25,
  },
  {
    id: 'balanced',
    title: 'The Budget Explorer',
    emoji: '🌟',
    description: 'You explored spending and saving with curiosity. Every month is a learning opportunity!',
    color: 'plasma-blue',
    rgb: '79,140,255',
    condition: () => true, // fallback
  },
];

/** Future savings goals */
export const PHASE5_GOALS = [
  { id: 'bicycle', title: 'Mountain Bicycle', emoji: '🚲', cost: 150, icon: '🚲' },
  { id: 'console', title: 'Gaming Console', emoji: '🎮', cost: 200, icon: '🎮' },
  { id: 'art_kit', title: 'Professional Art Kit', emoji: '🎨', cost: 80, icon: '🎨' },
  { id: 'cricket', title: 'Cricket Bat', emoji: '🏏', cost: 60, icon: '🏏' },
];

/** Phase 5 AI guide messages */
export const PHASE5_AI = {
  intro: [
    'Every financial decision leaves a pattern.',
    `Let's review how your month went.`,
  ],
  wellManaged: `Excellent balance! You enjoyed your money while still protecting your future.`,
  overspent: `You enjoyed more spending early in the month, but your emergency protection became weaker later.`,
  smartChoices: `You made creative choices that saved money without losing fun. That's true financial wisdom!`,
  completion: [
    'You completed your first financial month simulation! 🎉',
    'Every month teaches something new.',
    `You're now a certified Financial Explorer!`,
  ],
  microLessons: [
    'Small decisions create big patterns over time.',
    'Balanced spending protects future choices.',
    'Saving creates flexibility.',
    'Smart alternatives can reduce stress later.',
    'Budgets work best when they adapt.',
    'Reflection is the first step to improvement.',
  ],
};
