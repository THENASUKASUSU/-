"use client"

import { useDAMStore } from "@/lib/store"
import { GlassCard } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import {
  Files,
  HardDrive,
  Image as ImageIcon,
  Video
} from "lucide-react"
import { formatSize } from "@/lib/utils"

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DashboardPage() {
  const { assets } = useDAMStore()

  const totalSize = assets.reduce((acc, curr) => acc + curr.size, 0)

  const typeData = [
    { name: 'Images', value: assets.filter(a => a.type === 'image').length },
    { name: 'Videos', value: assets.filter(a => a.type === 'video').length },
    { name: 'PDFs', value: assets.filter(a => a.type === 'pdf').length },
    { name: 'Other', value: assets.filter(a => a.type === 'other' || a.type === 'audio').length },
  ]

  const storageData = [
    { name: 'Used', value: totalSize / (1024 * 1024) }, // in MB
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your assets.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="flex flex-row items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Files className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Assets</p>
            <p className="text-2xl font-bold">{assets.length}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-row items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <HardDrive className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Storage Used</p>
            <p className="text-2xl font-bold">{formatSize(totalSize)}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-row items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <ImageIcon className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Images</p>
            <p className="text-2xl font-bold">{assets.filter(a => a.type === 'image').length}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-row items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Video className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Videos</p>
            <p className="text-2xl font-bold">{assets.filter(a => a.type === 'video').length}</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <GlassCard className="lg:col-span-4 h-[400px]">
          <h3 className="font-semibold mb-6">Asset Distribution by Type</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="lg:col-span-3 h-[400px] flex flex-col">
          <h3 className="font-semibold mb-6">Storage Usage (MB)</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                {storageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Used: {formatSize(totalSize)}</span>
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-semibold">
              Unlimited Capacity
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
