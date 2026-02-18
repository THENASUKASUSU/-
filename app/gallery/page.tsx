"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MoreVertical,
  ExternalLink,
  Download,
  Trash2,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Folder
} from "lucide-react"
import { useDAMStore } from "@/lib/store"
import { GlassCard } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GalleryFilters } from "@/components/gallery-filters"
import { AssetPreviewModal } from "@/components/asset-preview-modal"
import { FolderTree } from "@/components/folder-tree"
import { Asset } from "@/lib/types"
import { cn } from "@/lib/utils"
import JSZip from "jszip"

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const { assets, searchQuery, deleteAsset, deleteAssetsBulk } = useDAMStore()

  const openPreview = (asset: Asset) => {
    setSelectedAsset(asset)
    setIsPreviewOpen(true)
  }

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        asset.type.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFolder = activeFolderId ? asset.folderId === activeFolderId : true

      return matchesSearch && matchesFolder
    })
  }, [assets, searchQuery, activeFolderId])

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} assets?`)) {
      deleteAssetsBulk(selectedIds)
      setSelectedIds([])
    }
  }

  const handleExportZip = async () => {
    const zip = new JSZip()
    const assetsToExport = assets.filter(a => selectedIds.includes(a.id))

    for (const asset of assetsToExport) {
      try {
        const response = await fetch(asset.url)
        const blob = await response.blob()
        zip.file(asset.name, blob)
      } catch (err) {
        console.error(`Failed to fetch ${asset.name}`, err)
      }
    }

    const content = await zip.generateAsync({ type: "blob" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(content)
    link.download = "assets-export.zip"
    link.click()
  }

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return mb.toFixed(2) + ' MB'
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-6 w-6 text-blue-400" />
      case 'video': return <Video className="h-6 w-6 text-purple-400" />
      case 'pdf': return <FileText className="h-6 w-6 text-red-400" />
      case 'audio': return <Music className="h-6 w-6 text-amber-400" />
      default: return <Folder className="h-6 w-6 text-slate-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
          <p className="text-muted-foreground">Manage and organize your digital assets.</p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <>
              <Button variant="glass" className="gap-2 animate-in fade-in slide-in-from-right-2" onClick={handleExportZip}>
                <Download className="h-4 w-4" /> Export ZIP
              </Button>
              <Button variant="destructive" className="gap-2 animate-in fade-in slide-in-from-right-2" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4" /> Delete {selectedIds.length}
              </Button>
            </>
          )}
          <Button variant="glass" className="gap-2">
            <Folder className="h-4 w-4" /> New Folder
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-2 space-y-6">
          <FolderTree activeFolderId={activeFolderId} onFolderSelect={setActiveFolderId} />
        </div>

        <div className="md:col-span-10 space-y-6">
      <GalleryFilters viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <GlassCard className="group p-0 overflow-hidden border-white/5 hover:border-white/20 transition-all hover:translate-y-[-4px]">
                  <div className="aspect-video relative bg-white/5 flex items-center justify-center overflow-hidden">
                    {asset.thumbnail || asset.type === 'image' ? (
                      <img
                        src={asset.thumbnail || asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      getIcon(asset.type)
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="glass"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openPreview(asset)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="glass" size="icon" className="rounded-full">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm truncate pr-2">{asset.name}</h4>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{formatSize(asset.size)}</span>
                      <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {asset.tags.map(tag => (
                        <Badge key={tag} variant="glass" className="text-[10px] px-1.5 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="glass-card p-0 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredAssets.map((asset) => (
                  <motion.tr
                    key={asset.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "border-b border-white/5 hover:bg-white/2 transition-colors group",
                      selectedIds.includes(asset.id) && "bg-primary/5"
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(asset.id)}
                        onChange={() => toggleSelection(asset.id)}
                        className="rounded border-white/20 bg-white/5 cursor-pointer"
                      />
                    </td>
                    <td
                      className="px-4 py-3 flex items-center gap-3 cursor-pointer group-hover:translate-x-1 transition-transform"
                      onClick={() => openPreview(asset)}
                    >
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                        {getIcon(asset.type)}
                      </div>
                      <span className="truncate max-w-[200px] font-medium">{asset.name}</span>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">{asset.type}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatSize(asset.size)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(asset.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          onClick={() => deleteAsset(asset.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredAssets.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No assets found matching your search.
            </div>
          )}
        </div>
      )}
      </div>
      </div>

      <AssetPreviewModal
        asset={selectedAsset}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  )
}
