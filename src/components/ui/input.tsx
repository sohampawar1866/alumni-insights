import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm text-slate-900 font-medium shadow-[2px_2px_0px_#0f172a] transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-slate-900 placeholder:text-slate-400 focus:shadow-[4px_4px_0px_#0f172a] focus:bg-amber-50/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
