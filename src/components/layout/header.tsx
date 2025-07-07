
"use client"

import { Facebook, Trophy } from "lucide-react"
import Link from "next/link"

import { LanguageSwitcher } from "../language-switcher"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "../ui/button"

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="relative sticky top-0 z-30 flex h-16 items-center justify-between bg-primary px-4 text-primary-foreground sm:px-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 font-semibold">
            <Facebook className="h-8 w-8 text-primary-foreground" />
        </Link>
      </div>
      
      <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-xl font-bold">
        <span>{t('app.name')}</span>
      </Link>

      <div className="flex items-center gap-2">
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
