"use client";

import { useState, useEffect, useTransition } from "react";
import { ArrowLeft, Search, UserIcon, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserList } from "@/components/user-list";
import { SendMoneyModal } from "@/components/send-money-model";
import { fetchAllUsers } from "@/app/actions/getUser";
import { useUser } from "@clerk/nextjs";
// import Loading from "@/components/loading";
import  SkeletonDemo  from "./loading";
import { UserType } from "@/types";

export default function SendMoneyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const { user } = useUser();
  // const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    // setLoading(true);
    startTransition(() => {
      fetchAllUsers()
        .then((data) => {
          console.log(data);
          if (data && user) {
            setUsers(data.filter((u) => u.email !== user.emailAddresses[0].emailAddress));
          }
        });
    });
  }, [user]);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMoney = (user: UserType | null) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Send Money</h1>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {searchQuery && filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <UserIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-1 text-xl font-semibold">No users found</h2>
          <p className="text-center text-muted-foreground">
            Try searching with a different name or email
          </p>
        </div>
      ) : isPending ? (
        <SkeletonDemo />
      ) : (
        <UserList users={filteredUsers} onSendMoney={handleSendMoney} />
      )}

      {showModal && selectedUser && (
        <SendMoneyModal user={selectedUser} onClose={handleCloseModal} />
      )}

      {/* <Card className="mt-8">
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent Recipients</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {recentRecipients.map((recipient) => (
              <div key={recipient.id} className="flex flex-col items-center">
                <Avatar
                  className="h-14 w-14 cursor-pointer"
                  onClick={() => handleSendMoney(recipient)}
                >
                  <AvatarImage src={recipient.avatar} alt={recipient.name} />
                  <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="mt-2 text-sm font-medium">
                  {recipient.name.split(" ")[0]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}

// export interface UserType {
//   name: string | null;
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   email: string;
//   username: string;
//   password: string | null;
//   phoneNum: string | null;
//   is_admin: "USER" | "ADMIN";
//   wallet_id: string | null;
// }

// const users: UserType[] = [
//   {
//     id: 1,
//     name: "John Doe",
//     email: "john.doe@example.com",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     email: "jane.smith@example.com",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 3,
//     name: "Mike Johnson",
//     email: "mike.johnson@example.com",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 4,
//     name: "Sarah Williams",
//     email: "sarah.williams@example.com",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 5,
//     name: "David Brown",
//     email: "david.brown@example.com",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 6,
//     name: "Emily Davis",
//     email: "emily.davis@example.com",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 7,
//     name: "Alex Wilson",
//     email: "alex.wilson@example.com",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
// ]

// const recentRecipients = [
//   {
//     id: 2,
//     name: "Jane Smith",
//     email: "jane.smith@example.com",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 3,
//     name: "Mike Johnson",
//     email: "mike.johnson@example.com",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 5,
//     name: "David Brown",
//     email: "david.brown@example.com",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 1,
//     name: "John Doe",
//     email: "john.doe@example.com",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
// ];

// // Removed the local useEffect declaration to avoid conflict with the imported useEffect
