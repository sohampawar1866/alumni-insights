import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border-2 border-foreground bg-clip-padding text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-transform outline-none select-none focus-visible:ring-3 focus-visible:ring-ring active:translate-y-1 active:translate-x-1 active:shadow-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-foreground shadow-[4px_4px_0px_var(--color-foreground)] hover:bg-primary/90",
        outline:
          "bg-background text-foreground shadow-[4px_4px_0px_var(--color-foreground)] hover:bg-muted",
        secondary:
          "bg-secondary text-foreground shadow-[4px_4px_0px_var(--color-foreground)] hover:bg-secondary/90",
        ghost:
          "border-transparent hover:bg-muted hover:border-foreground hover:shadow-[4px_4px_0px_var(--color-foreground)]",
        destructive:
          "bg-destructive text-white shadow-[4px_4px_0px_var(--color-foreground)] hover:bg-destructive/90",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        xs: "h-8 px-3 text-xs",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
        "icon-xs": "h-8 w-8",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
