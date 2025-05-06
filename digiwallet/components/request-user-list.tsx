"use client"

import type { UserType } from "@/types"
import { Card, CardContent } from "@/components/ui/card_ui"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface UserListProps {
  users: UserType[]
  onSendMoney: (user: UserType) => void
}

export function UserList({ users, onSendMoney }: UserListProps) {
  return (
    <div className="space-y-3">
      
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Avatar className="mr-4 h-10 w-10">
                {/* <AvatarImage src={(user.avatar)} alt={user.name} /> */}
                <AvatarFallback>{(user.name)?user.name:"-".charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button size="sm" onClick={() => onSendMoney(user)}>
              Send Request
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

