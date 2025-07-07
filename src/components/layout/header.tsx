
"use client"

import { Facebook, Trophy, ArrowLeft, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { LanguageSwitcher } from "../language-switcher"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "../ui/button"

export function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-primary px-4 text-primary-foreground sm:px-6">
      {/* Left section */}
      <div className="flex flex-1 items-center gap-2">
        {pathname !== '/' ? (
          <Link href="/" passHref>
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:ml-2 sm:inline-block">{t('back')}</span>
            </Button>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-2 font-semibold">
              <Facebook className="h-8 w-8 text-primary-foreground" />
          </Link>
        )}
      </div>
      
      {/* Center section (app name) */}
      <div className="flex-shrink-0">
        <Link href="/" className="text-xl font-bold">
          <span>{t('app.name')}</span>
        </Link>
      </div>

      {/* Right section */}
      <div className="flex flex-1 items-center justify-end gap-1">
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Link href="/leaderboard" passHref>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
            <Trophy className="h-5 w-5" />
          </Button>
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
