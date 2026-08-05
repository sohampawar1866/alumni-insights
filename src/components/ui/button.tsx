import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-clip-padding text-sm font-bold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-[2px] active:translate-x-[2px] active:shadow-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[5px_5px_0px_#0f172a] hover:bg-slate-800",
        outline:
          "bg-white text-slate-900 shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[5px_5px_0px_#0f172a] hover:bg-slate-50",
        secondary:
          "bg-amber-400 text-slate-900 shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[5px_5px_0px_#0f172a] hover:bg-amber-500",
        accent:
          "bg-emerald-500 text-white shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[5px_5px_0px_#0f172a] hover:bg-emerald-600",
        ghost:
          "border-transparent text-slate-800 hover:bg-slate-100 hover:border-slate-900 hover:shadow-[3px_3px_0px_#0f172a]",
        destructive:
          "bg-red-500 text-white shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[5px_5px_0px_#0f172a] hover:bg-red-600",
        link: "border-transparent text-blue-600 underline-offset-4 hover:underline font-semibold",
      },
      size: {
        default: "h-11 px-5 py-2 text-sm",
        xs: "h-7 px-3 text-xs rounded-md border",
        sm: "h-9 px-3.5 text-xs rounded-lg",
        lg: "h-13 px-7 text-base rounded-xl",
        icon: "h-11 w-11",
        "icon-xs": "h-7 w-7 rounded-md border",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-13 w-13 rounded-xl",
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
