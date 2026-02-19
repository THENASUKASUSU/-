import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from "framer-motion"

const GlassCard = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & { tilt?: boolean }
>(({ className, tilt = true, children, ...props }, ref) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 })
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"])

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!tilt) return
    const rect = event.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXPos = event.clientX - rect.left
    const mouseYPos = event.clientY - rect.top
    const xPct = mouseXPos / width - 0.5
    const yPct = mouseYPos / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      style={tilt ? {
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      } : {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "glass-card rounded-2xl p-6 transition-colors duration-500",
        className
      )}
      {...props}
    >
      <div style={tilt ? { transform: "translateZ(20px)" } : {}}>
        {children as React.ReactNode}
      </div>
    </motion.div>
  )
})
GlassCard.displayName = "GlassCard"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, GlassCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
