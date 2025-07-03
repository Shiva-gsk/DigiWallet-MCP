"use client";
// import { useEffect } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card_ui";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Wallet,
  SendHorizonal,
  FileText,
  Loader2,
  Activity,
} from "lucide-react";
import Header from "@/components/Navbar";
import { useEffect, useState, useTransition } from "react";
import { getTransactions } from "@/app/actions/getTransactions";
import { Transactions } from "@/types";
// import { syncUsers } from "./actions/syncUsers";
import { useRouter } from "next/navigation";
import ActivityLogModal from "@/components/userActivityLog";

export default function Home() {
  const router = useRouter();
  const [recentTransactions, setRecentTransactions] = useState<Transactions[]>(
    []
  );
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState(5);
  const { user, isSignedIn } = useUser();
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (isSignedIn) {
        // await syncUsers(); // Call only when user is signed in
      }
    };
    fetchData();
    if (!user) {
      router.push("/signIn");
    }
  }, [isSignedIn, user, router]); // Dependency added to prevent unnecessary calls

  useEffect(() => {
    startTransition(() => {
      if (user) {
        getTransactions(user.emailAddresses[0].emailAddress).then(
          (transactions) => {
            if (transactions === null) {
              return;
            }
            const updated: Transactions[] = transactions.map((transaction) => ({
              ...transaction,
              type:
                transaction.sender.email === user.emailAddresses[0].emailAddress
                  ? "sent"
                  : "received",
            }));
            setRecentTransactions(updated.reverse());
          }
        );
      } else {
        setRecentTransactions([]);
      }
    });
  }, [user]); // Dependency added to prevent unnecessary calls

  return (
    <main>
      <Header />
      <SignedOut>
        {/* <p>
          Please log in to see the user button.
          <Link href={"/signIn"}>SignIn</Link>
        </p> */}
      </SignedOut>
      <SignedIn>
        <div className="flex justify-between items-center gap-4">
          {/* <div>
            Welcome
          </div>
          <div className="">
        <UserButton />

          </div> */}
        </div>
        {/* <div className="w-full h-full flex justify-center items-center gap-4">
        <CardWrapper>
        <Link href={"/send-money"}>
          <div
          
          className="py-10 cursor-pointer w-full h-full text-center justify-center items-center"
          >
            <div className="flex justify-center items-center w-full h-full p-2">
              <Send />
            </div>
            <div className=" w-full h-full text-center">Send Money</div>
          </div>
          </Link>
        </CardWrapper>
        <CardWrapper>
        <Link href={"/money-request"}>
          <div
            className="py-10 cursor-pointer w-full h-full text-center justify-center items-center"
            >
            <div className="flex justify-center items-center w-full h-full p-2">
              <HandCoins />
            </div>
            <div className="cursor-pointer w-full h-full text-center">
            Money Request
            </div>
          </div>
          </Link>
        </CardWrapper>
        <CardWrapper>
        <Link href={"/wallet"}>
          <div className="py-10 cursor-pointer w-full h-full text-center justify-center items-center">
            <div className="flex justify-center items-center w-full h-full p-2">
              <Wallet />
            </div>
            <div className="cursor-pointer w-full h-full text-center">
             View Wallet
            </div>
          </div>
          </Link>
        </CardWrapper>
      </div> */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold text-center">
            Digital Wallet
          </h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Link href="/send-money" className="block">
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <SendHorizonal className="mb-4 h-12 w-12 text-blue-500" />
                  <h2 className="text-xl font-semibold">Send Money</h2>
                  <p className="mt-2 text-center text-muted-foreground">
                    Transfer funds to other users quickly and securely
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/money-request" className="block">
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <FileText className="mb-4 h-12 w-12 text-red-400" />
                  <h2 className="text-xl font-semibold ">Money Request</h2>
                  <p className="mt-2 text-center text-muted-foreground">
                    Send, view and manage money requests
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/wallet" className="block">
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Wallet className="mb-4 h-12 w-12 text-yellow-300" />
                  <h2 className="text-xl font-semibold">Wallet</h2>
                  <p className="mt-2 text-center text-muted-foreground">
                    View your wallet details and transaction history
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
          {isPending ? (
            <div className="pt-7 flex justify-center items-center h-full">
              <Loader2 className="animate-spin" size={48} color="#4F46E5" />
            </div>
          ) : (
            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-semibold">
                Recent Transactions
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentTransactions.slice(0, items).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <div className="flex items-center">
                          <div
                            className={`mr-4 rounded-full p-2 ${
                              transaction.type === "received"
                                ? "bg-green-100"
                                : "bg-blue-100"
                            }`}
                          >
                            {transaction.type === "received" ? (
                              <SendHorizonal className="h-5 w-5 rotate-180 text-green-600" />
                            ) : (
                              <SendHorizonal className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {transaction.sender_id !== user?.id
                                ? transaction.sender &&
                                  transaction?.sender.username &&
                                  transaction.sender?.username
                                    ?.charAt(0)
                                    .toUpperCase() +
                                    transaction.sender?.username
                                      ?.slice(1)
                                      .toLowerCase()
                                : transaction.receiver &&
                                  transaction?.receiver.username &&
                                  transaction.receiver?.username
                                    ?.charAt(0)
                                    .toUpperCase() +
                                    transaction.receiver?.username
                                      ?.slice(1)
                                      .toLowerCase()}
                            </p>
                            <p>{transaction.desc}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.transaction_date.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`font-semibold ${
                            transaction.type === "received"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          {transaction.type === "received" ? "+" : "-"}
                          {transaction.amount} Rs.
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      if (!toggle) {
                        setToggle(!toggle);
                        setItems(recentTransactions.length);
                      } else {
                        setToggle(!toggle);
                        setItems(5);
                      }
                    }}
                    variant="outline"
                    className="mt-4 w-full"
                  >
                    {!toggle ? "View All Transactions" : "Show Less"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <ActivityLogModal>
          <Card className="h-full transition-all hover:shadow-md cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Activity className="mb-4 h-12 w-12 text-purple-500" />
              <h2 className="text-xl font-semibold">Activity Log</h2>
              <p className="mt-2 text-center text-muted-foreground">
                View a detailed log of all your wallet activities
              </p>
            </CardContent>
          </Card>
        </ActivityLogModal>
    <footer className="text-gray-600" style={{ textAlign: 'center', padding: '1rem', marginTop: '2rem' }}>
    <p>© {new Date().getFullYear()} DigiWallet. All rights reserved.</p>
  </footer>
      </SignedIn>
    </main>
  );
}
