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
