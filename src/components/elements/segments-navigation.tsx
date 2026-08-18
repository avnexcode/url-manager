import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { renderElements } from '@/utils'
import { Link, useLocation } from '@tanstack/react-router'
import React from 'react'
import * as m from '@/generated/paraglide/messages'

const toSnakeCase = (segment: string): string => {
  return segment.replace(/-/g, '_')
}

const formatSegment = (segment: string): string => {
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export const SegmentsNavigation = () => {
  const pathname = useLocation({ select: (location) => location.pathname })
  const segments = pathname.split('/').filter(Boolean)

  const isDynamicId = (value: string): boolean => {
    const patterns = [
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      /^[A-Za-z0-9_-]{20,}$/,
      /^c[0-9a-z]{24}$/,
      /^[0-9A-HJKMNP-TV-Z]{20,30}$/,
    ]

    return patterns.some((re) => re.test(value))
  }

  const staticSegments = segments.filter((s) => {
    return !s.startsWith('[') && !isDynamicId(s)
  })

  const getLabel = (segment: string): string => {
    const key =
      `component_navbar_item_${toSnakeCase(segment)}` as keyof typeof m
    const messageFn = m[key]
    return typeof messageFn === 'function'
      ? (messageFn as () => string)()
      : formatSegment(segment)
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {renderElements({
          of: staticSegments,
          render: (segment, index) => {
            const href = '/' + staticSegments.slice(0, index + 1).join('/')
            const isLast = index === staticSegments.length - 1
            const label = getLabel(segment)
            return (
              <React.Fragment key={href}>
                {index !== 0 ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={href}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          },
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
