import { z } from 'zod'

export const brandSchema = z.object({
    name: z.string().min(2).max(255),
})