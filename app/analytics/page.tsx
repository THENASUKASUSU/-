"use client"

import { GlassCard } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { ArrowUpRight, ArrowDownRight, Users, Download, Eye, Zap } from "lucide-react"

const activityData = [
  { name: 'Mon', views: 400, downloads: 240 },
  { name: 'Tue', views: 300, downloads: 139 },
  { name: 'Wed', views: 200, downloads: 980 },
  { name: 'Thu', views: 278, downloads: 390 },
  { name: 'Fri', views: 189, downloads: 480 },
  { name: 'Sat', views: 239, downloads: 380 },
  { name: 'Sun', views: 349, downloads: 430 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Detailed reports of your asset performance and usage.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Views", value: "12,482", change: "+12.5%", icon: Eye, color: "text-blue-500" },
          { label: "Downloads", value: "3,105", change: "+8.2%", icon: Download, color: "text-emerald-500" },
          { label: "Active Shares", value: "48", change: "-2.4%", icon: Zap, color: "text-amber-500" },
          { label: "Unique Visitors", value: "1,892", change: "+5.1%", icon: Users, color: "text-purple-500" },
        ].map((stat, i) => (
          <GlassCard key={i}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <div className={`flex items-center text-xs font-medium ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.change}
                {stat.change.startsWith('+') ? <ArrowUpRight className="h-3 w-3 ml-1" /> : <ArrowDownRight className="h-3 w-3 ml-1" />}
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <GlassCard className="h-[450px]">
          <h3 className="font-semibold mb-6">Engagement Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                 contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
              <Area type="monotone" dataKey="downloads" stroke="#10b981" fillOpacity={1} fill="url(#colorDownloads)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  )
}
