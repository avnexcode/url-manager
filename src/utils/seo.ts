/**
 * A single `<meta>` tag description, structurally compatible with the meta
 * entries returned from a TanStack Router route's `head()` option.
 */
export type SeoMetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }

/**
 * A single `<link>` tag description, structurally compatible with the link
 * entries returned from a TanStack Router route's `head()` option.
 */
export type SeoLinkTag = {
  rel: string
  href: string
  hrefLang?: string
  type?: string
  sizes?: string
}

/** Shape returned by {@link seo}, spreadable directly into a route's `head()` return value. */
export type SeoHeadResult = {
  meta: SeoMetaTag[]
  links: SeoLinkTag[]
}

/** An Open Graph / Twitter image, either a bare URL or a fully described image. */
export type SeoImageInput =
  | string
  | {
      url: string
      width?: number
      height?: number
      alt?: string
    }

/**
 * Robots directive shorthand.
 * - `true` → "index, follow" (default browser/crawler behavior, rarely needs to be set explicitly)
 * - `false` → "noindex, nofollow" (hide the page entirely, e.g. auth or admin routes)
 * - object → fine-grained control over individual directives
 */
export type SeoRobotsInput =
  | boolean
  | {
      index?: boolean
      follow?: boolean
      noarchive?: boolean
      maxImagePreview?: 'none' | 'standard' | 'large'
    }

/** Locale metadata used to emit `og:locale`, `og:locale:alternate`, and `hreflang` alternate links. */
export type SeoLocaleInput = {
  /** BCP 47 locale code for the current page, e.g. `'id'` or `'en'`. */
  current: string
  /** Other locale codes this same logical page is available in. */
  alternates?: string[]
  /** Builds the absolute URL for a given locale code. Required to emit `hreflang` `<link>` tags. */
  buildUrl?: (locale: string) => string
}

export type SeoInput = {
  /** Page-specific title. Combined with {@link SeoInput.titleTemplate} if one is provided. */
  title: string
  /**
   * Wraps `title` for the final `<title>` tag and `og:title`/`twitter:title`.
   * A string uses `%s` as the title placeholder (e.g. `'%s · Avnexeed'`);
   * a function receives the raw title and returns the final string.
   */
  titleTemplate?: string | ((title: string) => string)
  /** Meta description. Recommended to stay under ~160 characters. */
  description?: string
  /** Meta keywords. Arrays are joined with `, `. */
  keywords?: string[] | string
  /** Open Graph / Twitter share image. */
  image?: SeoImageInput
  /** Canonical absolute URL for this page, also used for `og:url` when `canonical` is not set. */
  url?: string
  /** Overrides `url` specifically for the `rel="canonical"` link, when they need to differ. */
  canonical?: string
  /** Site name, emitted as `og:site_name`. */
  siteName?: string
  /** Open Graph object type. Defaults to `'website'`. */
  type?: 'website' | 'article' | 'profile'
  /** Robots directive for this page. Omit to leave crawling behavior at browser/crawler defaults. */
  robots?: SeoRobotsInput
  /** `@handle` used for `twitter:site`. */
  twitterHandle?: string
  /** Locale + alternates for this page. */
  locale?: SeoLocaleInput
}

/**
 * Resolves a {@link SeoRobotsInput} into the string content of a `<meta name="robots">` tag.
 *
 * Exported separately (rather than kept private) so it can be unit tested and reused
 * outside of {@link seo}, e.g. when building a `robots.txt` handler that should agree
 * with the per-page directives.
 *
 * @param robots - Robots directive shorthand or fine-grained config
 * @returns The resolved directive string, or `undefined` if `robots` was not provided
 *
 * @example
 * resolveSeoRobots(false) // 'noindex, nofollow'
 * resolveSeoRobots({ follow: false }) // 'index, nofollow'
 * resolveSeoRobots(undefined) // undefined
 */
export const resolveSeoRobots = (
  robots: SeoRobotsInput | undefined,
): string | undefined => {
  if (robots === undefined) return undefined

  if (typeof robots === 'boolean') {
    return robots ? 'index, follow' : 'noindex, nofollow'
  }

  const directives: string[] = [
    robots.index === false ? 'noindex' : 'index',
    robots.follow === false ? 'nofollow' : 'follow',
  ]

  if (robots.noarchive) directives.push('noarchive')
  if (robots.maxImagePreview) {
    directives.push(`max-image-preview:${robots.maxImagePreview}`)
  }

  return directives.join(', ')
}

const normalizeImage = (image: SeoImageInput | undefined) => {
  if (!image) return undefined
  return typeof image === 'string' ? { url: image } : image
}

const isPresent = <T>(tag: T | null | undefined): tag is T =>
  tag !== null && tag !== undefined

/**
 * Builds a complete, deduplicated set of `<title>`, `<meta>`, and `<link>` tags
 * for a TanStack Router route, meant to be returned (or spread) directly from
 * that route's `head()` option.
 *
 * TanStack Start has no `generateMetadata`-style convention like Next.js — `head()`
 * is a plain function you write yourself. This utility is that function's building
 * block: it takes a small, typed input and expands it into the full tag set
 * (title, description, keywords, robots, Open Graph, Twitter Card, canonical,
 * and `hreflang` alternates), so individual routes only need to supply the
 * page-specific facts.
 *
 * **Key Features:**
 * - Single typed input covering title, description, Open Graph, Twitter Card, robots, and locale
 * - Automatic `%s`-style title templating for consistent branded titles
 * - Accepts a bare image URL or a full `{ url, width, height, alt }` object
 * - Emits `hreflang` alternate `<link>` tags from a locale list + URL builder
 * - Omits any tag whose value is missing, instead of emitting empty `content=""` attributes
 * - Output shape (`{ meta, links }`) matches TanStack Router's `head()` return type exactly
 *
 * **Tag Assignment Priority:**
 * 1. `canonical` is used for `rel="canonical"` if provided
 * 2. Otherwise `url` is used for both `rel="canonical"` and `og:url`
 * 3. If neither is provided, no canonical link is emitted
 *
 * @param input - Page-specific SEO facts. See {@link SeoInput} for all fields.
 * @returns `{ meta, links }`, ready to spread into a route's `head()` return value
 *
 * @example
 * Basic usage in a route's `head` option
 * export const Route = createFileRoute('/{-$locale}/about')({
 *   head: () => seo({
 *     title: m.page_about_title(),
 *     description: m.page_about_description(),
 *   }),
 * })
 *
 * @example
 * Using loader data, an image, and a canonical URL
 * head: ({ loaderData }) => seo({
 *   title: loaderData.title,
 *   description: loaderData.description,
 *   image: { url: loaderData.thumbnail, alt: loaderData.title },
 *   url: `https://avnexeed.com/platform/${loaderData.slug}`,
 * })
 *
 * @example
 * Localized alternates for a bilingual (EN/ID) route
 * head: ({ params }) => seo({
 *   title: m.page_home_title(),
 *   locale: {
 *     current: params.locale ?? 'id',
 *     alternates: ['en', 'id'].filter((l) => l !== (params.locale ?? 'id')),
 *     buildUrl: (locale) => `https://avnexeed.com/${locale}`,
 *   },
 * })
 *
 * @example
 * Hiding a private route from search engines
 * head: () => seo({
 *   title: m.page_setting_title(),
 *   robots: false, // -> 'noindex, nofollow'
 * })
 *
 * @warning `titleTemplate` and `siteName` are page-specific inputs here, not
 * global config — pass them on every call, or use {@link createSeo} to bind
 * site-wide defaults once and avoid repeating them per route.
 *
 * @see https://tanstack.com/router/latest — TanStack Router docs (Document Head Management guide)
 */
export const seo = ({
  title,
  titleTemplate,
  description,
  keywords,
  image,
  url,
  canonical,
  siteName,
  type = 'website',
  robots,
  twitterHandle,
  locale,
}: SeoInput): SeoHeadResult => {
  const resolvedTitle =
    typeof titleTemplate === 'function'
      ? titleTemplate(title)
      : typeof titleTemplate === 'string'
        ? titleTemplate.replace('%s', title)
        : title

  if (
    process.env.NODE_ENV === 'development' &&
    description &&
    description.length > 160
  ) {
    console.warn(
      'seo: "description" is longer than 160 characters and may be truncated in search results.',
      'Length:',
      description.length,
      'Title:',
      title,
    )
  }

  const resolvedImage = normalizeImage(image)
  const resolvedKeywords = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords
  const resolvedRobots = resolveSeoRobots(robots)
  const canonicalHref = canonical ?? url

  const meta: SeoMetaTag[] = [
    { title: resolvedTitle },
    description ? { name: 'description', content: description } : null,
    resolvedKeywords ? { name: 'keywords', content: resolvedKeywords } : null,
    resolvedRobots ? { name: 'robots', content: resolvedRobots } : null,

    // Open Graph
    { property: 'og:title', content: resolvedTitle },
    description ? { property: 'og:description', content: description } : null,
    { property: 'og:type', content: type },
    url ? { property: 'og:url', content: url } : null,
    siteName ? { property: 'og:site_name', content: siteName } : null,
    resolvedImage ? { property: 'og:image', content: resolvedImage.url } : null,
    resolvedImage?.width
      ? { property: 'og:image:width', content: String(resolvedImage.width) }
      : null,
    resolvedImage?.height
      ? { property: 'og:image:height', content: String(resolvedImage.height) }
      : null,
    resolvedImage?.alt
      ? { property: 'og:image:alt', content: resolvedImage.alt }
      : null,
    locale?.current ? { property: 'og:locale', content: locale.current } : null,
    ...(locale?.alternates ?? []).map((code) => ({
      property: 'og:locale:alternate',
      content: code,
    })),

    // Twitter Card
    {
      name: 'twitter:card',
      content: resolvedImage ? 'summary_large_image' : 'summary',
    },
    { name: 'twitter:title', content: resolvedTitle },
    description ? { name: 'twitter:description', content: description } : null,
    resolvedImage
      ? { name: 'twitter:image', content: resolvedImage.url }
      : null,
    twitterHandle ? { name: 'twitter:site', content: twitterHandle } : null,
  ].filter(isPresent)

  const links: SeoLinkTag[] = [
    canonicalHref ? { rel: 'canonical', href: canonicalHref } : null,
    ...(locale?.alternates && locale.buildUrl
      ? locale.alternates.map((code) => ({
          rel: 'alternate',
          href: locale.buildUrl!(code),
          hrefLang: code,
        }))
      : []),
  ].filter(isPresent)

  return { meta, links }
}

/** Site-wide defaults that {@link createSeo} binds into every call of the returned function. */
export type SeoDefaults = Pick<
  SeoInput,
  'siteName' | 'titleTemplate' | 'twitterHandle' | 'robots' | 'locale'
> & {
  /** Fallback share image used when a route doesn't provide its own `image`. */
  defaultImage?: SeoImageInput
  /**
   * App-wide "brand" keywords (e.g. the product name and category) applied to
   * every route. Merged with — not replaced by — each route's own `keywords`,
   * so a route only needs to add what's specific to its own content.
   */
  baseKeywords?: string[] | string
}

/**
 * Creates a `seo()` function pre-bound with site-wide defaults (site name, title
 * template, Twitter handle, default share image, default robots policy, locale
 * config), so individual routes only need to pass what's actually page-specific.
 *
 * This is the closest equivalent in this codebase to Next.js's root `metadata`
 * object with `title.template` — except explicit and colocated in `__root.tsx`
 * instead of an implicit framework convention.
 *
 * **Key Features:**
 * - Binds `siteName`, `titleTemplate`, `twitterHandle`, `robots`, and `locale` once
 * - Per-route input always wins over the bound defaults for any overlapping field
 * - Returns a plain function with the exact same signature as {@link seo}
 *
 * @param defaults - Site-wide values to apply to every generated head. See {@link SeoDefaults}.
 * @returns A `seo`-shaped function with defaults pre-applied
 *
 * @example
 * Defining site defaults once in `__root.tsx`
 * export const seo = createSeo({
 *   siteName: 'Avnexeed',
 *   titleTemplate: (title) => `${title} · Avnexeed`,
 *   twitterHandle: '@avnexeed',
 *   defaultImage: 'https://avnexeed.com/og-default.png',
 *   baseKeywords: ['avnexeed', 'url shortener', 'link management'],
 * })
 *
 * @example
 * Reusing the bound instance in a leaf route — only page-specific fields are needed
 * head: ({ loaderData }) => seo({
 *   title: loaderData.title,
 *   description: loaderData.description,
 * })
 *
 * @example
 * Adding page-specific keywords — merged with, not replacing, `baseKeywords`
 * head: () => seo({
 *   title: m.page_platform_title(),
 *   keywords: ['platform', 'dashboard'],
 *   // final tag: "avnexeed, url shortener, link management, platform, dashboard"
 * })
 */
export const createSeo = (defaults: SeoDefaults = {}) => {
  return (input: SeoInput): SeoHeadResult => {
    const base = Array.isArray(defaults.baseKeywords)
      ? defaults.baseKeywords
      : defaults.baseKeywords
        ? [defaults.baseKeywords]
        : []
    const own = Array.isArray(input.keywords)
      ? input.keywords
      : input.keywords
        ? [input.keywords]
        : []
    const mergedKeywords = [...base, ...own]

    return seo({
      siteName: defaults.siteName,
      titleTemplate: defaults.titleTemplate,
      twitterHandle: defaults.twitterHandle,
      robots: defaults.robots,
      locale: defaults.locale,
      image: defaults.defaultImage,
      ...input,
      keywords: mergedKeywords.length > 0 ? mergedKeywords : undefined,
    })
  }
}

/**
 * Merges multiple meta tag arrays into one, deduplicated set — later arrays win
 * over earlier ones for the same tag identity (`title`, or a given `name`/`property`).
 *
 * TanStack Router's own `<HeadContent />` already deduplicates merged route-tree
 * `head()` output this same way (child overrides parent) when rendering to the
 * DOM, so this helper is normally *not* needed for ordinary route composition.
 * It exists for cases outside that render path — unit-testing the tags a route
 * would produce, or composing {@link seo} output with tags sourced from a
 * different head-management library.
 *
 * @param metaLists - Meta tag arrays in increasing priority order (last wins)
 * @returns A single deduplicated meta tag array
 *
 * @example
 * Combining root defaults with page-specific overrides outside of the router
 * const rootMeta = seo({ title: 'Avnexeed' }).meta
 * const pageMeta = seo({ title: 'Platform Detail' }).meta
 * mergeSeoMeta(rootMeta, pageMeta) // page's `title`/`og:title` wins
 *
 * @warning Only tags of shape `{ title }`, `{ name, content }`, or
 * `{ property, content }` are deduplicated; tags of any other shape are kept
 * as-is and never collide with one another.
 */
export const mergeSeoMeta = (...metaLists: SeoMetaTag[][]): SeoMetaTag[] => {
  const seen = new Map<string, SeoMetaTag>()

  for (const list of metaLists) {
    for (const tag of list) {
      const key =
        'title' in tag
          ? 'title'
          : 'name' in tag
            ? `name:${tag.name}`
            : 'property' in tag
              ? `property:${tag.property}`
              : undefined

      if (!key) continue
      seen.set(key, tag)
    }
  }

  return Array.from(seen.values())
}
