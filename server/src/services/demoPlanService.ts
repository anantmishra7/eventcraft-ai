import {
  EventPlan,
  EventSetupInput,
  BUDGET_CATEGORIES,
  SAMPLE_WEDDING_PLAN,
  SAMPLE_BIRTHDAY_PLAN,
  BudgetItem,
  TimelineTask,
  VendorItem,
} from '@eventcraft/shared';

/**
 * Generates an intelligent, customized EventPlan when running in Demo Mode
 * or when Gemini API is unavailable.
 */
export function generateDemoPlan(input: EventSetupInput): EventPlan {
  const planId = `plan-demo-${Date.now()}`;
  const now = new Date().toISOString();
  const total = input.totalBudget;

  // 1. Calculate realistic budget breakdown summing precisely to input.totalBudget
  const budgetBreakdown: BudgetItem[] = BUDGET_CATEGORIES.map((cat, idx) => {
    // Round to nearest 100
    let allocated = Math.round((total * cat.defaultPercentage) / 100 / 100) * 100;

    // For the last category (misc), balance any rounding remainder
    if (idx === BUDGET_CATEGORIES.length - 1) {
      const currentSum = BUDGET_CATEGORIES.slice(0, idx).reduce(
        (acc, c) => acc + Math.round((total * c.defaultPercentage) / 100 / 100) * 100,
        0,
      );
      allocated = Math.max(0, total - currentSum);
    }

    const percentage = Number(((allocated / total) * 100).toFixed(1));

    return {
      id: `b-${cat.key}-${idx + 1}`,
      category: cat.key,
      name: `${cat.label} for ${input.eventName}`,
      allocatedAmount: allocated,
      percentage,
      actualSpent: 0,
      notes: `${cat.description}. Tailored for ${input.city} pricing standard.`,
    };
  });

  // 2. Build customized timeline tasks based on event date
  const eventDateObj = new Date(input.date);
  const nowTime = Date.now();
  const diffDays = Math.max(
    14,
    Math.round((eventDateObj.getTime() - nowTime) / (1000 * 60 * 60 * 24)),
  );

  const subtractDays = (days: number): string => {
    const d = new Date(eventDateObj.getTime() - days * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  };

  const timeline: TimelineTask[] = [
    {
      id: `t-1-${Date.now()}`,
      timeframe: `${Math.round(diffDays / 30)} Months Before`,
      title: `Finalize Venue & Date Booking in ${input.city}`,
      description: `Confirm primary venue capacity for ${input.guestCount} attendees. Confirm cancellation and deposit policies.`,
      category: 'Venue',
      completed: true,
      priority: 'high',
      dueDate: subtractDays(Math.min(diffDays - 7, 90)),
    },
    {
      id: `t-2-${Date.now()}`,
      timeframe: `${Math.round(diffDays / 2 / 7)} Weeks Before`,
      title: 'Food Tasting & Beverage Selection',
      description: `Schedule tasting session accommodating ${input.dietaryNeeds || 'all dietary requirements'}. Lock per-plate pricing.`,
      category: 'Catering',
      completed: false,
      priority: 'high',
      dueDate: subtractDays(Math.min(diffDays - 5, 45)),
    },
    {
      id: `t-3-${Date.now()}`,
      timeframe: '3 Weeks Before',
      title: 'Invitations & Digital RSVP Follow-up',
      description: `Dispatch digital invites reflecting the theme: "${input.themePreferences || 'Celebration'}". Consolidate guest count.`,
      category: 'Guest List',
      completed: false,
      priority: 'medium',
      dueDate: subtractDays(21),
    },
    {
      id: `t-4-${Date.now()}`,
      timeframe: '1 Week Before',
      title: 'Vendor Walkthrough & Sound Check',
      description: `Conduct on-site dry run with sound, lighting, and decor team at venue.`,
      category: 'Production',
      completed: false,
      priority: 'high',
      dueDate: subtractDays(7),
    },
    {
      id: `t-5-${Date.now()}`,
      timeframe: 'Day of Event',
      title: 'Event Execution & Hospitality Host Coordination',
      description: `Oversee arrival welcoming, food replenishment, emergency kit handover, and milestone schedule.`,
      category: 'Execution',
      completed: false,
      priority: 'high',
      dueDate: input.date,
    },
  ];

  // 3. Build vendors tailored to the event
  const isWedding = input.eventType === 'wedding';
  const vendorChecklist: VendorItem[] = [
    {
      id: `v-1-${Date.now()}`,
      category: 'Venue & Facilities',
      name: `Premier Banquet & Lawn Space, ${input.city}`,
      questionsToAsk: [
        'Is sound allowed outdoors past 10 PM?',
        `Can the hall comfortably seat ${input.guestCount} guests?`,
        'What is the in-house generator backup capacity?',
      ],
      estimatedCostMin: Math.round(total * 0.25),
      estimatedCostMax: Math.round(total * 0.35),
      booked: false,
      contactNotes: 'Under review. Inquire regarding parking valet services.',
    },
    {
      id: `v-2-${Date.now()}`,
      category: 'Catering & Dining',
      name: `Gourmet Celebrations Catering, ${input.city}`,
      questionsToAsk: [
        `Can you cater specifically for: ${input.dietaryNeeds || 'Standard & Vegetarian choices'}?`,
        'Do you provide live cooking stations and dessert displays?',
        'How many service waitstaff per 25 guests are assigned?',
      ],
      estimatedCostMin: Math.round(total * 0.28),
      estimatedCostMax: Math.round(total * 0.33),
      booked: false,
      contactNotes: 'Sample tasting session scheduled.',
    },
    {
      id: `v-3-${Date.now()}`,
      category: 'Decor & Theme Production',
      name: `Artisan Event Aesthetics, ${input.city}`,
      questionsToAsk: [
        `Can you deliver the theme: ${input.themePreferences || 'Modern Festive'}?`,
        'Are entrance arches, floral backdrops, and table settings included in the package?',
      ],
      estimatedCostMin: Math.round(total * 0.12),
      estimatedCostMax: Math.round(total * 0.18),
      booked: false,
      contactNotes: 'Mood board requested.',
    },
    {
      id: `v-4-${Date.now()}`,
      category: 'Photo & Cinematography',
      name: `Lumière Creative Studios, ${input.city}`,
      questionsToAsk: [
        'How many candid photographers and videographers will be on-site?',
        'What is the turnaround time for high-resolution teasers and the full album?',
      ],
      estimatedCostMin: Math.round(total * 0.08),
      estimatedCostMax: Math.round(total * 0.12),
      booked: false,
      contactNotes: 'Portfolio reviewed with high rating.',
    },
  ];

  // 4. Personalized ideas
  const personalizedIdeas = {
    themes: [
      `${input.themePreferences || 'Grand Elegance'}: Tailored with rich jewel tones, warm gold accents, and subtle ambient uplighting.`,
      `Contemporary Fusion: Crisp minimalist silhouettes adorned with botanical greenery and geometric brass installations.`,
      `Festive Joy: Vibrant marigolds, fairy-light canopies, and traditional artisanal textiles.`,
    ],
    decor: [
      `Customized entrance tunnel with cascading hanging floral strings and fairy lighting.`,
      `Centerpiece photo moments reflecting memorable milestones for ${input.eventName}.`,
      `Elegant illuminated signage and personalized welcome marquee at the main foyer.`,
      `Comfortable curated lounge seating pockets for elderly and VIP attendees.`,
    ],
    menu: [
      `Signature welcome mocktails featuring local ${input.city} flavors and refreshing citrus botanicals.`,
      `Artisanal starter boards and live food counters highlighting ${input.dietaryNeeds || 'diverse gourmet selections'}.`,
      `Sumptuous main course banquet with balanced regional and international favorites.`,
      `Interactive dessert bar with mini pastries, traditional Indian sweets, and artisanal ice creams.`,
    ],
    activities: [
      `Interactive digital photo wall with instant QR code prints for all ${input.guestCount} guests.`,
      `Curated celebration trivia or milestone toast segment led by an energetic host.`,
      `High-energy musical playlist or live acoustic instrumental performance.`,
    ],
    returnGifts: [
      `Artisanal handcrafted gift boxes with local ${input.city} confections and organic roasted nuts.`,
      `Eco-conscious potted indoor succulents in ceramic vases with personalized tags.`,
      `Bespoke scented candle tins with custom fragrance created for ${input.eventName}.`,
    ],
  };

  const proTips = [
    `Always allocate 5-8% of the budget as a floating contingency for unexpected guest or equipment surges.`,
    `In ${input.city}, secure vendor contracts at least 30-45 days ahead to lock seasonal rate cards.`,
    `Nominate a designated family member or coordinator as point-of-contact so you can enjoy the day stress-free.`,
    `Share the digital schedule with all key vendors 48 hours prior with emergency phone numbers.`,
  ];

  return {
    id: planId,
    createdAt: now,
    updatedAt: now,
    eventInput: input,
    summary: `A meticulously planned ${input.eventType} celebration ("${input.eventName}") in ${input.city} for ${input.guestCount} guests with an optimal budget distribution of ₹${total.toLocaleString('en-IN')}.`,
    budgetBreakdown,
    timeline,
    vendorChecklist,
    personalizedIdeas,
    proTips,
  };
}

/**
 * Returns available pre-curated demo plans
 */
export function getCuratedDemoPlans(): Record<string, EventPlan> {
  return {
    wedding: SAMPLE_WEDDING_PLAN,
    birthday: SAMPLE_BIRTHDAY_PLAN,
  };
}
