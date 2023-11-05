import { z } from 'zod'

export const userSchema = z.object({
    firstname: z.string().min(2, 'Le prénom doit avoir au moins 2 caractères').optional(),
    lastname: z.string().min(2, 'Le nom doit avoir au moins 2 caractères').optional(),
    birthdate: z
      .string()
      .refine((birthdate) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(birthdate)) {
          return false
        }
  
        const today = new Date()
        const birthdateDate = new Date(birthdate)
        const age = today.getFullYear() - birthdateDate.getFullYear()
  
        return age >= 18
      }, 'Vous devez être majeur pour vous inscrire')
      .optional(),
    email: z.string().email('Veuillez entrer une adresse e-mail valide').optional(),
    password: z.string().min(12, 'Le mot de passe doit avoir au moins 12 caractères').optional(),
    role: z
      .string()
      .refine((role) => {
        return role === 'ROLE_ADMIN' || role === 'ROLE_STORE_KEEPER' || role === 'ROLE_USER'
      }, 'Le rôle doit être ROLE_ADMIN, ROLE_STORE_KEEPER ou ROLE_USER')
      .optional(),
    passwordResetToken: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    phone: z.string().optional(),
    loginAttempts: z.number().optional(),
    authentificationToken: z.string().optional(),
    disabled: z.boolean().optional(),
    isValidate: z.boolean().optional()
  })