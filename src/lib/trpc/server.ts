import { getRequestHeader } from '@tanstack/react-start/server'

export const getServerHeaders = () => {
  try {
    const cookie = getRequestHeader('cookie')
    if (!cookie) return {}
    return { cookie }
  } catch {
    return {}
  }
}
