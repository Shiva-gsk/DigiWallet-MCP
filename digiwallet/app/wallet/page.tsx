"use client";

import { useEffect, useState, useTransition } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import {toast} from "sonner"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card_ui";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PinInput } from "@/components/pin-input";
import { useUser } from "@clerk/nextjs";
import { fetchWalletbyUser } from "@/app/actions/getWallet";
import { UserType } from "@/types";
import { fetchUserbyId } from "@/app/actions/getUser";
import { DepositButton } from "@/components/depositButton";
import { WithdrawButton } from "@/components/withdrawButton";
import LoadingWidget from "@/components/LoadingWidget";
import { SetPassword } from "@/components/setPassword";
// import { updatePhoneNumber } from "../actions/verifyPhoneNum";
import PhoneNumberForm from "@/components/phoneNumberForm";
export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currentUser, setCurrentUser] = useState<UserType>();
  const [isPending, startTransition] = useTransition();
  const [updatedAt, setUpdatedAt] = useState("");
  const [flag, setFlag] = useState(false);


  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [message, setMessage] = useState('')
  
  // async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  //   if(!user) return;
  //   // setPhoneNumber(phoneNumber);
  //   const result = await updatePhoneNumber(user.id, phoneNumber)
    
  //   setMessage(result.message)
  // }

  const handleVerifyPin = (pin: string) => {
    if (!currentUser) {
      toast.error("Something went Wrong!", {
        style: { color: "red" },
      });
      
      return;
    }
    // In a real app, you would verify the PIN against the stored value
    if (Number(pin) === currentUser?.password) {
      setPinVerified(true);
      setShowBalance(true);
      setShowPinInput(false);
    } else {
      // alert("Incorrect PIN. Please try again.");
      toast.error("Incorrect PIN. Please try again.", {
        style: { color: "red" },
        description: "Can't verify PIN",
      });
    }
  };

  const toggleBalanceVisibility = () => {
    if (showBalance) {
      setShowBalance(false);
    } else {
      if (pinVerified) {
        setShowBalance(true);
      } else {
        setShowPinInput(true);
      }
    }
  };
  const { user, isLoaded } = useUser();

  useEffect(() => {
    startTransition(() => {
      if (isLoaded && user) {
        // console.log(user);
        fetchUserbyId(user.id).then((data) => {
          if (data) setCurrentUser(data);
        });
        fetchWalletbyUser(user.id).then((data) => {
          if (data) {
            setBalance(data.balance);
            setUpdatedAt(data.updatedAt.toDateString());
          }
        });
        // console.log(balance);
      }
    });
  }, [isLoaded, user, balance, flag]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex justify-between w-full">
          <h1 className="text-2xl font-bold">My Wallet</h1>

          <SetPassword setFlag={setFlag} flag={flag}>Set Password</SetPassword>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Available Balance</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBalanceVisibility}
            aria-label={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>
        </CardHeader>
        {isPending ? (
          <LoadingWidget />
        ) : (
          <CardContent>
            {showPinInput ? (
              <div className="py-4">
                <p className="mb-4 text-center text-sm text-muted-foreground">
                  Enter your PIN to view balance
                </p>
                <PinInput length={4} onComplete={handleVerifyPin} />
              </div>
            ) : (
              <div className="py-4">
                <h2 className="text-3xl font-bold">
                  {showBalance ? balance : "••••••"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Last updated: {updatedAt}
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
      <div className="w-full justify-around flex pb-4">
        {/* <Button className="h-10 w-[35%] cursor-pointer" >Deposit</Button>
          <Button className="h-10 w-[35%] cursor-pointer" >Withdraw</Button> */}
        <DepositButton setFlag={setFlag} flag={flag}>Deposit</DepositButton>
        <WithdrawButton setFlag={setFlag} flag={flag}>Withdraw</WithdrawButton>
      </div>
      <PhoneNumberForm />
      {/* <form onSubmit={handleSubmit}>
        <label>
          Phone Number:
          <input 
            type="tel" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
          />
        </label>
        
        <button type="submit">Update Phone Number</button>
        
        {message && <p>{message}</p>}
      </form> */}
      {/* <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="mt-4">
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div
                      className={`mr-4 rounded-full p-2 ${
                        transaction.type === "received"
                          ? "bg-green-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {transaction.type === "received" ? (
                        <ArrowDownUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownUp className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {transaction.date}
                      </div>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.type === "received"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {transaction.type === "received" ? "+" : "-"}$
                    {transaction.amount}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="cards" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="rounded-lg bg-gradient-to-r from-primary to-purple-600 p-6 text-white">
                <div className="mb-6 flex justify-between">
                  <div>
                    <p className="text-xs opacity-80">Digital Wallet</p>
                    <p className="text-sm font-semibold">Virtual Card</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">Balance</p>
                    <p className="font-semibold">
                      {showBalance ? "$1,250.75" : "••••••"}
                    </p>
                  </div>
                </div>
                <p className="mb-1 text-xs opacity-80">Card Number</p>
                <p className="mb-4 font-mono text-lg font-medium">
                  •••• •••• •••• 4589
                </p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs opacity-80">Card Holder</p>
                    <p className="font-medium">John Doe</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">Expires</p>
                    <p className="font-medium">05/28</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-center space-x-4">
                <Button variant="outline" size="sm">
                  Freeze Card
                </Button>
                <Button size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  );
}

