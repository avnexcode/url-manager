import { HomePage } from '@/features/home/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/')({
  head: () => ({
    meta: [
      { title: 'Home' },
      {
        name: 'description',
        content: 'Pelajari lebih lanjut tentang tim kami.',
      },
    ],
  }),
  component: HomePage,
})
