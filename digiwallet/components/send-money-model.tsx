"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { X, Check, Loader2 } from "lucide-react"
import type { UserType } from "@/types"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PinInput } from "@/components/pin-input"
import { fetchWalletbyUser } from "@/app/actions/getWallet"
import { useUser } from "@clerk/nextjs"
import { sendMoneyById } from "@/app/actions/sendMoney"
import { Textarea } from "./ui/textarea"
import { fetchUserbyEmail } from "@/app/actions/getUser"

interface SendMoneyModalProps {
  user: UserType
  onClose: () => void
}

export function SendMoneyModal({ user, onClose }: SendMoneyModalProps) {
  const [amount, setAmount] = useState("")
  const [step, setStep] = useState<"amount" | "pin" | "processing" | "success" | "error">("amount")
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");
  const [balance, setBalance] = useState(0);
  const [money, setMoney] = useState(0);
  const [receiver, setReceiver] = useState("");
  const { user: clerkUser } = useUser();
  const [userPin, setUserPin] = useState(0);

  useEffect(()=>{
    if(clerkUser){
      fetchUserbyEmail(clerkUser.emailAddresses[0].emailAddress).then((data)=>{
        if(data && data.password){
          setUserPin(data.password);
        }
      })
      // console.log(clerkUser);
      fetchWalletbyUser(clerkUser.id).then((data) => {
        if (data) {
          setBalance(data.balance);
        }
      });
      // console.log(balance);
    }
  }, [user, balance, clerkUser])

  const handleAmountSubmit = (e: React.FormEvent, id: string) => {
    
    e.preventDefault()
    if(Number(amount) > balance){
      setError("Insufficient balance. Your balance is " + balance);
      return
    }
    // Validate amount
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }
    setReceiver(id);
    setMoney(Number(amount));
    // setAmount("");
    setError("");
    setStep("pin");
  }

  const handlePinSubmit = (pin: string) => {
    if(!clerkUser){
      alert("Someting went Wrong! Try Later");
      return;
    } 
    // In a real app, you would verify the PIN against the stored value
    if (Number(pin) !== userPin) {
      alert("Incorrect PIN. Please try again.");
      return;
    }
    
    // In a real app, you would verify the PIN against the stored value
    console.log(pin);
    setStep("processing")
    if(!clerkUser || !clerkUser.id){
      setError("User not found");
      setStep("error");
      return
    }
    sendMoneyById(clerkUser.id, receiver, money, reason).then((data) => {
      console.log(data);
      if(data){
        setStep("success")
      }
      else{
        setStep("error")
      }
    });
    // Simulate processing delay
    // setTimeout(() => {
    //   // For demo purposes, always succeed
    //   setStep("success")
    // }, 2000)
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "amount" && "Send Money"}
            {step === "pin" && "Confirm with PIN"}
            {step === "processing" && "Processing"}
            {step === "success" && "Money Sent!"}
            {step === "error" && "Transaction Failed"}
          </DialogTitle>
        </DialogHeader>

        {step === "amount" && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center">
              <Avatar className="h-16 w-16">
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                <AvatarFallback>{user.name ? user.name.charAt(0) : "?"}</AvatarFallback>
              </Avatar>
            </div>

            <p className="text-center text-lg font-medium">{user.name}</p>
            <p className="text-center text-sm text-muted-foreground">{user.email}</p>

            <form onSubmit={(e) => handleAmountSubmit(e, user.id)} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Rs.</div>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="pl-8 text-lg"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason (optional)
              </label>
              <Textarea
                id="reason"
                placeholder="What's this for?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </div>
        )}

        {step === "pin" && (
          <div className="space-y-6 py-4">
            <p className="text-center">
              Enter your PIN to send <span className="font-semibold">Rs.{amount}</span> to {user.name}
            </p>

            <PinInput length={4} onComplete={handlePinSubmit} />

            <p className="text-center text-sm text-muted-foreground">This transaction will be processed immediately</p>
          </div>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Processing your transaction</p>
            <p className="text-sm text-muted-foreground">Please wait a moment...</p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg font-medium">Transaction Complete!</p>
            <p className="mb-6 text-sm text-muted-foreground">
              You&apos;ve sent Rs.{amount} to {user.name}
            </p>
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        )}

        {step === "error" && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 rounded-full bg-red-100 p-3">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-lg font-medium">Transaction Failed</p>
            <p className="mb-6 text-sm text-muted-foreground">
              There was an error processing your transaction. Please try again.
            </p>
            <Button onClick={() => setStep("amount")} className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

