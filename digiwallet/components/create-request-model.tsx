"use client";

import type React from "react";
import { startTransition, useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserList } from "@/components/request-user-list";
// import type { UserType } from "@/app/send-money/page";
import { fetchAllUsers } from "@/app/actions/getUser";
import { useUser } from "@clerk/nextjs";
import { UserType } from "@/types";
import { storeMoneyRequest } from "@/app/actions/storeMoneyRequest";
interface CreateRequestModalProps {
  onClose: () => void;
}

export function CreateRequestModal({ onClose }: CreateRequestModalProps) {
  const [step, setStep] = useState<"selectUser" | "amount" | "success" | "error">(
    "selectUser"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const { user } = useUser();
  useEffect(() => {
    // setLoading(true);
    startTransition(() => {
      fetchAllUsers().then((data) => {
        console.log(data);
        if (data && user) {
          setUsers(data.filter((u) => u.id !== user.id));
        }
      });
    });
  }, [user]);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (user: UserType) => {
    setSelectedUser(user);
    setStep("amount");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate amount
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if(!user || !user.id){
          setError("User not found");
          setStep("error");
          return
        }
        storeMoneyRequest(user.id, (selectedUser)?selectedUser.id:"", Number(amount), reason).then((data) => {
          // console.log(data);
          if(data){
            setStep("success")
            console.log("success");
          }
          else{
            setStep("error")
          }
  
  });
}

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w">
        <DialogHeader>
          <DialogTitle>
            {step === "selectUser" ? "Request Money" : "Enter Amount"}
          </DialogTitle>
        </DialogHeader>

        {step === "selectUser" && (
          <div className="space-y-4 py-4">
            <div className="relative">
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

            <div className="max-h-[300px] overflow-y-auto">
              <UserList users={filteredUsers} onSendMoney={handleSelectUser} />
            </div>
          </div>
        )}
        {step === "success" && (
          <div className="space-y-4 py-4 text-green-600">Successful</div>
        )}

        {step === "amount" && selectedUser && (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setStep("selectUser")}
              >
                <X className="h-4 w-4" />
              </Button>
              <p className="font-medium">Requesting from {selectedUser.name}</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Rs. 
                </div>
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
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
            <Button type="submit" className="w-full">
              Send Request
            </Button>
          </form>
        )}
        {step === "error" && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="mb-4 rounded-full bg-red-100 p-3">
                      <X className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-lg font-medium">Request Failed</p>
                    <p className="mb-6 text-sm text-muted-foreground">
                      There was an error processing your request. Please try again.
                    </p>
                    <Button onClick={() => setStep("amount")} className="w-full">
                      Try Again
                    </Button>
                  </div>
                )}
      </DialogContent>
    </Dialog>
  );
}

