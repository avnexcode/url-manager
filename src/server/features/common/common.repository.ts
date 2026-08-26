export class CommonRepository {
  protected static orQuery: string[] = []

  protected static buildNestedQuery(
    field: string,
    search: string,
  ): Record<string, unknown> {
    const keys = field.split('.')
    const isRelation = keys.length > 1

    const innermost = {
      contains: search,
      mode: 'insensitive',
    } as unknown as Record<string, unknown>

    if (isRelation) {
      const [relationKey, ...rest] = keys
      const nestedValue = rest.reduceRight<Record<string, unknown>>(
        (acc, key) => ({ [key]: acc }),
        innermost,
      )
      return { [relationKey]: { is: nestedValue } }
    }

    return { [keys[0]]: innermost }
  }

  protected static getOrQuery(search: string): Array<Record<string, unknown>> {
    return this.orQuery.map((field) => this.buildNestedQuery(field, search))
  }

  protected static buildNestedOrderBy(
    field: string,
    direction: 'asc' | 'desc',
  ): Record<string, unknown> {
    const keys = field.split('.')
    return keys.reduceRight<Record<string, unknown>>(
      (acc, key) => ({ [key]: acc }),
      direction as unknown as Record<string, unknown>,
    )
  }

  protected static getOrderBy(
    sort: { id: string; desc: boolean }[],
  ): Array<Record<string, unknown>> {
    return sort.map((s) =>
      this.buildNestedOrderBy(s.id, s.desc ? 'desc' : 'asc'),
    )
  }
}
