import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { renderElements } from '@/utils'
import { SectionPage } from '../layouts'

const abouts = [
  {
    question: 'What problems does this application solve?',
    answer: `The development of this URL management website application is
      motivated by several common problems encountered in daily
      activities. First, limited Wi-Fi speed at home often forces the
      developer to ask friends for assistance in downloading dramas,
      movies, or specific applications. Second, the habit of bookmarking
      interesting or important content across various social media
      platforms frequently creates difficulties in remembering where
      specific content was saved, despite recalling having bookmarked it.
      Third, repetitive questions from friends regarding applications or
      tools used to support programming activities serve as additional
      motivation for developing this solution.`,
  },
  {
    question: 'How does the URL categorization system work?',
    answer: `Based on these problems, a comprehensive website was developed
      to serve as a centralized platform for collecting and managing
      important URLs through a flexible categorization system. This
      system allows users to categorize URLs based on platforms (types of
      social media or content sources) and identifiers (special markers
      such as content creator names or specific categories), and can even
      combine both parameters simultaneously for more specific and
      organized grouping.`,
  },
  {
    question: 'What are the main features and security measures?',
    answer: `The website offers three main integrated features. The flexible
      categorization system enables users to customize URL grouping
      according to their specific needs. Access control sharing provides
      users with complete control over their content visibility, including
      the ability to restrict access, add passwords to individual platforms
      or identifiers, and configure granular content visibility levels.
      From a security perspective, all stored data, including names, URLs,
      and passwords, are encrypted as ciphertext in the database with
      layered security system implementation, ensuring that only account
      owners can access and view their data.`,
  },
  {
    question: 'What benefits can users expect from this platform?',
    answer: `The benefits offered by this website include centralized
      management of all important URLs within a single platform, easy
      sharing of URL collections with friends based on specific
      categories, data protection through robust encryption systems,
      organizational flexibility that can be adapted to user needs,
      and detailed access control for each category or collection.
      Thus, this website is designed as a comprehensive solution for
      URL management and sharing while maintaining user security and
      privacy aspects.`,
  },
]

export const AboutSection = () => {
  return (
    <SectionPage title="About" sectionClassName="xl:flex-row">
      <div className="w-full">
        <Accordion type="single" collapsible className="w-full">
          {renderElements({
            of: abouts,
            keyExtractor: (about) => about.question,
            render: (about, index) => (
              <AccordionItem value={`question-${index}`}>
                <AccordionTrigger>{about.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-justify leading-6">{about.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ),
          })}
        </Accordion>
      </div>
    </SectionPage>
  )
}
