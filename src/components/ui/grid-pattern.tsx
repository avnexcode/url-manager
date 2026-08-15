'use client'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface GridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  squares?: [number, number][]
  strokeDasharray?: string
  className?: string
  [key: string]: any
}

export const GridPattern = ({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = '0',
  squares,
  className,
  ...props
}: GridPatternProps) => {
  const id = React.useId()

  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30',
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          height={height}
          id={id}
          patternUnits="userSpaceOnUse"
          width={width}
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect fill={`url(#${id})`} height="100%" strokeWidth={0} width="100%" />
      {squares && (
        <svg
          aria-label="Grid squares"
          className="overflow-visible"
          role="img"
          x={x}
          y={y}
        >
          {squares.map(([squareX, squareY], index) => (
            <rect
              height={height - 1}
              key={`${squareX}-${squareY}-${index}`}
              strokeWidth="0"
              width={width - 1}
              x={squareX * width + 1}
              y={squareY * height + 1}
            />
          ))}
        </svg>
      )}
    </svg>
  )
}
