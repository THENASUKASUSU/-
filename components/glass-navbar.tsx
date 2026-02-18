"use client"

import { Search, Bell, Menu } from "lucide-react"
import { GlassInput } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { GlassSidebar } from "./glass-sidebar"
import { useDAMStore } from "@/lib/store"

export function GlassNavbar() {
  const { searchQuery, setSearchQuery } = useDAMStore()

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/30 border-b border-white/10 px-4 md:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-none w-64 bg-transparent">
            <GlassSidebar />
          </SheetContent>
        </Sheet>

        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <GlassInput
            placeholder="Search assets, tags..."
            className="pl-10 h-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </Button>
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-primary/40 border border-white/20" />
      </div>
    </header>
  )
}
