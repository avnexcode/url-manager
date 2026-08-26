import z from 'zod'

export const publicAccessPasswordFormSchema = z.object({
  password: z.string().min(1, 'Password tidak boleh kosong.'),
})
