import * as React from 'react'

/**
 * Props for the renderElements utility function
 * @template T - The type of items in the array to be rendered
 */
type RenderElementsProps<T> = {
  /** Array of items to render. Can be null/undefined for loading states */
  of?: T[] | null
  /** Function that renders each item into a React element */
  render: (item: T, index: number) => React.ReactElement | null | undefined
  /** Optional function to extract unique keys from items */
  keyExtractor?: (item: T, index: number) => string | number
  /** Content to display when array is empty, null, or invalid */
  fallback?: React.ReactNode
  /** Flag to indicate loading state (skips empty array checks) */
  isLoading?: boolean
}

/**
 * Utility function to safely render arrays of React elements with proper key management
 *
 * This function provides a type-safe way to map over arrays and render React elements
 * with automatic key handling, fallback support, and comprehensive error checking.
 *
 * **Key Features:**
 * - Automatic key management with multiple strategies
 * - Null/undefined safety for loading states
 * - Type-safe rendering with generic support
 * - Development warnings for common pitfalls
 * - Fallback UI for empty/invalid states
 * - Validation of render output
 *
 * **Key Assignment Priority:**
 * 1. Uses existing key from rendered element if present
 * 2. Uses keyExtractor function if provided
 * 3. Falls back to array index (with dev warning)
 *
 * @template T - The type of items being rendered
 * @param props - Configuration object for rendering
 * @param props.of - Array of items to render (can be null/undefined during loading)
 * @param props.render - Function that converts each item to a React element
 * @param props.keyExtractor - Optional function to generate unique keys for items
 * @param props.fallback - React node to display when array is empty/null/invalid
 * @param props.isLoading - If true, skips empty array validation (default: false)
 *
 * @returns React nodes representing the rendered items, or fallback content
 *
 * @example
 * Basic usage with simple array
 * renderElements({
 *   of: ['apple', 'banana', 'cherry'],
 *   render: (fruit) => <div>{fruit}</div>,
 *   keyExtractor: (fruit) => fruit
 * })
 *
 * @example
 * With objects and custom key extractor
 * interface User {
 *   id: string;
 *   name: string;
 * }
 *
 * renderElements<User>({
 *   of: users,
 *   render: (user, index) => (
 *     <UserCard user={user} position={index} />
 *   ),
 *   keyExtractor: (user) => user.id,
 *   fallback: <EmptyState message="No users found" />
 * })
 *
 * @example
 * With loading state
 * renderElements({
 *   of: data,
 *   render: (item) => <ItemCard {...item} />,
 *   isLoading: isLoading,
 *   fallback: isLoading ? <Skeleton /> : <EmptyState />
 * })
 *
 * @example
 * Element with built-in key (no keyExtractor needed)
 * renderElements({
 *   of: products,
 *   render: (product) => <ProductCard key={product.id} {...product} />
 * })
 *
 * @example
 * Handling null/undefined data safely
 * const data = await fetchData(); // might be null
 * renderElements({
 *   of: data,
 *   render: (item) => <div>{item.name}</div>,
 *   fallback: <div>No data available</div>
 * })
 *
 * @warning Using array index as key can cause issues with:
 * - Reordering items
 * - Adding/removing items dynamically
 * - Component state preservation
 * Consider using unique identifiers when possible.
 *
 * @see https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key
 */
export const renderElements = <T>({
  of = [],
  render,
  keyExtractor,
  fallback,
  isLoading = false,
}: RenderElementsProps<T>): React.ReactNode | null | undefined => {
  // Handle null/undefined arrays (common during loading states)
  if (!of) return fallback ?? null

  // Validate that 'of' is actually an array
  if (!isLoading && !Array.isArray(of)) {
    console.warn(
      'renderElements: "of" prop must be an array. Received:',
      typeof of,
      'Consider checking your data fetching logic.',
    )
    return fallback ?? null
  }

  // Show fallback for empty arrays (unless currently loading)
  if (!isLoading && of.length === 0) return fallback ?? null

  // Map over items and render with proper key management
  return of.map((item, index) => {
    // Execute render function for current item
    const element = render(item, index)

    // Validate render function returns a valid React element
    if (!React.isValidElement(element)) {
      console.warn(
        'renderElements: render function must return a valid React element.',
        'Received:',
        typeof element,
        'at index:',
        index,
        'for item:',
        item,
      )
      return null
    }

    // Strategy 1: Use existing key if element already has one
    if (element.key != null) {
      return element
    }

    // Strategy 2: Use keyExtractor function if provided
    if (keyExtractor) {
      const key = keyExtractor(item, index)
      return React.cloneElement(element, { key })
    }

    // Strategy 3: Fallback to index (with warning in development)
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'renderElements: Using array index as key. This may cause performance issues with dynamic lists.',
        'Consider providing a keyExtractor function or adding keys to rendered elements.',
        'Item:',
        item,
        'Index:',
        index,
      )
    }

    return React.cloneElement(element, { key: index })
  })
}

/**
 * Type guard to check if a value is a non-empty array
 * Useful for conditional rendering logic
 *
 * @param value - Value to check
 * @returns True if value is a non-empty array
 *
 * @example
 * if (isNonEmptyArray(data)) {
 *   return renderElements({ of: data, render: ... });
 * }
 */
export const isNonEmptyArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value) && value.length > 0
}

/**
 * Helper to create a key extractor function from an object property
 *
 * @param key - Property name to use as key
 * @returns Key extractor function
 *
 * @example
 * renderElements({
 *   of: users,
 *   render: (user) => <UserCard {...user} />,
 *   keyExtractor: createKeyExtractor('id')
 * })
 */
export const createKeyExtractor = <T>(
  key: keyof T,
): ((item: T, index: number) => string | number) => {
  return (item: T) => {
    const value = item[key]
    if (typeof value === 'string' || typeof value === 'number') {
      return value
    }
    throw new Error(
      `Key extractor: Property "${String(key)}" must be a string or number`,
    )
  }
}

