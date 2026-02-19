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
  Video,
  BarChart3
} from "lucide-react"

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
}

export default function DashboardPage() {
  const { assets } = useDAMStore()

  const totalSize = assets.reduce((acc, curr) => acc + curr.size, 0)
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const typeData = [
    { name: 'Images', value: assets.filter(a => a.type === 'image').length },
    { name: 'Videos', value: assets.filter(a => a.type === 'video').length },
    { name: 'PDFs', value: assets.filter(a => a.type === 'pdf').length },
    { name: 'Other', value: assets.filter(a => a.type === 'other' || a.type === 'audio').length },
  ]

  const storageData = [
    { name: 'Used', value: totalSize / (1024 * 1024) }, // in MB
    { name: 'Free', value: Math.max(0, 2048 - (totalSize / (1024 * 1024))) }, // Assume 2GB total
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item}>
        <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
          System Overview
        </h2>
        <p className="text-muted-foreground text-lg">Managing {assets.length} assets across your secure cloud.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <GlassCard className="flex flex-row items-center gap-5 hover:bg-white/5 transition-colors">
            <div className="p-4 bg-blue-500/20 rounded-2xl shadow-lg shadow-blue-500/10">
              <Files className="h-7 w-7 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Assets</p>
              <p className="text-3xl font-bold">{assets.length}</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="flex flex-row items-center gap-5 hover:bg-white/5 transition-colors">
            <div className="p-4 bg-emerald-500/20 rounded-2xl shadow-lg shadow-emerald-500/10">
              <HardDrive className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Storage Used</p>
              <p className="text-3xl font-bold">{formatSize(totalSize)}</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="flex flex-row items-center gap-5 hover:bg-white/5 transition-colors">
            <div className="p-4 bg-amber-500/20 rounded-2xl shadow-lg shadow-amber-500/10">
              <ImageIcon className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Image Files</p>
              <p className="text-3xl font-bold">{assets.filter(a => a.type === 'image').length}</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="flex flex-row items-center gap-5 hover:bg-white/5 transition-colors">
            <div className="p-4 bg-purple-500/20 rounded-2xl shadow-lg shadow-purple-500/10">
              <Video className="h-7 w-7 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Video Clips</p>
              <p className="text-3xl font-bold">{assets.filter(a => a.type === 'video').length}</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        <motion.div variants={item} className="lg:col-span-8">
          <GlassCard className="h-[450px]">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Asset Distribution
            </h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                  />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-4">
          <GlassCard className="h-[450px] flex flex-col">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              Capacity
            </h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={storageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {storageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(16px)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-4">
              {storageData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-muted-foreground font-medium">{entry.name}</span>
                  </div>
                  <span className="font-mono font-bold">{entry.value.toFixed(1)} MB</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div variants={item} className="grid gap-6 md:grid-cols-3">
        <GlassCard className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 group cursor-pointer overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Files className="h-32 w-32" />
          </div>
          <h4 className="text-lg font-bold mb-2">Recent Assets</h4>
          <p className="text-sm text-muted-foreground mb-4">Quick access to your most recently uploaded files.</p>
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                {i}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px]">
              +5
            </div>
          </div>
        </GlassCard>

        <GlassCard className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 group cursor-pointer overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Video className="h-32 w-32" />
          </div>
          <h4 className="text-lg font-bold mb-2">Media Processing</h4>
          <p className="text-sm text-muted-foreground mb-4">All systems operational. 2 videos currently encoding.</p>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              className="h-full bg-purple-500"
            />
          </div>
        </GlassCard>

        <GlassCard className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20 group cursor-pointer overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <HardDrive className="h-32 w-32" />
          </div>
          <h4 className="text-lg font-bold mb-2">Shared Links</h4>
          <p className="text-sm text-muted-foreground mb-4">You have 12 active sharing links. 3 expire today.</p>
          <button className="text-xs font-bold text-emerald-400 hover:underline">View All Links</button>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
