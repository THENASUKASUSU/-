"use client"

import { Folder, ChevronRight, Plus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDAMStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function FolderTree({ activeFolderId, onFolderSelect }: { activeFolderId: string | null, onFolderSelect: (id: string | null) => void }) {
  const { folders, addFolder } = useDAMStore()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2 mb-4">
        <h4 className="text-xs font-bold uppercase text-white/40 tracking-wider">Folders</h4>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => addFolder({
          id: Math.random().toString(36).substr(2, 9),
          name: "New Folder",
          parentId: null,
          createdAt: new Date().toISOString()
        })}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-1">
        <Button
          variant={activeFolderId === null ? "glass-primary" : "ghost"}
          className="w-full justify-start h-9 text-sm font-normal"
          onClick={() => onFolderSelect(null)}
        >
          <Folder className="h-4 w-4 mr-2" /> All Assets
        </Button>
        {folders.map(folder => (
          <Button
            key={folder.id}
            variant={activeFolderId === folder.id ? "glass-primary" : "ghost"}
            className="w-full justify-start h-9 text-sm font-normal"
            onClick={() => onFolderSelect(folder.id)}
          >
            <Folder className="h-4 w-4 mr-2" /> {folder.name}
            <ChevronRight className="ml-auto h-3 w-3 opacity-40" />
          </Button>
        ))}
      </div>
    </div>
  )
}
