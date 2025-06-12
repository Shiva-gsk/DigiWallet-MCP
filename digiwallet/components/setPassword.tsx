"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";

import { PinInput } from "./pin-input";
import { changePassword } from "@/app/actions/changePassword";
import { useRouter } from "next/navigation";


interface Props {
  children: React.ReactNode;
  resetToken?: string;
  // flag: boolean;
  // setFlag: (flag: boolean) => void;

}

export function SetPassword({children, resetToken }: Props) {
  const [, startTransition] = useTransition();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("pin");
  const { user } = useUser();
  const router = useRouter();
  function handlePassword(pin:string): void {

    if (!user) {
      setError("Something went wrong! Try Later");
      setStep("error");
      return;
    };
    startTransition(() => {
      changePassword(user.emailAddresses[0].emailAddress ,Number(pin), resetToken || "").then((data) => {
        if (data.success) {
          setSuccess(data.message);
          setStep("success");
          // setFlag(!flag)
        } else {
          
          setError(data.message);
          setStep("error");
        }
      });
    });

    setTimeout(()=>{
      // setStep("pin");
      router.push("/wallet");
    }, 3000);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-[10%] w-[30%] cursor-pointer">{children}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step == "pin" && "Set Password"}
            {step == "success" && "Success"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {step == "pin" && (
          <>
            <PinInput length={4} onComplete={handlePassword}/>
          </>
        )}
        {step == "success" && (
          <p className="text-sm text-emerald-400">{success}</p>
        )}
        {step == "error" && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
