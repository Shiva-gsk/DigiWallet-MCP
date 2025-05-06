import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  heading: string
  text?: string
  backHref?: string
}

export function DashboardHeader({ heading, text, backHref }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-2 pb-8">
      {backHref && (
        <Button variant="ghost" size="sm" className="w-fit gap-1" asChild>
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      )}
      <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  )
}

