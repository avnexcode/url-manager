import { paraglideLocaleMiddleware } from '@/middlewares/paraglide'
import { createStart } from '@tanstack/react-start'

export const startInstance = createStart(() => ({
  requestMiddleware: [paraglideLocaleMiddleware],
}))
