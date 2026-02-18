"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, File, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
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

      <GlassCard
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed transition-all cursor-pointer h-64 flex flex-col items-center justify-center gap-4",
          isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-white/10 hover:border-white/20"
        )}
      >
        <input {...getInputProps()} />
        <div className="p-4 bg-primary/10 rounded-full">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">
            {isDragActive ? "Drop files here" : "Click or drag files to upload"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Supports Images, Videos, PDFs and Audio files
          </p>
        </div>
      </GlassCard>

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
