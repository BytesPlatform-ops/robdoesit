import { z } from "zod";

export const NEEDS = [
  "Host",
  "Interviews",
  "Event Content",
  "Red Carpet",
  "Podcast",
  "Full Coverage",
  "Custom",
] as const;

export const EVENT_TYPES = [
  "Music Event",
  "Fashion Show",
  "Red Carpet",
  "Award Show",
  "Brand Activation",
  "Nightlife",
  "Creator Event",
  "Conference",
  "Private Event",
  "Festival",
  "Other",
] as const;

export const bookingSchema = z.object({
  eventName: z.string({ error: "Give the event a name." }).trim().min(2, "Give the event a name."),
  eventType: z.enum(EVENT_TYPES, { message: "Pick the closest match." }),

  eventDate: z.string({ error: "When is it?" }).trim().min(1, "When is it?"),
  venue: z.string({ error: "Where is it happening?" }).trim().min(2, "Where is it happening?"),
  city: z.string({ error: "Which city?" }).trim().min(2, "Which city?"),

  needs: z.array(z.enum(NEEDS), { error: "Pick at least one." }).min(1, "Pick at least one."),

  name: z.string({ error: "Your name, please." }).trim().min(2, "Your name, please."),
  company: z.string().trim().optional().or(z.literal("")),
  email: z
    .string({ error: "We need an email to reply to." })
    .trim()
    .email("That email doesn't look right."),
  phone: z.string().trim().optional().or(z.literal("")),
  handle: z.string().trim().optional().or(z.literal("")),

  message: z.string().trim().max(2000).optional().or(z.literal("")),

  /** Honeypot. Kept permissive on purpose: a bot that fills it gets a
      normal-looking success, and the enquiry is dropped server-side. */
  website: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

/** Fields validated per step of the multi-step form. */
export const stepFields: (keyof BookingInput)[][] = [
  ["eventName", "eventType"],
  ["eventDate", "venue", "city"],
  ["needs"],
  ["name", "company", "email", "phone", "handle"],
  ["message"],
];
