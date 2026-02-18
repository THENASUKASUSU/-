"use client"

import { Search, Grid, List, SortAsc, Filter } from "lucide-react"
import { GlassInput } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDAMStore } from "@/lib/store"

interface GalleryFiltersProps {
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
}

export function GalleryFilters({ viewMode, setViewMode }: GalleryFiltersProps) {
  const { searchQuery, setSearchQuery } = useDAMStore()

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <GlassInput
          placeholder="Search by name, tag, or type..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <Button variant="glass" size="sm" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
        <Button variant="glass" size="sm" className="gap-2">
          <SortAsc className="h-4 w-4" /> Sort
        </Button>
        <div className="h-8 w-px bg-white/10 mx-2" />
        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
          <Button
            variant={viewMode === 'grid' ? "glass" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? "glass" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
