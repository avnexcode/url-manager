import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { renderElements } from '@/utils'
import { SectionPage } from '../layouts'

const features = [
  {
    title: 'Smart URL Organization',
    content:
      'Categorize URLs by platform and custom identifiers like content creator names or categories. Never lose track of your bookmarks across multiple social media platforms.',
  },
  {
    title: 'Secure Data Protection',
    content:
      'All data including URLs, names, and passwords are encrypted as ciphertext in the database. Only you can access your personal collection with complete privacy.',
  },
  {
    title: 'Flexible Access Control',
    content:
      'Control who can access your shared collections. Set passwords, restrict access levels, and manage visibility for each platform or identifier category.',
  },
  {
    title: 'Easy Collection Sharing',
    content:
      'Share curated URL collections with friends based on specific categories. Perfect for sharing programming tools, resources, or entertainment content.',
  },
  {
    title: 'Content Discovery & Download',
    content:
      'Preview saved content and download files when needed. Ideal for managing downloads through friends when dealing with slow internet connections.',
  },
]

export const FeatureSection = () => {
  return (
    <SectionPage
      title="Features"
      className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:grid-cols-3"
    >
      {renderElements({
        of: features,
        keyExtractor: (feature) => feature.title,
        render: (feature) => (
          <Card className="max-h-fit w-full py-14">
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">{feature.content}</CardContent>
          </Card>
        ),
      })}
    </SectionPage>
  )
}
