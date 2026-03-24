import { z } from 'zod';

export const SITE_TYPES = [
  'blog',
  'portfolio',
  'business',
  'ecommerce',
  'personal',
  'agency',
] as const;

export const VIBES = [
  'minimalist',
  'bold',
  'elegant',
  'playful',
  'corporate',
  'organic',
  'dark',
  'warm',
] as const;

// Image data for multimodal AI input
export const InspirationImageSchema = z.object({
  data: z.string(), // base64 encoded
  mimeType: z.string(), // e.g. "image/png", "image/jpeg"
});

// Design tokens extracted from a reference URL
export const ExtractedDesignSchema = z.object({
  url: z.string().optional(),
  colors: z.array(z.string()).optional(),
  fontFamilies: z.array(z.string()).optional(),
  mood: z.string().optional(),
});

export const UserInputSchema = z.object({
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be under 2000 characters'),
  siteType: z.enum(SITE_TYPES).optional(),
  vibe: z.enum(VIBES).optional(),
  colorPreferences: z.string().optional(),
  fontPreferences: z.string().optional(),
  pages: z.array(z.string()).optional(),
  inspirationImages: z.array(InspirationImageSchema).max(3).optional(),
  extractedDesign: ExtractedDesignSchema.optional(),
});

export type UserInput = z.infer<typeof UserInputSchema>;
export type InspirationImage = z.infer<typeof InspirationImageSchema>;
export type ExtractedDesign = z.infer<typeof ExtractedDesignSchema>;
