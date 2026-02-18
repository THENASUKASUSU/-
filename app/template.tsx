"use client"

import { motion } from "framer-motion"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  )
}
