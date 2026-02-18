"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  X,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Edit3,
  History,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Asset } from "@/lib/types"
import { ShareLinkGenerator } from "./share-link-generator"
import { useDAMStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface AssetPreviewModalProps {
  asset: Asset | null
  isOpen: boolean
  onClose: () => void
}

export function AssetPreviewModal({ asset, isOpen, onClose }: AssetPreviewModalProps) {
  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [showShare, setShowShare] = React.useState(false)
  const [showHistory, setShowHistory] = React.useState(false)
  const { restoreVersion } = useDAMStore()

  if (!asset) return null

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl h-full flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between text-white">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold truncate max-w-[300px] md:max-w-md">
                  {asset.name}
                </h3>
                <p className="text-sm text-white/60">
                  {asset.type.toUpperCase()} • {(asset.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="glass" size="icon" onClick={handleRotate}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="glass" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="glass" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                {asset.type === 'image' && (
                  <Link href={`/assets/${asset.id}/edit`}>
                    <Button variant="glass" size="icon">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Button variant="glass" size="icon" onClick={() => setShowHistory(!showHistory)} className={cn(showHistory && "bg-primary/20")}>
                  <History className="h-4 w-4" />
                </Button>
                <Button variant="glass" size="icon" onClick={() => setShowShare(!showShare)} className={cn(showShare && "bg-primary/20")}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="glass" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="glass" size="icon" onClick={onClose} className="bg-red-500/20 hover:bg-red-500/40">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex gap-4 overflow-hidden h-full">
            <div className="flex-1 glass-card p-0 bg-white/5 border-white/10 overflow-hidden flex items-center justify-center relative">
              <motion.div
                style={{
                  scale: zoom,
                  rotate: rotation,
                  willChange: 'transform'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full h-full flex items-center justify-center"
              >
                {asset.type === 'image' && (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="max-w-full max-h-full object-contain shadow-2xl"
                  />
                )}
                {asset.type === 'video' && (
                  <video
                    src={asset.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-full shadow-2xl"
                  />
                )}
                {asset.type === 'pdf' && (
                  <div className="w-full h-full bg-white flex flex-col items-center overflow-auto p-4">
                     {/* Simplified PDF View */}
                     <iframe src={asset.url} className="w-full h-full border-none" title={asset.name} />
                  </div>
                )}
                {asset.type === 'other' && (
                   <div className="text-center">
                     <p className="text-white/60 mb-4">Preview not available for this file type</p>
                     <Button variant="glass">Download to View</Button>
                   </div>
                )}
              </motion.div>

              {/* Navigation Arrows */}
              <Button variant="glass" size="icon" className="absolute left-4 rounded-full h-12 w-12 opacity-40 hover:opacity-100">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button variant="glass" size="icon" className="absolute right-4 rounded-full h-12 w-12 opacity-40 hover:opacity-100">
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            <AnimatePresence>
              {(showShare || showHistory) && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  className="w-80 flex flex-col gap-4"
                >
                  {showShare && (
                    <GlassCard className="flex-1 p-6">
                      <ShareLinkGenerator assetName={asset.name} />
                    </GlassCard>
                  )}
                  {showHistory && (
                    <GlassCard className="flex-1 p-6 overflow-hidden flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Version History</h4>
                        <Badge variant="glass">{asset.versions.length + 1} Versions</Badge>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                           <div className="flex justify-between items-start mb-1">
                             <span className="text-xs font-bold">v{asset.versions.length + 1} (Current)</span>
                             <span className="text-[10px] text-muted-foreground">Now</span>
                           </div>
                           <p className="text-[10px] text-muted-foreground">Original upload</p>
                        </div>
                        {asset.versions.map((v) => (
                          <div key={v.id} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 group">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-xs font-bold">v{v.version}</span>
                              <span className="text-[10px] text-muted-foreground">{new Date(v.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] text-muted-foreground">{(v.size/1024/1024).toFixed(2)} MB</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => restoreVersion(asset.id, v.id)}
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            </div>

            {/* Info Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlassCard className="p-3 bg-white/5">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Dimensions</p>
                <p className="text-sm text-white">{asset.metadata.width || 'N/A'} x {asset.metadata.height || 'N/A'}</p>
              </GlassCard>
              <GlassCard className="p-3 bg-white/5">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">MIME Type</p>
                <p className="text-sm text-white">{asset.metadata.mimeType}</p>
              </GlassCard>
              <GlassCard className="p-3 bg-white/5">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Created</p>
                <p className="text-sm text-white">{new Date(asset.createdAt).toLocaleString()}</p>
              </GlassCard>
              <GlassCard className="p-3 bg-white/5">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Tags</p>
                <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                  {asset.tags.map(t => <span key={t} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded">#{t}</span>)}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
