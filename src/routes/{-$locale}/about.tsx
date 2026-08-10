import { AboutPage } from '@/features/home/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/about')({
  head: () => ({
    meta: [
      { title: 'About' },
      {
        name: 'description',
        content: 'Pelajari lebih lanjut tentang tim kami.',
      },
    ],
  }),
  component: AboutPage,
})
