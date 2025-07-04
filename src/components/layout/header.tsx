"use client"

import { Facebook, PanelLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserNav } from "./user-nav"
import { LanguageSwitcher } from "../language-switcher"
import { AppSidebar } from "./sidebar"
import { useLanguage } from "@/contexts/language-context"

export function Header() {
  const { t } = useLanguage();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <AppSidebar />
        </SheetContent>
      </Sheet>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Link href="/" className="flex items-center gap-2 font-semibold">
            <Facebook className="h-6 w-6 text-primary" />
            <span className="">{t('app.name')}</span>
        </Link>
      </div>
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* Placeholder for future search */}
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <UserNav />
      </div>
    </header>
  )
}
