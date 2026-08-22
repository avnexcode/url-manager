// ============================================================================
// Shared internals
// ============================================================================

/**
 * Extracts the first segment of a UUID (the portion before the first hyphen).
 * Used to create short, unique suffixes without exposing the full UUID.
 *
 * @param uuid - A UUID string, typically from crypto.randomUUID()
 * @returns The first segment of the UUID (8 characters for a standard UUIDv4)
 */
const getUuidSegment = (uuid: string): string =>
  uuid.includes('-') ? uuid.substring(0, uuid.indexOf('-')) : uuid

/**
 * Normalizes arbitrary text into a lowercase, alphanumeric-and-hyphen-only
 * identifier fragment. Shared normalization pipeline used by every username
 * generator below.
 *
 * Pipeline:
 * - Lowercase
 * - Strip accents/diacritics
 * - Replace whitespace, dots, underscores and plus signs with hyphens
 * - Remove anything that isn't a-z, 0-9, or hyphen
 * - Collapse consecutive hyphens
 * - Trim leading/trailing hyphens
 *
 * @param text - Raw text to normalize
 * @returns Normalized identifier fragment (may be an empty string)
 */
const normalizeIdentifier = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s._+]+/g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

// ============================================================================
// 1. generateUsername — generic random username
// ============================================================================

type GenerateUsernameParams = {
  /** Prefix to use before the UUID segment (default: "user") */
  prefix?: string
}

/**
 * Generates a random, generic username from a prefix and a UUID segment.
 * Useful as a fallback when there's no other identifying information to
 * base a username on (e.g. anonymous accounts, guest sessions, seed/test
 * data).
 *
 * @param params - Configuration object for username generation
 * @param params.prefix - Prefix to use before the UUID segment (default: "user")
 *
 * @returns Username string in the format "{prefix}-{uuidSegment}"
 *
 * @throws {Error} If prefix is provided but is not a non-empty string
 *
 * @example
 * Basic usage
 * generateUsername()
 * Returns: "user-a1b2c3d4"
 *
 * @example
 * Custom prefix
 * generateUsername({ prefix: "guest" })
 * Returns: "guest-9f8e7d6c"
 */
export const generateUsername = ({
  prefix = 'user',
}: GenerateUsernameParams = {}): string => {
  if (typeof prefix !== 'string' || prefix.trim().length === 0) {
    throw new Error(
      `prefix must be a non-empty string. Received: ${typeof prefix === 'string' ? '"' + prefix + '"' : typeof prefix}`,
    )
  }

  const uuidSegment = getUuidSegment(crypto.randomUUID())

  return `${normalizeIdentifier(prefix)}-${uuidSegment}`
}

// ============================================================================
// 2. generateUsernameFromEmail — derived from the email local part
// ============================================================================

type GenerateUsernameFromEmailParams = {
  /** The email address to derive the username from */
  email: string | undefined
}

/**
 * Generates a username from the local part of an email address (the part
 * before "@"), combined with a UUID segment to keep it unique.
 *
 * @param params - Configuration object for username generation
 * @param params.email - The input email (required, must contain "@")
 *
 * @returns Username string in the format "{localPart}-{uuidSegment}"
 *
 * @throws {Error} If email is not a string or is empty/whitespace only
 * @throws {Error} If email does not contain "@" or has an empty local part
 * @throws {Error} If the normalized local part is empty (only special characters)
 *
 * @example
 * Basic usage
 * generateUsernameFromEmail({ email: "john.doe@example.com" })
 * Returns: "john-doe-a1b2c3d4"
 *
 * @example
 * With accents and special characters
 * generateUsernameFromEmail({ email: "José+promo@example.com" })
 * Returns: "jose-promo-9f8e7d6c"
 *
 * @example
 * Error: Invalid email format
 * generateUsernameFromEmail({ email: "not-an-email" })
 * Throws: "Invalid email address: missing \"@\" separator"
 */
export const generateUsernameFromEmail = ({
  email,
}: GenerateUsernameFromEmailParams): string => {
  if (!email || typeof email !== 'string') {
    throw new Error(
      `email must be a non-empty string. Received: ${typeof email === 'string' ? '"' + email + '"' : typeof email}`,
    )
  }

  if (email.trim().length === 0) {
    throw new Error('email cannot be empty or contain only whitespace')
  }

  const atIndex = email.indexOf('@')

  if (atIndex === -1) {
    throw new Error('Invalid email address: missing "@" separator')
  }

  const localPart = email.substring(0, atIndex)

  if (localPart.trim().length === 0) {
    throw new Error('Invalid email address: local part before "@" is empty')
  }

  const normalizedLocalPart = normalizeIdentifier(localPart)

  if (normalizedLocalPart.length === 0) {
    throw new Error(
      'Generated username is empty. Local part of email may contain only special characters.',
    )
  }

  const uuidSegment = getUuidSegment(crypto.randomUUID())

  return `${normalizedLocalPart}-${uuidSegment}`
}

// ============================================================================
// 3. generateUsernameFromName — derived from first/last name
// ============================================================================

type GenerateUsernameFromNameParams = {
  /** First name (required, non-empty) */
  firstName: string | undefined
  /** Last name (optional) */
  lastName?: string
  /** Whether to append a UUID segment for uniqueness (default: true) */
  withId?: boolean
}

/**
 * Generates a username from a person's first and (optional) last name.
 * Commonly used in onboarding/profile flows where the display name is
 * known but the account username still needs to be derived.
 *
 * @param params - Configuration object for username generation
 * @param params.firstName - The person's first name (required, non-empty)
 * @param params.lastName - The person's last name (optional)
 * @param params.withId - Whether to append a UUID segment for uniqueness (default: true)
 *
 * @returns Username string, e.g. "{firstName}-{lastName}-{uuidSegment}"
 *
 * @throws {Error} If firstName is not a string or is empty/whitespace only
 * @throws {Error} If the normalized name is empty (only special characters)
 *
 * @example
 * Basic usage
 * generateUsernameFromName({ firstName: "Jane", lastName: "Doe" })
 * Returns: "jane-doe-a1b2c3d4"
 *
 * @example
 * Without UUID suffix
 * generateUsernameFromName({ firstName: "Jane", lastName: "Doe", withId: false })
 * Returns: "jane-doe"
 *
 * @example
 * First name only, with accent
 * generateUsernameFromName({ firstName: "Björk" })
 * Returns: "bjork-9f8e7d6c"
 */
export const generateUsernameFromName = ({
  firstName,
  lastName,
  withId = true,
}: GenerateUsernameFromNameParams): string => {
  if (!firstName || typeof firstName !== 'string') {
    throw new Error(
      `firstName must be a non-empty string. Received: ${typeof firstName === 'string' ? '"' + firstName + '"' : typeof firstName}`,
    )
  }

  const fullName = lastName ? `${firstName} ${lastName}` : firstName
  const normalizedName = normalizeIdentifier(fullName)

  if (normalizedName.length === 0) {
    throw new Error(
      'Generated username is empty. Name may contain only special characters.',
    )
  }

  if (!withId) {
    return normalizedName
  }

  const uuidSegment = getUuidSegment(crypto.randomUUID())

  return `${normalizedName}-${uuidSegment}`
}

// ============================================================================
// 4. generateUsernameWithRandomNumber — "user1234" style
// ============================================================================

type GenerateUsernameWithRandomNumberParams = {
  /** Base text/prefix for the username (default: "user") */
  base?: string
  /** Number of random digits to append (default: 4) */
  digitLength?: number
}

/**
 * Generates a username by appending random digits to a base string,
 * similar to the "user1234" style suggestions used by many social
 * platforms. A lighter-weight alternative to UUID-based suffixes when a
 * shorter, easier-to-type username is preferred.
 *
 * @param params - Configuration object for username generation
 * @param params.base - Base text/prefix for the username (default: "user")
 * @param params.digitLength - Number of random digits to append (default: 4)
 *
 * @returns Username string in the format "{base}{digits}"
 *
 * @throws {Error} If base is provided but is not a non-empty string
 * @throws {Error} If digitLength is not a positive integer
 *
 * @example
 * Basic usage
 * generateUsernameWithRandomNumber()
 * Returns: "user4821"
 *
 * @example
 * Custom base and digit length
 * generateUsernameWithRandomNumber({ base: "gamer", digitLength: 6 })
 * Returns: "gamer193042"
 */
export const generateUsernameWithRandomNumber = ({
  base = 'user',
  digitLength = 4,
}: GenerateUsernameWithRandomNumberParams = {}): string => {
  if (typeof base !== 'string' || base.trim().length === 0) {
    throw new Error(
      `base must be a non-empty string. Received: ${typeof base === 'string' ? '"' + base + '"' : typeof base}`,
    )
  }

  if (!Number.isInteger(digitLength) || digitLength <= 0) {
    throw new Error(
      `digitLength must be a positive integer. Received: ${digitLength}`,
    )
  }

  const min = 10 ** (digitLength - 1)
  const max = 10 ** digitLength - 1
  const randomDigits = Math.floor(Math.random() * (max - min + 1)) + min

  return `${normalizeIdentifier(base)}${randomDigits}`
}

// ============================================================================
// 5. generateUsernameSuggestions — multiple candidates, e.g. for signup UIs
// ============================================================================

type GenerateUsernameSuggestionsParams = {
  /** Base text to derive suggestions from (e.g. name or email local part) */
  base: string
  /** How many suggestions to generate (default: 3) */
  count?: number
}

/**
 * Generates multiple username suggestions from a single base string,
 * similar to the "pick a username" suggestion lists shown during signup
 * on platforms like GitHub or X/Twitter.
 *
 * @param params - Configuration object for suggestion generation
 * @param params.base - Base text to derive suggestions from (required, non-empty)
 * @param params.count - How many suggestions to generate (default: 3)
 *
 * @returns Array of unique username suggestion strings, the first being
 * the plain normalized base (no suffix)
 *
 * @throws {Error} If base is not a non-empty string
 * @throws {Error} If count is not a positive integer
 * @throws {Error} If the normalized base is empty (only special characters)
 *
 * @example
 * Basic usage
 * generateUsernameSuggestions({ base: "Jane Doe" })
 * Returns: ["jane-doe", "jane-doe-742", "jane-doe-8f3a"]
 */
export const generateUsernameSuggestions = ({
  base,
  count = 3,
}: GenerateUsernameSuggestionsParams): string[] => {
  if (typeof base !== 'string' || base.trim().length === 0) {
    throw new Error(
      `base must be a non-empty string. Received: ${typeof base === 'string' ? '"' + base + '"' : typeof base}`,
    )
  }

  if (!Number.isInteger(count) || count <= 0) {
    throw new Error(`count must be a positive integer. Received: ${count}`)
  }

  const normalizedBase = normalizeIdentifier(base)

  if (normalizedBase.length === 0) {
    throw new Error(
      'Generated username is empty. base may contain only special characters.',
    )
  }

  const suggestions = new Set<string>([normalizedBase])

  // Alternate between a short random number and a short UUID fragment so
  // suggestions look varied instead of just incrementing counters.
  while (suggestions.size < count) {
    const useNumber = suggestions.size % 2 === 1

    const suffix = useNumber
      ? String(Math.floor(Math.random() * 900) + 100) // e.g. "742"
      : getUuidSegment(crypto.randomUUID()).slice(0, 4) // e.g. "8f3a"

    suggestions.add(`${normalizedBase}-${suffix}`)
  }

  return Array.from(suggestions)
}

// ============================================================================
// 6. generateUniqueUsername — async, checked against a data source
// ============================================================================

type GenerateUniqueUsernameParams = {
  /** The desired base username (e.g. derived from name or email) */
  base: string
  /** Async callback that resolves to true if the username is already taken */
  isTaken: (username: string) => Promise<boolean>
  /** Maximum number of attempts before giving up (default: 5) */
  maxAttempts?: number
}

/**
 * Generates a username that is guaranteed to be available by checking a
 * base candidate first, then falling back to UUID-suffixed variants if
 * it's taken. Intended for signup flows backed by a database or user
 * store where uniqueness must be verified, not just assumed.
 *
 * @param params - Configuration object for username generation
 * @param params.base - The desired base username (required, non-empty)
 * @param params.isTaken - Async callback that checks whether a username already exists
 * @param params.maxAttempts - Maximum number of attempts before giving up (default: 5)
 *
 * @returns Promise resolving to an available username string
 *
 * @throws {Error} If base is not a non-empty string
 * @throws {Error} If the normalized base is empty (only special characters)
 * @throws {Error} If no available username is found within maxAttempts
 *
 * @example
 * Basic usage
 * await generateUniqueUsername({
 *   base: "john-doe",
 *   isTaken: async (username) => db.users.exists({ username }),
 * })
 * Returns: "john-doe" (if available) or "john-doe-a1b2c3d4" (if taken)
 */
export const generateUniqueUsername = async ({
  base,
  isTaken,
  maxAttempts = 5,
}: GenerateUniqueUsernameParams): Promise<string> => {
  if (typeof base !== 'string' || base.trim().length === 0) {
    throw new Error(
      `base must be a non-empty string. Received: ${typeof base === 'string' ? '"' + base + '"' : typeof base}`,
    )
  }

  const normalizedBase = normalizeIdentifier(base)

  if (normalizedBase.length === 0) {
    throw new Error(
      'Generated username is empty. base may contain only special characters.',
    )
  }

  if (!(await isTaken(normalizedBase))) {
    return normalizedBase
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = `${normalizedBase}-${getUuidSegment(crypto.randomUUID())}`

    if (!(await isTaken(candidate))) {
      return candidate
    }
  }

  throw new Error(
    `Could not generate a unique username after ${maxAttempts} attempts`,
  )
}
