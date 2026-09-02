import { bulkCreateIdentifiersRequest } from '@/server/features/identifier'
import { bulkCreatePlatformsRequest } from '@/server/features/platform'
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
