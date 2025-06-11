"use client";

import { useEffect, useState } from "react";
import { CreditCard, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
import { fetchWalletbyUser } from "@/app/actions/getWallet";
import { useUser } from "@clerk/nextjs";
import { Wallet } from "@/types";
import LoadingWidget from "@/components/LoadingWidget";
import { toggleWalletActive } from "@/app/actions/freezeCard";
import { toast } from "sonner";

interface CardManagementProps {
  userId: string;
}

export function CardManagement({ userId }: CardManagementProps) {
  const [cards] = useState([
    {
      id: "card_1",
      type: "Visa Debit",
      number: "**** **** **** 4567",
      expiryDate: "05/25",
      isDefault: true,
      isFrozen: false,
    },
    // {
    //   id: "card_2",
    //   type: "Mastercard Credit",
    //   number: "**** **** **** 8901",
    //   expiryDate: "09/24",
    //   isDefault: false,
    //   isFrozen: false,
    // },
  ]);

  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [, setSelectedCardId] = useState("");
  const [wallet, setWallet] = useState<Wallet>({} as Wallet);
  const { user } = useUser();
  const handleFreezeCard = (cardId: string) => {
    setSelectedCardId(cardId);
    setFreezeDialogOpen(true);
    // console.log(userId);
  };

  const confirmFreezeCard = () => {
    toggleWalletActive(wallet.id, userId).then((res) => {
      if (res.success) {
        setWallet((prev) => ({ ...prev, isActive: !prev.isActive }));
        toast.success(res.message, {
          style: { color: "green" },
        });
      } else {
        toast.error(res.message, {
          style: { color: "red" },
        });
      }
    });
    //setCards(cards.map((card) => (card.id === selectedCardId ? { ...card, isFrozen: !card.isFrozen } : card)))
    setFreezeDialogOpen(false);
  };

  // const toggleCardStatus = (cardId: string) => {
  //   setCards(cards.map((card) => (card.id === cardId ? { ...card, isFrozen: !card.isFrozen } : card)))
  // }
  useEffect(() => {
    setIsLoading(true);
    if (!user) return;
    fetchWalletbyUser(userId)
      .then((data) => {
        if (data) setWallet(data);
      })
      .finally(() => setIsLoading(false));
  }, [user, userId]);

  return (
    <>
      {loading ? (
        <LoadingWidget />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Card Management</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`relative rounded-lg border p-4 ${card.isFrozen ? "bg-muted" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-2">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">User Wallet</h3>
                      {/* <p className="text-sm text-muted-foreground">{card.number}</p> */}
                      {/* <p className="text-sm text-muted-foreground">Expires: {card.expiryDate}</p>
                    {card.isDefault && (
                      <span className="mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        Default
                        </span>
                        )} */}
                      {!wallet.isActive && (
                        <span className="mt-1 ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                          Frozen
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      {/* <Switch
                      id={`freeze-${card.id}`}
                      checked={!card.isFrozen}
                      onCheckedChange={() => toggleCardStatus(card.id)}
                      /> */}
                      {/* <Label htmlFor={`freeze-${wallet.id}`}>{wallet.isActive ? "Frozen" : "Active"}</Label> */}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleFreezeCard(wallet.id)}
                        >
                          {!wallet.isActive ? "Unfreeze card" : "Freeze card"}
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>View transactions</DropdownMenuItem> */}
                        {/* <DropdownMenuItem>Set as default</DropdownMenuItem> */}
                        {/* <DropdownMenuItem className="text-destructive">Remove card</DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
            {/* <Button variant="outline" className="mt-2">
            <CreditCard className="mr-2 h-4 w-4" />
            Add New Card
            </Button> */}
          </CardContent>
        </Card>
      )}

      <AlertDialog open={freezeDialogOpen} onOpenChange={setFreezeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {!wallet.isActive ? "Unfreeze Card" : "Freeze Card"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {!wallet.isActive
                ? "This will unfreeze the card and allow transactions to be processed again. Are you sure you want to continue?"
                : "This will temporarily freeze the card and prevent any transactions from being processed. The user can still view their card details but cannot use it for payments."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmFreezeCard}>
              {!wallet.isActive
                ? "Unfreeze"
                : "Freeze"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
