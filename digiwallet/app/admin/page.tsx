"use client"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DashboardShell } from "@/components/admin/dashboard-shell"
import { AnalyticsCards } from "@/components/admin/analytics-cards"
import { TransactionChart } from "@/components/admin/transaction-chart"
// import { UserActivityChart } from "@/components/admin/user-activity-chart"
import { TransactionTypeChart } from "@/components/admin/transaction-type-chart"
// import { RecentUsers } from "@/components/admin/recent-users"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { fetchUserbyEmail } from "@/app/actions/getUser"
import LoadingWidget from "@/components/LoadingWidget"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    fetchUserbyEmail(user.emailAddresses[0].emailAddress).then((data)=>{
      if (data) {
        setIsAdmin(data.role === "ADMIN" ? true : false);
        if(data.role !== "ADMIN") {
          toast.error("You need to be admin to access this page", {
            style: { color: "red" },
          });
          router.push("/");
        }
        setIsLoading(false);
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
      
      
    })
  }, [router, user]);
  return (
    <>
    {(isLoading || !isAdmin) ? (
      <LoadingWidget />):
      <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your digital wallet management system." />
      <AnalyticsCards />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <div className="col-span-4">
          <TransactionChart />
        </div>
        <div className="col-span-3">
          <TransactionTypeChart />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {/* <UserActivityChart /> */}
        {/* <RecentUsers /> */}
      </div>
    </DashboardShell>
}
    
  </>
  )
}

