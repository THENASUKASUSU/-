"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Upload, FolderPlus, Link as LinkIcon, Share2, X } from "lucide-react"
import Link from "next/link"
import { MagneticButton } from "./ui/magnetic-button"

const actions = [
  { icon: Upload, label: "Upload File", href: "/upload", color: "bg-blue-500" },
  { icon: FolderPlus, label: "New Folder", href: "#", color: "bg-emerald-500" },
  { icon: LinkIcon, label: "Short Link", href: "#", color: "bg-purple-500" },
  { icon: Share2, label: "Collaborate", href: "#", color: "bg-amber-500" },
]

export function QuickActionMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-20 right-0 space-y-4">
            {actions.map((action, idx) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: (actions.length - 1 - idx) * 0.05 }}
                className="flex items-center gap-4 justify-end group"
              >
                <span className="glass-card py-1 px-3 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.label}
                </span>
                <Link href={action.href} onClick={() => setIsOpen(false)}>
                  <div className={`p-4 rounded-2xl shadow-xl border border-white/10 backdrop-blur-xl ${action.color}/20 hover:${action.color}/40 transition-colors cursor-pointer`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <MagneticButton
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 rounded-3xl bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-white/20 relative overflow-hidden group h-auto w-auto"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative z-10"
        >
          {isOpen ? <X className="h-8 w-8 text-white" /> : <Plus className="h-8 w-8 text-white" />}
        </motion.div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </MagneticButton>
    </div>
  )
}
