import { BudgetCategory, EventPlan, EventType } from './schemas';

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  wedding: 'Grand Wedding',
  birthday: 'Birthday Celebration',
  community: 'Community Gathering / Festival',
  corporate: 'Corporate Gala / Seminar',
  anniversary: 'Anniversary Celebration',
  other: 'Special Event',
};

export const BUDGET_CATEGORIES: {
  key: BudgetCategory;
  label: string;
  defaultPercentage: number;
  icon: string;
  description: string;
}[] = [
  {
    key: 'venue',
    label: 'Venue & Facilities',
    defaultPercentage: 30,
    icon: '🏰',
    description: 'Banquet halls, lawns, resort booking, power backup, security',
  },
  {
    key: 'catering',
    label: 'Catering & Beverages',
    defaultPercentage: 30,
    icon: '🍽️',
    description: 'Food counters, live stalls, mocktails/bar, waitstaff, desserts',
  },
  {
    key: 'decor',
    label: 'Decor & Production',
    defaultPercentage: 15,
    icon: '✨',
    description: 'Stage, florals, lighting, entrance arch, table centerpieces',
  },
  {
    key: 'photography',
    label: 'Photo & Videography',
    defaultPercentage: 10,
    icon: '📸',
    description: 'Candid photographer, cinematic video, drone footage, photo booth',
  },
  {
    key: 'entertainment',
    label: 'Music & Entertainment',
    defaultPercentage: 7,
    icon: '🎵',
    description: 'DJ, sound system, emcee, live band, cultural performers',
  },
  {
    key: 'attire',
    label: 'Attire & Styling',
    defaultPercentage: 5,
    icon: '👗',
    description: 'Apparel, makeup artist, hairstyling, accessories, grooming',
  },
  {
    key: 'misc',
    label: 'Gifts & Contingency',
    defaultPercentage: 3,
    icon: '🎁',
    description: 'Return favors, print invitations, logistics, buffer fund',
  },
];

export const POPULAR_INDIAN_CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Jaipur',
  'Ahmedabad',
  'Goa',
  'Udaipur',
  'Chandigarh',
  'Kochi',
  'Lucknow',
];

/**
 * Curated High-Fidelity Demo Plan for Indian Wedding
 */
export const SAMPLE_WEDDING_PLAN: EventPlan = {
  id: 'plan-demo-wedding-2026',
  createdAt: '2026-10-26T00:00:00.000Z',
  updatedAt: '2026-10-26T00:00:00.000Z',
  eventInput: {
    eventType: 'wedding',
    eventName: 'Aarav & Meera Royal Celebration',
    date: '2026-12-18',
    guestCount: 350,
    totalBudget: 1500000,
    city: 'Jaipur',
    themePreferences: 'Royal Rajasthani Heritage with Marigold & Rose gold accents',
    dietaryNeeds: 'Pure Vegetarian, Jain food counter, live chaat counter',
    additionalNotes: 'Need 2-day coordination: Sangeet on Day 1 and Wedding Ceremony on Day 2',
  },
  summary:
    'A majestic royal heritage wedding celebration in Jaipur combining traditional Marwari hospitality with contemporary eco-conscious aesthetics for 350 valued guests.',
  budgetBreakdown: [
    {
      id: 'b-1',
      category: 'venue',
      name: 'Heritage Haveli Resort & Lawn (2 Days)',
      allocatedAmount: 450000,
      percentage: 30,
      actualSpent: 425000,
      notes:
        'Includes air-conditioned banquet hall, manicured lawn, and 10 rooms for immediate family.',
    },
    {
      id: 'b-2',
      category: 'catering',
      name: 'Gourmet Multi-Cuisine Royal Feast',
      allocatedAmount: 450000,
      percentage: 30,
      actualSpent: 440000,
      notes:
        'Dal Baati Churma royal spread, Italian pasta counter, Jain selections, live jalebi & rabdi.',
    },
    {
      id: 'b-3',
      category: 'decor',
      name: 'Mandap, Sangeet Stage & Floral Lighting',
      allocatedAmount: 225000,
      percentage: 15,
      actualSpent: 210000,
      notes:
        'Fresh marigold drapes, fairy light canopy, brass diya centerpieces, custom photo booth.',
    },
    {
      id: 'b-4',
      category: 'photography',
      name: 'Cinematic Drone & Candid Team',
      allocatedAmount: 150000,
      percentage: 10,
      actualSpent: 150000,
      notes:
        '2 Candid photographers, 2 cinematic videographers, drone coverage, 40-page flush mount album.',
    },
    {
      id: 'b-5',
      category: 'entertainment',
      name: 'DJ, Dhol Troupe & Rajasthani Folk Artists',
      allocatedAmount: 105000,
      percentage: 7,
      actualSpent: 95000,
      notes:
        'Top club DJ with line-array sound, Sangeet anchor/emcee, 4 Punjabi dhol players for Baraat.',
    },
    {
      id: 'b-6',
      category: 'attire',
      name: 'Bridal/Groom Styling & Makeup Artistry',
      allocatedAmount: 75000,
      percentage: 5,
      actualSpent: 70000,
      notes:
        'HD airbrush bridal makeup, hair styling for bride and mother of the bride, groom styling.',
    },
    {
      id: 'b-7',
      category: 'misc',
      name: 'Handcrafted Favors, Invites & Contingency',
      allocatedAmount: 45000,
      percentage: 3,
      actualSpent: 30000,
      notes:
        'Blue pottery gift boxes with organic tea, digital video cards, transport shuttle for elders.',
    },
  ],
  timeline: [
    {
      id: 't-1',
      timeframe: '6 Months Before',
      title: 'Finalize and Lock Venue Dates',
      description:
        'Book Jaipur heritage resort with 25% advance token; confirm power backup and curfew policies.',
      category: 'Venue',
      completed: true,
      priority: 'high',
      dueDate: '2026-06-18',
    },
    {
      id: 't-2',
      timeframe: '4 Months Before',
      title: 'Book Catering Menu & Tasting Session',
      description:
        'Conduct food tasting with caterer; finalize menu items including Jain and vegan live counters.',
      category: 'Catering',
      completed: true,
      priority: 'high',
      dueDate: '2026-08-18',
    },
    {
      id: 't-3',
      timeframe: '3 Months Before',
      title: 'Contract Photographer & Sangeet Choreographer',
      description:
        'Confirm deliverable timelines (teaser in 7 days, full film in 45 days). Start family dance rehearsals.',
      category: 'Entertainment',
      completed: true,
      priority: 'medium',
      dueDate: '2026-09-18',
    },
    {
      id: 't-4',
      timeframe: '2 Months Before',
      title: 'Send Digital Save-The-Dates & Lock Decor Specs',
      description: 'Dispatch WhatsApp motion invite; approve 3D stage renders with florists.',
      category: 'Decor',
      completed: false,
      priority: 'medium',
      dueDate: '2026-10-18',
    },
    {
      id: 't-5',
      timeframe: '1 Month Before',
      title: 'Bridal Makeup Trial & Attire Alterations',
      description:
        'Complete trial session with HD makeup artist; perform final fittings for Sangeet lehenga and Sherwani.',
      category: 'Attire',
      completed: false,
      priority: 'high',
      dueDate: '2026-11-18',
    },
    {
      id: 't-6',
      timeframe: '2 Weeks Before',
      title: 'Final Guest RSVP Count & Seating Plan',
      description:
        'Confirm final headcount with caterer to avoid wastage; arrange airport/station pickup cabs.',
      category: 'Logistics',
      completed: false,
      priority: 'medium',
      dueDate: '2026-12-04',
    },
    {
      id: 't-7',
      timeframe: '1 Week Before',
      title: 'Emergency Kit & Cash Envelopes Preparation',
      description:
        'Prepare tips/honorarium envelopes, emergency safety pins, first-aid, power banks, and itinerary printouts.',
      category: 'Misc',
      completed: false,
      priority: 'high',
      dueDate: '2026-12-11',
    },
    {
      id: 't-8',
      timeframe: 'Day of Event',
      title: 'Baraat Assembly & Mandap Puja Checklist',
      description:
        'Verify sound permissions, cold pyros setup, varmala garlands kept fresh in chiller box.',
      category: 'Coordination',
      completed: false,
      priority: 'high',
      dueDate: '2026-12-18',
    },
  ],
  vendorChecklist: [
    {
      id: 'v-1',
      category: 'Venue',
      name: 'Royal Heritage Haveli & Resort',
      questionsToAsk: [
        'Is sound allowed outdoors past 10 PM?',
        'What is the in-house generator backup capacity?',
        'Are outside caterers or decorators permitted with royalty fees?',
      ],
      estimatedCostMin: 400000,
      estimatedCostMax: 480000,
      booked: true,
      contactNotes: 'Mr. Rathore (General Manager) - 98290XXXXX. Advance 30% deposited.',
    },
    {
      id: 'v-2',
      category: 'Catering',
      name: 'Shree Radhey Gourmet Catering',
      questionsToAsk: [
        'How many service boys per 20 guests?',
        'Can separate Jain prep tables be set up?',
        'Do you provide mineral water dispensaries and food heating chafers?',
      ],
      estimatedCostMin: 420000,
      estimatedCostMax: 470000,
      booked: true,
      contactNotes: 'Includes cutlery, bone-china plates, and copper serving buckets.',
    },
    {
      id: 'v-3',
      category: 'Photography',
      name: 'Vivid Frames Cinematic Studios',
      questionsToAsk: [
        'Will drone permissions be arranged by the photography team?',
        'Who owns raw footage and uncompressed camera files?',
        'How many total crew members will be present on-site?',
      ],
      estimatedCostMin: 130000,
      estimatedCostMax: 160000,
      booked: true,
      contactNotes: '4-person crew confirmed for both Sangeet and Wedding day.',
    },
    {
      id: 'v-4',
      category: 'Decor & Flowers',
      name: 'Marigold & Miracles Floral Studio',
      questionsToAsk: [
        'Are flowers fresh local or imported orchids?',
        'Can mockups of table centerpieces be previewed beforehand?',
        'Does price include tear-down cleanup after the ceremony?',
      ],
      estimatedCostMin: 200000,
      estimatedCostMax: 240000,
      booked: false,
      contactNotes:
        'Quote under negotiation; waiting for revised proposal with brass lamp accents.',
    },
    {
      id: 'v-5',
      category: 'DJ & Sound',
      name: 'Bassline Productions Jaipur',
      questionsToAsk: [
        'Do you have wireless Sennheiser microphones for family performances?',
        'What lighting truss setup is included with the DJ console?',
      ],
      estimatedCostMin: 70000,
      estimatedCostMax: 95000,
      booked: false,
      contactNotes: 'Meeting scheduled for coming Saturday to finalize playlist.',
    },
    {
      id: 'v-6',
      category: 'Makeup & Hair',
      name: 'Glow Artistry by Sunita',
      questionsToAsk: [
        'Does bridal package include draping and false lashes?',
        'Will you travel to the venue location?',
      ],
      estimatedCostMin: 45000,
      estimatedCostMax: 65000,
      booked: true,
      contactNotes: 'Trial approved, advance ₹15,000 transferred.',
    },
  ],
  personalizedIdeas: {
    themes: [
      'Royal Rajwada: Rich marigold, gold zari fabrics, antique lanterns, and velvet cushions',
      'Botanical Oasis: Lush eucalyptus foliage, fairy light tunnels, and rose gold geometric installations',
      'Sunset Pastel Symphony: Peach, mint green, and blush pink hues with live acoustic instrumentalists',
    ],
    decor: [
      'Grand arched entrance with brass bells and cascading tuberose (mogra) scent',
      'Floating lotus candle installations in stone urli bowls across the courtyard',
      'Photo wall with neon sign "#AaravFoundHisMeera" framed with wild pampas grass and bougainvillea',
      'Bespoke royal shamiana canopies with brass finials for elderly seating',
    ],
    menu: [
      'Welcome drinks: Royal Kesar Kasturi Thandai, Kokum Mint Cooler, and Fresh Coconut Water with monogrammed paper straws',
      'Live Chaat Bazaar: Delhi-style Golgappe with 5 flavored waters, Aloo Tikki sliders, and Palak Patta Chaat',
      'Main Course: Paneer Lababdar, Dal Baati Churma with 3 chutneys, Kashmiri Dum Aloo, and Subz Dum Biryani',
      'Dessert Studio: Warm Malpua with Rabdi shots, Nitrogen Paan spheres, and Artisanal Kulfi counter',
    ],
    activities: [
      'Family Trivia game on giant screen during high-tea: "Who Knows The Couple Best?"',
      'Interactive Live Lac Bangle Maker counter gifting customized bangles to ladies',
      'Instant Polaroid guestbook station where guests snap a photo and write wedding blessings',
      'Flash mob surprise performance by cousins during the Baraat arrival',
    ],
    returnGifts: [
      'Eco-friendly Jaipur Blue Pottery keepsake jars filled with saffron-infused almonds and raw forest honey',
      'Handmade aromatic soy wax candles infused with jasmine and sandalwood',
      'Personalized plantable seed paper thank-you cards with custom couple monogram wax seal',
    ],
  },
  proTips: [
    'Always lock 10% extra buffer on catering plates to accommodate last-minute guest additions without penalty.',
    'Ask the venue manager for a dedicated coordinator contact with phone numbers active after 8 PM.',
    'Schedule couple portraits 45 minutes before guest arrival to capture golden-hour lighting without distraction.',
    'Keep an offline digital copy of all vendor contracts and payment slips on Google Drive with shared family access.',
  ],
};

/**
 * Curated High-Fidelity Demo Plan for Birthday Party
 */
export const SAMPLE_BIRTHDAY_PLAN: EventPlan = {
  id: 'plan-demo-birthday-2026',
  createdAt: '2026-10-26T00:00:00.000Z',
  updatedAt: '2026-10-26T00:00:00.000Z',
  eventInput: {
    eventType: 'birthday',
    eventName: 'Ananya 10th Superhero Space Odyssey',
    date: '2026-11-28',
    guestCount: 60,
    totalBudget: 120000,
    city: 'Bengaluru',
    themePreferences: 'Cosmic Galaxy & Neon Astronauts',
    dietaryNeeds: 'Kid-friendly, nut-free snacks, eggless chocolate cake',
    additionalNotes: 'Need high-energy games, magic show, and return gift packages',
  },
  summary:
    'An exhilarating interstellar galactic adventure party celebrating Ananya’s 10th birthday with immersive neon decor, live science experiments, and delectable gourmet kid-friendly treats.',
  budgetBreakdown: [
    {
      id: 'bb-1',
      category: 'venue',
      name: 'Rooftop Community Clubhouse & Terrace',
      allocatedAmount: 36000,
      percentage: 30,
      actualSpent: 30000,
      notes: 'Includes indoor air-conditioned activity hall and outdoor games lawn.',
    },
    {
      id: 'bb-2',
      category: 'catering',
      name: 'Kids Snack Feast & Beverage Bar',
      allocatedAmount: 36000,
      percentage: 30,
      actualSpent: 35000,
      notes: 'Mini burgers, wood-fired thin crust pizza, nachos fountain, fresh fruit mocktails.',
    },
    {
      id: 'bb-3',
      category: 'decor',
      name: 'Galactic Balloon Arch & Neon Backdrop',
      allocatedAmount: 20000,
      percentage: 16.7,
      actualSpent: 18000,
      notes: 'Deep violet/navy balloon garland, astronaut cutouts, LED neon number "10" sign.',
    },
    {
      id: 'bb-4',
      category: 'entertainment',
      name: 'Mad Science Show & Game Coordinator',
      allocatedAmount: 14000,
      percentage: 11.6,
      actualSpent: 14000,
      notes: 'Liquid nitrogen ice cream demo, rocket launch experiment, treasure hunt.',
    },
    {
      id: 'bb-5',
      category: 'photography',
      name: 'Pro Event Photographer (3 Hours)',
      allocatedAmount: 8000,
      percentage: 6.7,
      actualSpent: 8000,
      notes: 'High-res digital album delivered within 48 hours with social media highlights.',
    },
    {
      id: 'bb-6',
      category: 'misc',
      name: 'Custom Space Cakes & Return Favors',
      allocatedAmount: 6000,
      percentage: 5,
      actualSpent: 5500,
      notes: '3 kg 2-tier galaxy cake with glow-in-dark astronaut backpacks for return gifts.',
    },
  ],
  timeline: [
    {
      id: 'bt-1',
      timeframe: '4 Weeks Before',
      title: 'Confirm Clubhouse Booking & Cake Baker',
      description: 'Book clubhouse time slots and finalize eggless Belgian chocolate cake design.',
      category: 'Venue & Cake',
      completed: true,
      priority: 'high',
      dueDate: '2026-10-31',
    },
    {
      id: 'bt-2',
      timeframe: '2 Weeks Before',
      title: 'Send Animated Space Mission Invites',
      description:
        'Create customized RSVP invites calling all "Junior Astronauts". Track dietary notes.',
      category: 'Invites',
      completed: true,
      priority: 'medium',
      dueDate: '2026-11-14',
    },
    {
      id: 'bt-3',
      timeframe: '1 Week Before',
      title: 'Assemble Return Gift Bags & Activity Props',
      description: 'Pack DIY telescope kits, astronaut patches, and glow sticks for all 35 kids.',
      category: 'Favors',
      completed: false,
      priority: 'medium',
      dueDate: '2026-11-21',
    },
    {
      id: 'bt-4',
      timeframe: 'Day of Event',
      title: 'Balloon Setup & Science Show Readiness',
      description:
        'Sound check for wireless lapel mic; ensure dry ice and props ready in prep room.',
      category: 'Execution',
      completed: false,
      priority: 'high',
      dueDate: '2026-11-28',
    },
  ],
  vendorChecklist: [
    {
      id: 'bv-1',
      category: 'Entertainment',
      name: 'Dr. Spark Science Magic Crew',
      questionsToAsk: ['Are dry ice and vapor experiments 100% child safe?'],
      estimatedCostMin: 12000,
      estimatedCostMax: 15000,
      booked: true,
      contactNotes: '45-minute interactive science show + 30-minute games coordination.',
    },
    {
      id: 'bv-2',
      category: 'Cake Artist',
      name: 'Sugar & Stardust Patisserie',
      questionsToAsk: ['Can cake be delivered in a temperature-controlled van?'],
      estimatedCostMin: 4500,
      estimatedCostMax: 6500,
      booked: true,
      contactNotes: 'Dark chocolate ganache with edible luster glitter dust.',
    },
  ],
  personalizedIdeas: {
    themes: [
      'Mission to Mars: Orange neon lighting, crater rock textures, and silver space suits',
      'Cosmic Nebula: Purple UV blacklight party with glow-in-the-dark face paints',
    ],
    decor: [
      'Inflatable giant astronaut greeting kids at the entrance',
      'Ceiling constellation projection creating moving stars across the room',
      'Rocket ship photo booth with wearable cardboard helmets',
    ],
    menu: [
      '"Meteorite" cheese balls and crisp herb potato wedges',
      '"Rocket" corn dogs and mini falafel pita pockets',
      '"Galaxy Fizz" blue curacao mocktail with pop rocks rim',
      'Liquid nitrogen frozen chocolate cookie crumb clouds',
    ],
    activities: [
      'DIY Planetarium craft table where kids decorate glowing alien slime',
      'Laser Maze obstacle course with yarn and bell alarms',
      'Interstellar quiz game with mini prizes for team winners',
    ],
    returnGifts: [
      'Mini brass kaleidoscope and solar system 3D sticker kit',
      'Glow-in-the-dark star maps and personalized astronaut badge',
    ],
  },
  proTips: [
    'Keep organized activities capped at 25-30 minutes each so children do not get overwhelmed.',
    'Have a designated parent relaxation lounge with gourmet coffee and finger sandwiches.',
    'Cut the cake early during the midpoint of the party while kids are energized for photos.',
  ],
};
