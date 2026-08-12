import { Link } from '@tanstack/react-router'
import { ParaglideLocaleSwitcher, ThemeToggle } from '../actions'
import { Heading } from '../heading'
import { Button } from '../ui/button'
import { env } from '@/configs/env'

export const Header = () => {
  return (
    <header className="container flex w-full items-center justify-between py-10">
      <Heading size={'h3'}>{env.VITE_APP_TITLE}</Heading>
      <nav className="flex items-center gap-x-3">
        <Button asChild>
          <Link to="/{-$locale}">Home</Link>
        </Button>
        <Button asChild>
          <Link to="/{-$locale}/about">About</Link>
        </Button>
        <Button asChild>
          <Link to="/{-$locale}/register">Register</Link>
        </Button>
      </nav>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <ParaglideLocaleSwitcher />
      </div>
    </header>
  )
}
