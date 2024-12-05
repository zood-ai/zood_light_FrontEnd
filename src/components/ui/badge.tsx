import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[4px] border px-2.5 py-0.5 text-xs  transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent  border-secondary-foreground bg-muted-foreground text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-primary text-primary",
        success:
          "text-foreground border-success text-primary bg-[#CBF7F2] text-success",
        danger:
          "text-foreground border-warn text-primary bg-warn-foreground text-warn",
        info: "text-foreground border-info text-primary bg-[#FFF0E0] text-info",
        warning:
          "text-foreground border-info text-primary bg-[#FFE4C4] text-info",
        dark: "text-foreground border-secandary text-primary bg-muted text-secandary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
