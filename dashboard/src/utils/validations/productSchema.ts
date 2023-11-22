import { z } from 'zod'

export const productSchema = z.object({
    name: z.string().min(2).max(100),
    price: z.number().min(0),
    quantity: z.number().min(1),
    size: z.number().min(2).max(100),
    vat: z.number().min(0),
    sku: z.string().min(11).max(63),
    discount: z.number().min(0),
    color: z.string().min(2).max(100),
    alertQuantity: z.number().min(0),
})