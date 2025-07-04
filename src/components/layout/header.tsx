"use client"

import { Facebook, LayoutDashboard, History, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { UserNav } from "./user-nav"
import { LanguageSwitcher } from "../language-switcher"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "dashboard" },
  { href: "/trade-history", icon: History, label: "trade_history" },
  { href: "/settings", icon: Settings, label: "settings" },
]

export function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-primary px-4 text-primary-foreground sm:px-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 font-semibold">
            <Facebook className="h-8 w-8 text-primary-foreground" />
        </Link>
      </div>
      
      <nav className="flex-1 flex justify-center items-center gap-1 sm:gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-12 w-24 flex-col items-center justify-center rounded-lg text-primary-foreground/80 transition-colors hover:bg-black/10 hover:text-primary-foreground",
              pathname === item.href && "bg-black/20 text-primary-foreground"
            )}
            title={t(item.label)}
          >
            <item.icon className="h-6 w-6" />
            <span className="sr-only">{t(item.label)}</span>
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <UserNav />
      </div>
    </header>
  )
}
