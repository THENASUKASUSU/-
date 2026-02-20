"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Upload,
  GalleryVertical,
  BarChart3,
  User,
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

import { motion } from "framer-motion"

export function GlassSidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside className={cn("flex flex-col w-64 glass-card border-l-0 border-t-0 border-b-0 rounded-none h-screen sticky top-0 z-50", className)}>
      <div className="p-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-black bg-gradient-to-br from-white via-white to-white/20 bg-clip-text text-transparent tracking-tighter"
        >
          DAM <span className="text-blue-500">.</span>
        </motion.h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 py-4">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Button
                asChild
                variant={isActive ? "glass-primary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-4 px-4 h-12 transition-all duration-500 rounded-xl relative overflow-hidden group",
                  isActive
                    ? "bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] text-white"
                    : "hover:bg-white/5 text-muted-foreground hover:text-white"
                )}
              >
                <Link href={item.href}>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute left-0 w-1 h-6 bg-blue-500 rounded-full"
                    />
                  )}
                  <item.icon className={cn("h-5 w-5 transition-transform duration-500 group-hover:scale-110", isActive ? "text-blue-400" : "")} />
                  <span className="font-medium tracking-tight">{item.name}</span>
                  {isActive && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><ChevronRight className="ml-auto h-4 w-4 text-blue-400" /></motion.div>}
                </Link>
              </Button>
            </motion.div>
          )
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="glass-card bg-gradient-to-br from-white/5 to-transparent p-5 rounded-2xl border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest">Vault Status</p>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[10px] text-muted-foreground font-medium uppercase">Encrypted</span>
            <span className="text-xs font-bold font-mono text-white">1.2 / 2.0 GB</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
