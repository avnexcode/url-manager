import type { DBClient } from '@/server/db'
import { CommonService } from '../common'
import { IdentifierService } from '../identifier'
import { UrlService } from '../url'

export class DummyService extends CommonService {
  private static getSocialUrls = (identifierId: string) => {
    return [
      {
        title: 'Instagram',
        description: 'Tautan menuju akun Instagram pribadi.',
        url: 'https://www.instagram.com/fauzi.n4_',
        thumbnail: null,
        platformId: null,
        identifierId,
      },
      {
        title: 'Facebook',
        description: 'Tautan menuju akun Facebook pribadi.',
        url: 'https://www.facebook.com/muhammad.fauzi.nur.aziz',
        thumbnail: null,
        platformId: null,
        identifierId,
      },
      {
        title: 'LinkedIn',
        description: 'Tautan menuju profil LinkedIn profesional.',
        url: 'https://www.linkedin.com/in/muhammad-fauzi-nur-aziz-511b8b241',
        thumbnail: null,
        platformId: null,
        identifierId,
      },
      {
        title: 'GitHub',
        description: 'Tautan menuju akun GitHub pribadi.',
        url: 'https://github.com/avnexcode',
        thumbnail: null,
        platformId: null,
        identifierId,
      },
      {
        title: 'X (Twitter)',
        description: 'Tautan menuju akun X (Twitter) pribadi.',
        url: 'https://x.com/Avnexeed2',
        thumbnail: null,
        platformId: null,
        identifierId,
      },
    ]
  }

  static init = async (db: DBClient, userId: string) => {
    const identifier = await IdentifierService.create(db, userId, {
      title: 'Programmer Ganteng',
      visibility: 'PRIVATE',
      password: null,
      thumbnail: null,
    })

    await UrlService.createMany(db, userId, this.getSocialUrls(identifier.id))
  }
}
