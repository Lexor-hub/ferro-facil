import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-badge text-badge-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-badge-destructive text-badge-destructive-foreground",
        success:
          "border-transparent bg-badge-success text-badge-success-foreground",
        warning:
          "border-transparent bg-badge-warning text-badge-warning-foreground",
        outline: "text-foreground",
        premium:
          "border-transparent bg-gradient-to-r from-[#fce9c0] via-[#f5c26b] to-[#fce9c0] text-slate-900 font-semibold shadow-[0_12px_25px_rgba(250,210,120,0.45)] backdrop-blur",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
