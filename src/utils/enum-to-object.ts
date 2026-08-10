export const enumToObject = <T extends Record<string, string | number>>(
  model: T,
) => {
  return Object.values(model) as [T[keyof T], ...T[keyof T][]]
}

