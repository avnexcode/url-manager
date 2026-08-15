import { getRequestHeaders } from '@tanstack/react-start/server'

export const getServerHeaders = () => {
  try {
    return getRequestHeaders()
  } catch {
    return {}
  }
}
