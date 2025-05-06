"use client";

import { useTransition, useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestList } from "@/components/request-list";
import { CreateRequestModal } from "@/components/create-request-model";
// import type { UserType } from "@/app/send-money/page"
import { getMoneyRequests } from "@/app/actions/getMoneyRequests";
import { useUser } from "@clerk/nextjs";
import { MoneyRequest } from "@/types";


export default function MoneyRequestPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sentRequests, setSentRequests] = useState<MoneyRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<MoneyRequest[]>([]);
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    if (!user) return; // Ensure user is defined before making the call

    startTransition(() => {
      getMoneyRequests(user.emailAddresses[0].emailAddress)
        .then((data) => {
          if (data) {
            if(data.sentRequests) setSentRequests(data.sentRequests);
            if(data.receivedRequests) setReceivedRequests(data.receivedRequests);
            // console.log(data?.sentRequests);
            // console.log(data?.receivedRequests);
          }
        })
        .catch((error) =>
          console.error("Failed to fetch money requests", error)
        );
    });
  }, [user, flag]);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Money Requests</h1>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>New Request</Button>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-4">
          {isPending ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" size={48} color="#4F46E5" />
            </div>
          ) : (
            <RequestList requests={receivedRequests} flag={flag} setFlag={setFlag} type="received" />
          )}
          {/* <RequestList requests={receivedRequests} type="received" /> */}
        </TabsContent>

        <TabsContent value="sent" className="mt-4">
          {isPending ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" size={48} color="#4F46E5" />
            </div>
          ) : (
            <RequestList requests={sentRequests} flag={flag} setFlag={setFlag} type="sent" />
          )}
        </TabsContent>
      </Tabs>

      {showCreateModal && (
        <CreateRequestModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
