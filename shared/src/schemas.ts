import { z } from 'zod';

export const EventTypeEnum = z.enum([
  'wedding',
  'birthday',
  'community',
  'corporate',
  'anniversary',
  'other',
]);

export type EventType = z.infer<typeof EventTypeEnum>;

export const BudgetCategoryEnum = z.enum([
  'venue',
  'catering',
  'decor',
  'photography',
  'entertainment',
  'attire',
  'misc',
]);

export type BudgetCategory = z.infer<typeof BudgetCategoryEnum>;

/**
 * Event setup input schema with strict validation and sanitization
 */
export const EventSetupInputSchema = z.object({
  eventType: EventTypeEnum,
  eventName: z
    .string()
    .trim()
    .min(2, 'Event name must be at least 2 characters')
    .max(80, 'Event name must not exceed 80 characters'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD')
    .refine(
      val => {
        const parsed = new Date(val);
        return !isNaN(parsed.getTime());
      },
      { message: 'Invalid calendar date' },
    ),
  guestCount: z
    .number({ invalid_type_error: 'Guest count must be a number' })
    .int('Guest count must be an integer')
    .min(5, 'Guest count must be at least 5')
    .max(10000, 'Guest count cannot exceed 10,000'),
  totalBudget: z
    .number({ invalid_type_error: 'Budget must be a number' })
    .min(10000, 'Minimum budget is ₹10,000')
    .max(100000000, 'Maximum budget is ₹10,00,00,000'),
  city: z
    .string()
    .trim()
    .min(2, 'City must be at least 2 characters')
    .max(60, 'City name too long'),
  themePreferences: z
    .string()
    .trim()
    .max(300, 'Theme description should be under 300 characters')
    .default(''),
  dietaryNeeds: z
    .string()
    .trim()
    .max(200, 'Dietary needs should be under 200 characters')
    .default(''),
  additionalNotes: z
    .string()
    .trim()
    .max(500, 'Additional notes should be under 500 characters')
    .default(''),
});

export type EventSetupInput = z.infer<typeof EventSetupInputSchema>;

/**
 * Budget breakdown item schema
 */
export const BudgetItemSchema = z.object({
  id: z.string().min(1),
  category: BudgetCategoryEnum,
  name: z.string().min(1),
  allocatedAmount: z.number().min(0),
  percentage: z.number().min(0).max(100),
  actualSpent: z.number().min(0).default(0),
  notes: z.string().default(''),
});

export type BudgetItem = z.infer<typeof BudgetItemSchema>;

/**
 * Timeline task countdown schema
 */
export const TimelineTaskSchema = z.object({
  id: z.string().min(1),
  timeframe: z.string().min(1), // e.g., "6 Months Before", "2 Weeks Before", "Day of Event"
  title: z.string().min(1),
  description: z.string().default(''),
  category: z.string().default('General'),
  completed: z.boolean().default(false),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional(),
});

export type TimelineTask = z.infer<typeof TimelineTaskSchema>;

/**
 * Vendor checklist item schema
 */
export const VendorItemSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1),
  name: z.string().min(1),
  questionsToAsk: z.array(z.string()).default([]),
  estimatedCostMin: z.number().min(0),
  estimatedCostMax: z.number().min(0),
  booked: z.boolean().default(false),
  contactNotes: z.string().default(''),
});

export type VendorItem = z.infer<typeof VendorItemSchema>;

/**
 * Personalized creative ideas schema
 */
export const PersonalizedIdeasSchema = z.object({
  themes: z.array(z.string()).default([]),
  decor: z.array(z.string()).default([]),
  menu: z.array(z.string()).default([]),
  activities: z.array(z.string()).default([]),
  returnGifts: z.array(z.string()).default([]),
});

export type PersonalizedIdeas = z.infer<typeof PersonalizedIdeasSchema>;

/**
 * Complete AI-generated Event Plan Schema
 */
export const EventPlanSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  eventInput: EventSetupInputSchema,
  summary: z.string().default(''),
  budgetBreakdown: z.array(BudgetItemSchema),
  timeline: z.array(TimelineTaskSchema),
  vendorChecklist: z.array(VendorItemSchema),
  personalizedIdeas: PersonalizedIdeasSchema,
  proTips: z.array(z.string()).default([]),
});

export type EventPlan = z.infer<typeof EventPlanSchema>;

/**
 * Chat Assistant Request Schema
 */
export const ChatAssistantRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message cannot exceed 1000 characters'),
  currentPlan: EventPlanSchema,
  chatHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      }),
    )
    .optional()
    .default([]),
});

export type ChatAssistantRequest = z.infer<typeof ChatAssistantRequestSchema>;

/**
 * Chat Assistant Response Schema
 */
export const ChatAssistantResponseSchema = z.object({
  reply: z.string(),
  updatedPlan: EventPlanSchema.optional(),
  suggestedActions: z.array(z.string()).default([]),
});

export type ChatAssistantResponse = z.infer<typeof ChatAssistantResponseSchema>;

/**
 * Generic API Response Schema
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    isDemo: z.boolean().optional(),
    message: z.string().optional(),
    error: z.string().optional(),
  });
