"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  GalleryVertical,
  BarChart3,
  User,
  Settings,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Assets Gallery", href: "/gallery", icon: GalleryVertical },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
]

export function GlassSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 glass-card border-l-0 border-t-0 border-b-0 rounded-none h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          DAM v16
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "glass-primary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 px-3 h-11 transition-all duration-300",
                  isActive ? "shadow-inner shadow-white/10" : "hover:translate-x-1"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="glass-card bg-white/5 p-4 rounded-xl border-white/10">
          <p className="text-xs text-muted-foreground mb-2">Storage Usage</p>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-2/3" />
          </div>
          <p className="text-[10px] mt-2 text-right font-mono">1.2GB / 2GB</p>
        </div>
      </div>
    </aside>
  )
}
