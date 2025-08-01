"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
}

export const Main = React.forwardRef<HTMLElement, MainProps>(
  ({ fixed, className, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          'peer-[.header-fixed]/header:mt-16',
          'px-4 py-6',
          fixed && 'fixed-main flex grow flex-col overflow-hidden',
          className
        )}
        {...props}
      />
    )
  }
)

Main.displayName = 'Main'