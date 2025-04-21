"use client"

import { cn } from "@/src/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps, ReactNode } from "react"

export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className="bg-white text-primary flex justify-center px-4 ">
      {children}
    </nav>
  )
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname()
  const isActive = pathname === props.href

  return (
    <Link
      {...props}
      className={cn(
        "relative p-4 pb-3 transition-colors duration-200",

        // underline animation styles
        "after:content-[''] after:absolute after:left-4 after:right-4 after:bottom-2 after:h-0.5 after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-300",
        "hover:after:scale-x-100 focus-visible:after:scale-x-100",

        // active state
        isActive && "text-foreground after:scale-x-100"
      )}
    />
  )
}
