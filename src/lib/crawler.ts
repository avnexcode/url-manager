const BOT_USER_AGENTS = [
  'bot',
  'crawl',
  'spider',
  'slurp',
  'whatsapp',
  'facebookexternalhit',
  'facebook',
  'twitterbot',
  'telegrambot',
  'discordbot',
  'linkedinbot',
  'googlebot',
  'bingbot',
  'applebot',
  'slackbot',
  'viber',
  'line',
  'pinterest',
  'vkshare',
]

export const isCrawler = (userAgent: string | undefined): boolean => {
  if (!userAgent) return false

  const ua = userAgent.toLowerCase()

  return BOT_USER_AGENTS.some((bot) => ua.includes(bot))
}
