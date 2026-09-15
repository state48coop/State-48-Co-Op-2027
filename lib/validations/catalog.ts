import { z } from "zod";

export const attributeGroupSchema = z.object({
  name: z.string().trim().min(1).max(80),
  values: z.array(z.string().trim().min(1).max(80)).min(1).max(50)
});

export const variantSchema = z.object({
  id: z.string().uuid().optional(),
  combination: z.record(z.string().min(1), z.string().min(1)),
  price_modifier: z.number().finite(),
  stock: z.number().int().min(0),
  variant_image: z.string().url().nullable().optional(),
  sku: z.string().trim().min(1).max(100)
});

export const variantsPayloadSchema = z.object({
  productId: z.string().uuid(),
  variants: z.array(variantSchema).max(500)
});

export const productSchema = z.object({
  name: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens for the slug."),
  description: z.string().trim().min(1).max(10000),
  shortDescription: z.string().trim().max(240).default(""),
  basePrice: z.coerce.number().finite().min(0),
  sku: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(100),
  collection: z.string().trim().min(1).max(100),
  productType: z.string().trim().min(1).max(100),
  images: z.array(z.string().url()).max(30),
  allowEngrave: z.boolean(),
  engraveCost: z.coerce.number().finite().min(0),
  isPublished: z.boolean()
});
