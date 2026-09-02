import { env } from '@/configs/env'
import type { DBClient } from '@/server/db'
import { CommonService } from '../common'
import { IdentifierService } from '../identifier'
import type { CreatePlatformRequest } from '../platform'
import { PlatformService } from '../platform'
import type { CreateUrlRequest } from '../url'
import { UrlService } from '../url'

type PlatformData = {
  instagram: string | null
  facebook: string | null
  linkedin: string | null
  github: string | null
  twitter: string | null
}

export class DummyService extends CommonService {
  protected static isDev = env.NODE_ENV === 'development'

  private static getPlatformUrls = (): CreatePlatformRequest[] => {
    return [
      {
        title: 'Instagram',
        url: 'https://www.instagram.com/',
        visibility: 'PRIVATE',
        password: null,
        thumbnail: null,
      },
      {
        title: 'Facebook',
        url: 'https://www.facebook.com/',
        visibility: 'PRIVATE',
        password: null,
        thumbnail: null,
      },
      {
        title: 'LinkedIn',
        url: 'https://www.linkedin.com/',
        visibility: 'PRIVATE',
        password: null,
        thumbnail: null,
      },
      {
        title: 'GitHub',
        url: 'https://github.com/',
        visibility: 'PRIVATE',
        password: null,
        thumbnail: null,
      },
      {
        title: 'X (Twitter)',
        url: 'https://x.com/',
        visibility: 'PRIVATE',
        password: null,
        thumbnail: null,
      },
    ]
  }

  private static getSocialUrls = (
    identifierId: string,
    platform?: PlatformData | null,
  ): CreateUrlRequest[] => {
    return [
      {
        title: 'Instagram',
        description: 'Tautan menuju akun Instagram Programmer Ganteng.',
        url: 'https://www.instagram.com/fauzi.n4_',
        thumbnail: null,
        platformId: platform?.instagram,
        identifierId,
      },
      {
        title: 'Facebook',
        description: 'Tautan menuju akun Facebook Programmer Ganteng.',
        url: 'https://www.facebook.com/muhammad.fauzi.nur.aziz',
        thumbnail: null,
        platformId: platform?.facebook,
        identifierId,
      },
      {
        title: 'LinkedIn',
        description: 'Tautan menuju profil LinkedIn profesional.',
        url: 'https://www.linkedin.com/in/muhammad-fauzi-nur-aziz-511b8b241',
        thumbnail: null,
        platformId: platform?.linkedin,
        identifierId,
      },
      {
        title: 'GitHub',
        description: 'Tautan menuju akun GitHub Programmer Ganteng.',
        url: 'https://github.com/avnexcode',
        thumbnail: null,
        platformId: platform?.github,
        identifierId,
      },
      {
        title: 'X (Twitter)',
        description: 'Tautan menuju akun X (Twitter) Programmer Ganteng.',
        url: 'https://x.com/Avnexeed2',
        thumbnail: null,
        platformId: platform?.twitter,
        identifierId,
      },
    ]
  }

  static init = async (db: DBClient, userId: string) => {
    const programmerGanteng = await IdentifierService.create(db, userId, {
      title: 'Programmer Ganteng',
      visibility: 'PRIVATE',
      password: '@ProgrammerGantengBanget188',
      thumbnail: null,
    })

    const instagram = await PlatformService.create(
      db,
      userId,
      this.getPlatformUrls()[0],
    )

    const facebook = await PlatformService.create(
      db,
      userId,
      this.getPlatformUrls()[1],
    )

    await UrlService.createMany(
      db,
      userId,
      this.getSocialUrls(programmerGanteng.id, {
        instagram: instagram.id,
        facebook: facebook.id,
        linkedin: null,
        github: null,
        twitter: null,
      }),
    )
  }
}
