"use client"

import * as React from "react"
import { Checkbox as NextUICheckbox, CheckboxProps as NextUICheckboxProps } from "@nextui-org/react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<NextUICheckboxProps, 'className'> {
  className?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <NextUICheckbox
        ref={ref}
        classNames={{
          base: cn(
            "peer h-4 w-4 shrink-0 rounded-full bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[selected=true]:bg-lightpurp data-[selected=true]:text-black",
            className
          )
        }}
        radius="full"
        size="sm"
        {...props}
      />
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }