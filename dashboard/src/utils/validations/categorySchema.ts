import { z } from 'zod'

export const categorySchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(2).max(255),
})