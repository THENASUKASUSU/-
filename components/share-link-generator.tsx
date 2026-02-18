"use client"

import { useState } from "react"
import { Copy, Check, Clock, Globe, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassInput } from "@/components/ui/input"
import { GlassCard } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ShareLinkGenerator({ assetName }: { assetName: string }) {
  const [copied, setCopied] = useState(false)
  const [expiry, setExpiry] = useState("24h")

  const shareUrl = `https://dam.jules.dev/share/a7f3k9m2`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h4 className="font-semibold text-lg">Share &quot;{assetName}&quot;</h4>
        <p className="text-sm text-muted-foreground">Generate a secure temporary link to share this asset.</p>
      </div>

      <div className="flex gap-2">
        <GlassInput value={shareUrl} readOnly className="flex-1" />
        <Button variant="glass" onClick={copyToClipboard} className="shrink-0">
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase font-bold text-white/40">Link Expiry</Label>
          <Select value={expiry} onValueChange={setExpiry}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select expiry" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white">
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 flex flex-col justify-end">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
            <Label htmlFor="password-protect" className="text-xs cursor-pointer">Password Protected</Label>
            <Switch id="password-protect" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
         <GlassCard className="flex-1 p-3 bg-white/5 flex flex-col items-center gap-2 text-center">
            <Globe className="h-4 w-4 text-blue-400" />
            <span className="text-[10px]">Public Access</span>
         </GlassCard>
         <GlassCard className="flex-1 p-3 bg-white/5 flex flex-col items-center gap-2 text-center">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px]">Secure View</span>
         </GlassCard>
         <GlassCard className="flex-1 p-3 bg-white/5 flex flex-col items-center gap-2 text-center">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="text-[10px]">Expiring Link</span>
         </GlassCard>
      </div>
    </div>
  )
}
