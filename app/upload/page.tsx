"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, File, CheckCircle2, Loader2 } from "lucide-react"
import { GlassCard } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDAMStore } from "@/lib/store"
import { AssetType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface UploadingFile {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
}

export default function UploadPage() {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const { addAsset } = useDAMStore()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading' as const
    }))

    setUploadingFiles(prev => [...newFiles, ...prev])

    // Simulate upload for each file
    newFiles.forEach(item => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)

          // Add to store when done
          const assetTypeRaw = item.file.type.split('/')[0]
          const assetType = ['image', 'video', 'audio', 'pdf'].includes(assetTypeRaw) ? assetTypeRaw as AssetType : (item.file.type.includes('pdf') ? 'pdf' : 'other')

          addAsset({
            id: item.id,
            name: item.file.name,
            type: ['image', 'video', 'audio', 'pdf'].includes(assetType) ? assetType : (item.file.type.includes('pdf') ? 'pdf' : 'other'),
            size: item.file.size,
            url: URL.createObjectURL(item.file), // Mock URL
            tags: ['new-upload'],
            folderId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            versions: [],
            metadata: { mimeType: item.file.type }
          })

          setUploadingFiles(prev =>
            prev.map(f => f.id === item.id ? { ...f, progress: 100, status: 'completed' } : f)
          )
        } else {
          setUploadingFiles(prev =>
            prev.map(f => f.id === item.id ? { ...f, progress } : f)
          )
        }
      }, 400)
    })
  }, [addAsset])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Assets</h2>
        <p className="text-muted-foreground">Drag and drop files to add them to your digital library.</p>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div {...getRootProps()}>
        <GlassCard
          className={cn(
            "border-2 border-dashed transition-all cursor-pointer h-80 flex flex-col items-center justify-center gap-6 relative overflow-hidden group",
            isDragActive ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-white/20"
          )}
        >
          <input {...getInputProps()} />

          {/* Liquid background effect on drag */}
          <AnimatePresence>
            {isDragActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 z-0"
              >
                <div className="absolute inset-0 bg-blue-500/20 animate-pulse" />
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(59,130,246,0.2)_0%,transparent_70%)]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10 flex flex-col items-center gap-6">
            <motion.div
              animate={isDragActive ? { y: [0, -10, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="p-6 bg-blue-500/20 rounded-3xl shadow-2xl shadow-blue-500/20 border border-white/10"
            >
              <Upload className={cn("h-12 w-12 transition-colors", isDragActive ? "text-blue-400" : "text-primary")} />
            </motion.div>

            <div className="text-center">
              <p className="text-2xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                {isDragActive ? "Release to start" : "Ready to expand your library?"}
              </p>
              <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                Drag and drop your files anywhere on this card to begin the secure upload process.
              </p>
            </div>

            {!isDragActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 mt-2"
              >
                <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/5 border border-white/5">Images</span>
                <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/5 border border-white/5">Videos</span>
                <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/5 border border-white/5">Documents</span>
              </motion.div>
            )}
          </div>

          {/* Decorative corner accents */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/10 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/10 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/10 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/10 rounded-br-lg" />
        </GlassCard>
        </div>
      </motion.div>

      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          Upload Queue
          {uploadingFiles.length > 0 && (
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-normal">
              {uploadingFiles.length}
            </span>
          )}
        </h3>

        <div className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {uploadingFiles.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
              >
                <GlassCard className="p-4 flex items-center gap-4 group">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <File className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{item.file.name}</p>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {(item.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          item.status === 'completed' ? "bg-emerald-500" : "bg-primary"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'uploading' && (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    )}
                    {item.status === 'completed' && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>

          {uploadingFiles.length === 0 && (
            <div className="text-center py-12 border border-white/5 rounded-2xl bg-white/2">
              <p className="text-sm text-muted-foreground">No active uploads</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
