/**
 * ASCII art brand logo displayed on application startup
 */
export const stringBrandASCII = `
   _             Welcome To           _      
  /_\\__   ___ __   _____  _____  __ _| | ___ 
 //_\\\\ \\ / / '_ \\ / _ \\ \\/ / __|/ _\` | |/ _ \\
/  _  \\ V /| | | |  __/>  <\\__ \\ (_| | |  __/
\\_/ \\_/\\_/ |_| |_|\\___/_/\\_\\___/\\__,_|_|\\___|                                           
`

/**
 * Mapping of leet speak numbers to their alphabet equivalents
 * Used to convert numbers in leet speak format to readable text
 */
export const leetMapString: Record<string, string[]> = {
  a: ['4', '@', 'a'],
  b: ['8', 'b'],
  c: ['(', '<', 'c'],
  d: ['|)', 'd'],
  e: ['3', 'e'],
  f: ['|=', 'f'],
  g: ['6', 'g', '9'],
  h: ['#', 'h'],
  i: ['1', '!', 'i'],
  j: ['_|', 'j'],
  k: ['|<', 'k'],
  l: ['1', '|_', 'l'],
  m: ['/\\/\\', 'm'],
  n: ['|\\|', 'n'],
  o: ['0', 'o'],
  p: ['|*', 'p'],
  q: ['9', 'q'],
  r: ['|2', 'r'],
  s: ['5', '$', 's'],
  t: ['7', '+', 't'],
  u: ['|_|', 'u'],
  v: ['\\/', 'v'],
  w: ['\\/\\/', 'w'],
  x: ['><', 'x'],
  y: ['`/', 'y'],
  z: ['2', 'z'],
}

/**
 * Capitalizes the first letter of a sentence and lowercases the rest
 * @param str - The input string to capitalize
 * @returns Sentence-cased string
 * @example capitalizeSentence("hello WORLD") // "Hello world"
 */
export const capitalizeSentence = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Capitalizes the first letter of each word in a string (Title Case)
 * @param str - The input string to capitalize
 * @returns Title-cased string
 * @example capitalizeWords("hello world") // "Hello World"
 */
export const capitalizeWords = (str: string): string => {
  if (!str) return ''
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Capitalizes only the first letter of a string, leaving the rest of the string untouched
 * (preserves existing casing, e.g. camelCase)
 * @param str - The input string to capitalize
 * @returns String with the first letter capitalized and the remainder unchanged
 * @example capitalizeFirstLetter("godofWar") // "GodofWar"
 * @example capitalizeFirstLetter("hello WORLD") // "Hello WORLD"
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Extracts the first N letters from a text string
 * @param text - The input text
 * @param count - Number of letters to extract
 * @returns String containing the first N letters
 * @example getFirstLetters("Hello World", 5) // "Hello"
 */
export const getFirstLetters = (text: string, count: number): string => {
  if (!text || count <= 0) return ''
  return text.slice(0, count)
}

/**
 * Extracts the first N words from a text string
 * @param text - The input text
 * @param count - Number of words to extract
 * @returns String containing the first N words
 * @example getFirstWords("The quick brown fox", 2) // "The quick"
 */
export const getFirstWords = (text: string, count: number): string => {
  if (!text || count <= 0) return ''
  return text.trim().split(/\s+/).slice(0, count).join(' ')
}

/**
 * Extracts the last N words from a text string
 * @param text - The input text
 * @param count - Number of words to extract
 * @returns String containing the last N words
 * @example getLastWords("The quick brown fox", 2) // "brown fox"
 */
export const getLastWords = (text: string, count: number): string => {
  if (!text || count <= 0) return ''
  const words = text.trim().split(/\s+/)
  return words.slice(-count).join(' ')
}

/**
 * Truncates text to a maximum length and adds ellipsis if truncated
 * @param text - The input text to truncate
 * @param maxLength - Maximum character length
 * @returns Truncated string with ellipsis if needed
 * @example truncateText("Hello World", 8) // "Hello Wo..."
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  if (maxLength <= 0) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Counts the number of words in a text string
 * @param text - The input text
 * @returns Number of words
 * @example countWords("Hello world") // 2
 */
export const countWords = (text: string): number => {
  if (!text.trim()) return 0
  return text.trim().split(/\s+/).length
}

/**
 * Checks if a string contains only alphabetic characters and spaces
 * @param text - The input text to validate
 * @returns True if text contains only letters and spaces, false otherwise
 * @example isAlphabetOnly("Hello World") // true
 * @example isAlphabetOnly("Hello123") // false
 */
export const isAlphabetOnly = (text: string): boolean => {
  if (!text) return false
  return /^[A-Za-z\s]+$/.test(text)
}

/**
 * Removes all non-alphanumeric characters except spaces
 * @param text - The input text to clean
 * @returns String with only alphanumeric characters and spaces
 * @example removeNonAlphanumeric("Hello, World!") // "Hello World"
 */
export const removeNonAlphanumeric = (text: string): string => {
  if (!text) return ''
  return text.replace(/[^a-zA-Z0-9\s]/g, '')
}

/**
 * Normalizes multiple whitespace characters into single spaces and trims
 * @param text - The input text with irregular spacing
 * @returns String with normalized whitespace
 * @example normalizeWhitespace("Hello    World  ") // "Hello World"
 */
export const normalizeWhitespace = (text: string): string => {
  if (!text) return ''
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Removes accent marks and diacritics from characters
 * @param text - The input text with accented characters
 * @returns String with accents removed
 * @example normalizeAccent("café") // "cafe"
 * @example normalizeAccent("naïve") // "naive"
 */
export const normalizeAccent = (text: string): string => {
  if (!text) return ''
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Converts leet speak numbers to their alphabet equivalents
 * @param text - The input text containing leet speak numbers
 * @returns String with numbers converted to letters
 * @example leetMap("h3ll0 w0rld") // "hello world"
 */
export const leetMap = (text: string): string => {
  if (!text) return ''
  return text.replace(/[a-z]/gi, (char) => {
    const key = char.toLowerCase()
    return leetMapString[key][0] ?? char
  })
}

/**
 * Fully normalizes text by removing accents, special characters, extra spaces,
 * and converting to lowercase. Useful for search and comparison operations.
 * @param text - The input text to normalize
 * @returns Fully normalized string
 * @example normalizeText("  Café!  123  ") // "cafe 123"
 */
export const normalizeText = (text: string): string => {
  if (!text) return ''

  // Remove special characters except alphanumeric and spaces
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, '')

  // Remove accents
  const normalizedAccent = normalizeAccent(cleaned)

  // Normalize whitespace
  return normalizeWhitespace(normalizedAccent)
}

/**
 * Converts a string to slug format (lowercase, hyphenated)
 * @param text - The input text
 * @returns Slug-formatted string
 * @example toSlug("Hello World!") // "hello-world"
 */
export const toSlug = (text: string): string => {
  if (!text) return ''
  return normalizeText(text).replace(/\s+/g, '-')
}

/**
 * Reverses a string
 * @param text - The input text
 * @returns Reversed string
 * @example reverseString("hello") // "olleh"
 */
export const reverseString = (text: string): string => {
  if (!text) return ''
  return text.split('').reverse().join('')
}

/**
 * Checks if a string is a palindrome (reads same forwards and backwards)
 * @param text - The input text
 * @returns True if palindrome, false otherwise
 * @example isPalindrome("racecar") // true
 */
export const isPalindrome = (text: string): boolean => {
  if (!text) return false
  const normalized = normalizeText(text).replace(/\s/g, '')
  return normalized === reverseString(normalized)
}

/**
 * Extracts all numbers from a string
 * @param text - The input text
 * @returns Array of numbers found in the string
 * @example extractNumbers("I have 2 cats and 3 dogs") // [2, 3]
 */
export const extractNumbers = (text: string): number[] => {
  if (!text) return []
  const matches = text.match(/\d+/g)
  return matches ? matches.map(Number) : []
}

/**
 * Masks part of a string (useful for sensitive data like emails, phone numbers)
 * @param text - The input text
 * @param visibleStart - Number of characters to show at start
 * @param visibleEnd - Number of characters to show at end
 * @param maskChar - Character to use for masking (default: *)
 * @returns Masked string
 * @example maskString("1234567890", 2, 2) // "12******90"
 */
export const maskString = (
  text: string,
  visibleStart = 2,
  visibleEnd = 2,
  maskChar = '*',
): string => {
  if (!text) return ''
  if (text.length <= visibleStart + visibleEnd) return text

  const start = text.slice(0, visibleStart)
  const end = text.slice(-visibleEnd)
  const maskLength = text.length - visibleStart - visibleEnd

  return start + maskChar.repeat(maskLength) + end
}

export const toSnakeCase = (text: string) => {
  return text.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
}
