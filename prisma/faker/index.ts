import { bulkCreateIdentifiersRequest } from '@/server/features/identifier'
import { bulkCreatePlatformsRequest } from '@/server/features/platform'
import { bulkCreateUrlsRequest } from '@/server/features/url'
import { faker } from '@faker-js/faker'

export const generateIdentifiers = (count: number) => {
  const titles = faker.helpers.uniqueArray(() => {
    return `${faker.commerce.productName()} ${faker.string.alphanumeric(4)}`
  }, count)

  return bulkCreateIdentifiersRequest.parse(
    titles.map((title) => {
      const isPublic = faker.datatype.boolean({ probability: 0.7 })

      return {
        title,
        description: faker.lorem.sentence(),
        visibility: isPublic ? 'PUBLIC' : 'PRIVATE',
        password: isPublic ? null : faker.internet.password({ length: 10 }),
        thumbnail: null,
      }
    }),
  )
}

export const generatePlatforms = (count: number) => {
  const titles = faker.helpers.uniqueArray(() => {
    return `${faker.company.name()} ${faker.string.alphanumeric(4)}`
  }, count)

  return bulkCreatePlatformsRequest.parse(
    titles.map((title) => {
      const isPublic = faker.datatype.boolean({ probability: 0.7 })

      return {
        title,
        description: faker.lorem.sentence(),
        url: faker.internet.url(),
        visibility: isPublic ? 'PUBLIC' : 'PRIVATE',
        password: isPublic ? null : faker.internet.password({ length: 10 }),
        thumbnail: null,
      }
    }),
  )
}

export const generateUrls = (
  count: number,
  platformIds: string[],
  identifierIds: string[],
) => {
  const titles = faker.helpers.uniqueArray(() => {
    return `${faker.company.buzzNoun()} ${faker.string.alphanumeric(4)}`
  }, count)

  return bulkCreateUrlsRequest.parse(
    titles.map((title) => {
      const source = faker.helpers.arrayElement([
        'platform',
        'identifier',
        'none',
      ] as const)

      return {
        title,
        description: faker.lorem.sentence(),
        url: faker.internet.url(),
        thumbnail: null,
        platformId:
          source === 'platform'
            ? faker.helpers.arrayElement(platformIds)
            : null,
        identifierId:
          source === 'identifier'
            ? faker.helpers.arrayElement(identifierIds)
            : null,
      }
    }),
  )
}
