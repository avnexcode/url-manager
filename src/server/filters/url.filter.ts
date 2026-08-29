import { env } from '@/configs/env'

type NormalizedHost = {
  hostname: string
  port: string
  isDefaultPort: boolean
}

export class UrlFilter {
  private static blockedUrls: string[] = [
    env.VITE_BASE_URL,
    env.SERVER_URL,
    'https://jav.guru/',
    'https://ukdevilz.com/home',
    'http://pornhub.com/',
  ].filter(Boolean)

  private static normalizeHostname(rawValue: string): NormalizedHost | null {
    const sanitized = rawValue.trim().replace(/\\/g, '/')

    const tryParse = (input: string): NormalizedHost | null => {
      try {
        const url = new URL(input)

        const port =
          url.port ||
          (url.protocol === 'https:'
            ? '443'
            : url.protocol === 'http:'
              ? '80'
              : '')

        const hostname = url.hostname.toLowerCase().replace(/\.+$/, '')

        const isDefaultPort = port === '80' || port === '443' || port === ''

        return { hostname, port, isDefaultPort }
      } catch {
        return null
      }
    }

    return tryParse(sanitized) ?? tryParse(`https://${sanitized}`)
  }

  private static get blockedHosts(): NormalizedHost[] {
    return this.blockedUrls
      .map((base) => this.normalizeHostname(base))
      .filter((host): host is NormalizedHost => host !== null)
  }

  static isBlocked(
    value: string,
    { blockSubdomains = true }: { blockSubdomains?: boolean } = {},
  ): boolean {
    const target = this.normalizeHostname(value)

    if (target === null) return true

    return this.blockedHosts.some((baseHost) => {
      const sameHost = target.hostname === baseHost.hostname

      if (!sameHost) {
        return (
          blockSubdomains && target.hostname.endsWith(`.${baseHost.hostname}`)
        )
      }

      if (baseHost.isDefaultPort) return true

      return target.port === baseHost.port
    })
  }
}
