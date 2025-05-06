"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface ChartContainerProps {
  title: string
  description?: string
  children: ReactNode
}

export function ChartContainer({ title, description, children }: ChartContainerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">{children}</div>
      </CardContent>
    </Card>
  )
}

