type GenerateSlugParams = {
  /** The text to convert into a URL-friendly slug */
  text: string | undefined
  /** Optional UUID to append as suffix when withId is true */
  uuid?: string
  /** Whether to append UUID suffix to the generated slug (default: false) */
  withId?: boolean
}

/**
 * Generates a URL-friendly slug from text with optional UUID suffix
 *
 * This function performs comprehensive text normalization:
 * - Converts to lowercase
 * - Removes accents and diacritics
 * - Replaces spaces with hyphens
 * - Removes special characters (keeps only alphanumeric and hyphens)
 * - Removes consecutive hyphens
 * - Trims leading/trailing hyphens
 * - Optionally appends UUID suffix for uniqueness
 *
 * @param params - Configuration object for slug generation
 * @param params.text - The input text to slugify (required, non-empty)
 * @param params.uuid - UUID to append when withId is true (required if withId=true)
 * @param params.withId - Flag to append UUID suffix (default: false)
 *
 * @returns URL-friendly slug string, optionally with UUID suffix
 *
 * @throws {Error} If text is not a string or is empty/whitespace only
 * @throws {Error} If generated slug is empty (input contains only special characters)
 * @throws {Error} If withId is true but uuid is not provided
 *
 * @example
 * Basic usage
 * generateSlug({ text: "Hello World!" })
 * Returns: "hello-world"
 *
 * @example
 * With accents and special characters
 * generateSlug({ text: "Café & Restaurant #1" })
 * Returns: "cafe-restaurant-1"
 *
 * @example
 * With UUID suffix
 * generateSlug({
 *   text: "My Article",
 *   uuid: "123e4567-e89b-12d3-a456-426614174000",
 *   withId: true
 * })
 * Returns: "my-article-426614174000"
 *
 * @example
 * Handles multiple spaces and consecutive hyphens
 * generateSlug({ text: "Hello    World---Test" })
 * Returns: "hello-world-test"
 *
 * @example
 * Error: Empty input
 * generateSlug({ text: "   " })
 * Throws: "Input string cannot be empty or contain only whitespace"
 *
 * @example
 * Error: Only special characters
 * generateSlug({ text: "!@#$%^&*()" })
 * Throws: "Generated slug is empty. Input may contain only special characters."
 *
 * @example
 * Error: Missing UUID when withId is true
 * generateSlug({ text: "Article", withId: true })
 * Throws: "UUID is required when withId = true"
 */
export const generateSlug = ({
  text,
  uuid,
  withId = false,
}: GenerateSlugParams): string => {
  // Validate input is a non-empty string
  if (!text || typeof text !== 'string') {
    throw new Error(
      `Input must be a non-empty string. Received: ${typeof text === 'string' ? '"' + text + '"' : typeof text}`,
    )
  }

  // Check for whitespace-only input
  if (text.trim().length === 0) {
    throw new Error('Input string cannot be empty or contain only whitespace')
  }

  // Generate slug with normalization pipeline
  const slug = text
    .toLowerCase() // Convert to lowercase
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics/accents
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove non-alphanumeric except hyphens
    .replace(/-{2,}/g, '-') // Replace consecutive hyphens with single hyphen
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, '') // Remove trailing hyphens

  // Validate slug is not empty after normalization
  if (slug.length === 0) {
    throw new Error(
      'Generated slug is empty. Input may contain only special characters.',
    )
  }

  // Append UUID suffix if requested
  if (withId) {
    if (!uuid) {
      throw new Error('UUID is required when withId = true')
    }

    // Extract first segment of UUID (before first hyphen) or use entire UUID
    const uuidPrefix = uuid.includes('-')
      ? uuid.substring(0, uuid.indexOf('-'))
      : uuid

    return `${slug}-${uuidPrefix}`
  }

  return slug
}
