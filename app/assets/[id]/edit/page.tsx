"use client"

import { useState, useCallback, use } from "react"
import Cropper, { Area } from "react-easy-crop"
import { Save, RotateCw, ArrowLeft, Crop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/card"
import { useDAMStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { id } = resolvedParams
  const router = useRouter()
  const { assets, updateAsset, addVersion } = useDAMStore()
  const asset = assets.find(a => a.id === id)

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  if (!asset) return <div>Asset not found</div>
  if (asset.type !== 'image') return <div>Only images can be cropped</div>

  const handleSave = async () => {
    // In a real app, we would perform the crop on a canvas or server
    const newVersion = {
      id: Math.random().toString(36).substr(2, 9),
      version: asset.versions.length + 2,
      url: asset.url,
      createdAt: new Date().toISOString(),
      size: asset.size * 0.8
    }

    addVersion(asset.id, newVersion)
    updateAsset(asset.id, {
      url: newVersion.url,
      size: newVersion.size
    })

    router.push('/gallery')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/gallery">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit Image</h2>
            <p className="text-sm text-muted-foreground">{asset.name}</p>
          </div>
        </div>
        <Button className="gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" /> Save as New Version
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <GlassCard className="h-[600px] relative overflow-hidden p-0 border-white/10">
            <Cropper
              image={asset.url}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={16 / 9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
            />
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Crop className="h-4 w-4" /> Controls
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Zoom</label>
                  <span>{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Rotation</label>
                  <span>{rotation}°</span>
                </div>
                <div className="flex gap-2">
                   <Button variant="glass" className="flex-1" onClick={() => setRotation(r => (r + 90) % 360)}>
                     <RotateCw className="h-4 w-4 mr-2" /> +90°
                   </Button>
                   <Button variant="glass" className="flex-1" onClick={() => setRotation(0)}>
                     Reset
                   </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-muted-foreground mb-4">
                  Adjust the image using the controls above. Saving will create a new entry in the version history.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-white/40">Current Dimensions</p>
                  <p className="text-sm">{asset.metadata.width} x {asset.metadata.height} px</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
