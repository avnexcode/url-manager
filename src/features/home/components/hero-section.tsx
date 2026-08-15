import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { SectionPage } from '../layouts'

export const HeroSection = () => {
  return (
    <SectionPage className="mt-0 flex w-full flex-col items-center justify-center gap-16 text-center md:mt-40">
      <h1 className="text-[2.7rem] font-extrabold sm:text-6xl md:text-7xl">
        URL Manager <span className="font-light">App</span>
      </h1>
      <div className="space-y-8">
        <p className="max-w-2xl text-[16px] sm:text-xl">
          Centralize and organize your bookmarks from multiple social media
          platforms in one secure location. Share curated URL collections with
          friends, manage downloads efficiently, and never lose track of your
          saved content again with custom categorization and access control.
        </p>
        <p className="max-w-2xl text-sm sm:text-lg">
          Don&apos;t store or share any content that contains pornographic
          material on this platform. Such actions violate the terms of use and
          may result in the suspension or deletion of your account.
        </p>
      </div>
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <Link to="/{-$locale}/dashboard">
          <Button size="lg" variant="default" className="px-8 font-bold">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </SectionPage>
  )
}
