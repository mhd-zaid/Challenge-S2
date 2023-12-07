import { z } from 'zod'

export const modelSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(2).max(255),
    brandId: z.number().min(1),
    categoryId: z.number().min(1),
})