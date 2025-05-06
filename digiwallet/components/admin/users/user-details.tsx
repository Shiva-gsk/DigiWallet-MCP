"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge"
import { useEffect, useState, useTransition } from "react";
import { UserTypeWithWallet } from "@/types";
import { fetchUserWithWallet } from "@/app/actions/getUser";
import LoadingWidget from "../../LoadingWidget";

interface UserDetailsProps {
  userId: string;
}

export function UserDetails({ userId }: UserDetailsProps) {
  const [userDetails, setUserDetails] = useState<UserTypeWithWallet>(
    {} as UserTypeWithWallet
  );
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    setLoading(true);
    startTransition(() => {
      fetchUserWithWallet(userId).then((data) => {
        if (data) {
          setUserDetails(data);
          // setLoading(false);
          // console.log(userDetails);
          setLoading(false);
          console.log(`Fetched user details for ${userId}`);
        } else {
          // console.log(userDetails);
          console.log(`Failed to fetch user details`);
          // setError("Failed to fetch activities");
          // setLoading(false);
        }
      });
    });
  }, [userId]);
  // In a real app, you would fetch user data based on userId
  // const user = {
  //   id: userId,
  //   name: "Alex Johnson",
  //   email: "alex@example.com",
  //   phone: "+1 (555) 123-4567",
  //   status: "active",
  //   walletBalance: "$2,450.50",
  //   joinDate: "March 15, 2023",
  //   lastActive: "2 mins ago",
  //   kycVerified: true,
  //   address: "123 Main St, New York, NY 10001",
  // }

  return (
    <>
      {loading || isPending || !userDetails ? <LoadingWidget /> : <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={`/placeholder.svg?height=80&width=80`}
                alt={"X"}
                />
              <AvatarFallback className="text-lg">
                {userDetails.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 gap-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{userDetails.name}</h2>
                {/* <Badge
                variant={
                  user.status === "active" ? "success" : user.status === "inactive" ? "secondary" : "destructive"
                  }
                  >
                  {user.status}
                  </Badge> */}
                {/* {user.kycVerified && (
                <Badge variant="outline" className="ml-2">
                KYC Verified
                </Badge>
                )} */}
              </div>

              <div className="text-muted-foreground">{userDetails.email}</div>
              <div className="text-muted-foreground">
                {userDetails.phoneNum}
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <div className="flex flex-col items-start md:items-end">
                <span className="text-sm text-muted-foreground">
                  Wallet Balance
                </span>
                <span className="text-2xl font-bold">
                  {userDetails.user_wallet?.balance}
                </span>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <span className="text-sm text-muted-foreground">
                  Member Since
                </span>
                <span>{userDetails.createdAt.toDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  }
    </>
  // <>Hi</>
  );
}
