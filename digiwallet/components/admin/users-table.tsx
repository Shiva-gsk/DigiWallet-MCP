"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowUpDown, MoreHorizontal, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge"
import { UserTypeWithWallet } from "@/types";
import { fetchAllUsersWithWallet } from "@/app/actions/getUser";
import { useUser } from "@clerk/nextjs";
import LoadingWidget from "../LoadingWidget";

// // Mock data for users
// const users = [
//   {
//     id: "u_1",
//     name: "Alex Johnson",
//     email: "alex@example.com",
//     status: "active",
//     walletBalance: "$2,450.50",
//     lastActive: "2 mins ago",
//   },
//   {
//     id: "u_2",
//     name: "Sarah Williams",
//     email: "sarah@example.com",
//     status: "active",
//     walletBalance: "$1,890.75",
//     lastActive: "1 hour ago",
//   },
//   {
//     id: "u_3",
//     name: "Michael Brown",
//     email: "michael@example.com",
//     status: "inactive",
//     walletBalance: "$750.25",
//     lastActive: "2 days ago",
//   },
//   {
//     id: "u_4",
//     name: "Emily Davis",
//     email: "emily@example.com",
//     status: "active",
//     walletBalance: "$3,200.00",
//     lastActive: "5 mins ago",
//   },
//   {
//     id: "u_5",
//     name: "David Wilson",
//     email: "david@example.com",
//     status: "suspended",
//     walletBalance: "$0.00",
//     lastActive: "1 month ago",
//   },
// ]

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<UserTypeWithWallet[]>([]);
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    // setLoading(true);
    startTransition(() => {
      fetchAllUsersWithWallet().then((data) => {
        console.log(data);
        if (data && user) {
          setUsers(
            data.filter((u) => u.email !== user.emailAddresses[0].emailAddress)
          );
        }
      });
    });
  }, [user]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    //TODO
    // const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesStatus = statusFilter === "all";
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {isPending && filteredUsers ? (
        <LoadingWidget />
      ) : (
        <Card>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="h-9 w-[250px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[130px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium flex items-center gap-1"
                  >
                    Name
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Email</TableHead>
                {/* <TableHead>Status</TableHead> */}
                <TableHead>Wallet Balance</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="hover:underline"
                      >
                        {user.name}
                      </Link>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    {user.user_wallet && (
                      <>
                        {" "}
                        <TableCell>{user.user_wallet.balance}</TableCell>
                        <TableCell>
                          {user.user_wallet.updatedAt.toDateString()}
                        </TableCell>
                      </>
                    )}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/users/${user.id}`}>
                              View details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit user</DropdownMenuItem>
                          {user.email !== "suspended" ? (
                            <DropdownMenuItem className="text-destructive">
                              Suspend user
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>Reactivate user</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  );
}
