"use client"

import { Facebook } from "lucide-react"
import Link from "next/link"

import { LanguageSwitcher } from "../language-switcher"
import { useLanguage } from "@/contexts/language-context"

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="relative sticky top-0 z-30 flex h-16 items-center justify-between bg-primary px-4 text-primary-foreground sm:px-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 font-semibold">
            <Facebook className="h-8 w-8 text-primary-foreground" />
        </Link>
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2 text-xl font-bold">
        <span>{t('app.name')}</span>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
      </div>
    </header>
  )
}
