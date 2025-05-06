"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for recent users
const recentUsers = [
  {
    id: "u_1",
    name: "Alex Johnson",
    email: "alex@example.com",
    joined: "2 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "u_2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    joined: "5 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "u_3",
    name: "Michael Brown",
    email: "michael@example.com",
    joined: "1 day ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "u_4",
    name: "Emily Davis",
    email: "emily@example.com",
    joined: "2 days ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export function RecentUsers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>New users who recently joined the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="text-sm text-muted-foreground">{user.joined}</div>
            </div>
          ))}
          <Button asChild variant="outline" className="w-full mt-2">
            <Link href="/dashboard">View all users</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

