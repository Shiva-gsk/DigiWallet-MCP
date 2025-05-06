"use client";
import { UserDetails } from "@/components/admin/users/user-details"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DashboardShell } from "@/components/admin/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionHistory } from "@/components/admin/users/transaction-history"
import { ActivityLog } from "@/components/admin/users/activity-log"
import { CardManagement } from "@/components/admin/users/card-management"
import { useParams } from "next/navigation";

export default function UserPage() {
  const params = useParams();

  if (!params?.id) {
    return <div className="text-red-500">User ID is missing</div>;
  }
  // const id = await params.id;
  return (
    <DashboardShell>
      <DashboardHeader heading="User Details" text={`Manage user ID: ${params.id}`} backHref="/admin/users" />
      <UserDetails userId={Array.isArray(params.id) ? params.id[0] : params.id} />
      <Tabs defaultValue="transactions" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="cards">Card Management</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="mt-4">
          <TransactionHistory userId={Array.isArray(params.id) ? params.id[0] : params.id} />
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <ActivityLog userId={Array.isArray(params.id) ? params.id[0] : params.id} />
        </TabsContent>
        <TabsContent value="cards" className="mt-4">
          <CardManagement userId={Array.isArray(params.id) ? params.id[0] : params.id} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

