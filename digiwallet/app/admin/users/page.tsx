"use client"
import { UsersTable } from "@/components/admin/users-table"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DashboardShell } from "@/components/admin/dashboard-shell"
import { fetchUserbyEmail } from "@/app/actions/getUser"
import { useUser } from "@clerk/nextjs"
// import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LoadingWidget from "@/components/LoadingWidget"
export default function UsersPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    fetchUserbyEmail(user.emailAddresses[0].emailAddress).then((data)=>{
      if (data) {
        setIsAdmin(data.role === "ADMIN" ? true : false);
        setIsLoading(false);
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    })
    

  }, [user]);
  return (
    <>
      {(isLoading) ? (
        <LoadingWidget />
      ) : (isAdmin) ? (
        <DashboardShell>
          <DashboardHeader heading="Users" text="Manage all users and their digital wallets." />
          <UsersTable />
        </DashboardShell>
      ) : (
        <div className="text-destructive">No access</div>
      )}
    </>
  )
}

