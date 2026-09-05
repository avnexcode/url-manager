// import { createEnv } from '@t3-oss/env-core'
// import { z } from 'zod'

// export const env = createEnv({
//   server: {
// NODE_ENV: z
//   .enum(['development', 'test', 'production'])
//   .default('development'),
//     SERVER_URL: z.string(),
//     SUPABASE_SERVICE_ROLE_KEY: z.string(),
//     SUPABASE_SECRET_JWT: z.string(),
//   },

//   clientPrefix: 'VITE_',

//   client: {
//     VITE_APP_TITLE: z.string().min(1),
//     VITE_BASE_URL: z.string().min(1),
//     VITE_SUPABASE_URL: z.string(),
//     VITE_SUPABASE_ANON_KEY: z.string(),
//     VITE_OG_IMAGE_URL: z.string(),
//   },

//   // runtimeEnv: import.meta.env,
//   runtimeEnv: {
//     // server
// NODE_ENV: process.env.NODE_ENV,
//     SERVER_URL: process.env.SERVER_URL,
//     SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
//     SUPABASE_SECRET_JWT: process.env.SUPABASE_SECRET_JWT,
//     // client
//     VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
//     VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
//     VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
//     VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
//     VITE_OG_IMAGE_URL: import.meta.env.VITE_OG_IMAGE_URL,
//   },

//   emptyStringAsUndefined: true,
// })

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SERVER_URL: z.string(),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
    SUPABASE_SECRET_JWT: z.string(),
  },

  clientPrefix: 'VITE_',

  client: {
    VITE_APP_TITLE: z.string().min(1),
    VITE_BASE_URL: z.string().min(1),
    VITE_SUPABASE_URL: z.string(),
    VITE_SUPABASE_ANON_KEY: z.string(),
    VITE_OG_IMAGE_URL: z.string(),
  },

  runtimeEnv: {
    // server
    SERVER_URL: process.env.SERVER_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_SECRET_JWT: process.env.SUPABASE_SECRET_JWT,
    // client — pakai import.meta.env kalau ada (Vite), fallback ke process.env
    // (saat dijalankan via tsx/Node, misalnya prisma seed)
    VITE_APP_TITLE:
      import.meta.env?.VITE_APP_TITLE ?? process.env.VITE_APP_TITLE,
    VITE_BASE_URL: import.meta.env?.VITE_BASE_URL ?? process.env.VITE_BASE_URL,
    VITE_SUPABASE_URL:
      import.meta.env?.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY:
      import.meta.env?.VITE_SUPABASE_ANON_KEY ??
      process.env.VITE_SUPABASE_ANON_KEY,
    VITE_OG_IMAGE_URL:
      import.meta.env?.VITE_OG_IMAGE_URL ?? process.env.VITE_OG_IMAGE_URL,
  },

  emptyStringAsUndefined: true,
})
