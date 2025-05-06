// import { Check, X } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card_ui";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { MoneyRequest } from "@/types";
// import {
//   acceptMoneyRequest,
//   cancelMoneyRequest,
// } from "@/lib/requestButtonActions";
// import { toast } from "sonner";

// interface RequestListProps {
//   requests: MoneyRequest[];
//   type: "received" | "sent";
//   flag: boolean;
//   setFlag: (value: boolean) => void;
// }

// export function RequestList({
//   requests,
//   type,
//   flag,
//   setFlag,
// }: RequestListProps) {
//   if (requests.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-12">
//         <p className="text-lg font-medium">No requests found</p>
//         <p className="text-muted-foreground">
//           {type === "received"
//             ? "You have no pending requests from others"
//             : type === "sent"
//               ? "You haven't sent any requests yet"
//               : "You have no completed requests"}
//         </p>
//       </div>
//     );
//   }

//   // useEffect(()=>{
//   //   console.log();
//   // }, [requests]);

//   function handleCancel(request_id: string): void {
//     cancelMoneyRequest(request_id)
//       .then((res) => {
//         if (res) {
//           console.log("Request Cancelled");
//           setFlag(!flag);
//         } else {
//           console.log("Request Cancel Failed");
//         }
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }
//   function handlePay(
//     request_id: string,
//     sender_id: string,
//     receiver_id: string,
//     amount: number
//   ): void {
//     acceptMoneyRequest(request_id, sender_id, receiver_id, amount).then(
//       (res) => {
//         // window.location.reload();
//         if (res) {
//           // console.log("Request Cancelled");
//           setFlag(!flag);
//           toast("Payment Successful", {
//             description: "You have successfully paid the request",
//             style: { color: "green" },
//           });
//         } else {
//           // console.log("Request Cancel Failed");
//           setFlag(!flag);
//           toast("Payment Failed", {
//             description: "Something went wrong. Please try again",
//             style: { color: "red" },
//           });
//         }
//       }
//     );
//   }

//   return (
//     <div className="space-y-3">
//       {requests.map((request) => (
//         <Card key={request.id}>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <Avatar className="mr-4 h-10 w-10">
//                   <AvatarImage src={""} alt={""} />
//                   <AvatarFallback>{"J"}</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-medium">
//                     {type == "received"
//                       ? request.sender?.name
//                       : request.receiver?.name}
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     {request.request_date.toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="font-semibold">{request.amount} Rs.</p>
//                 {request.status === "pending" ? (
//                   <Badge
//                     variant="outline"
//                     className="bg-yellow-50 text-yellow-700"
//                   >
//                     Pending
//                   </Badge>
//                 ) : request.status === "completed" ? (
//                   <Badge
//                     variant="outline"
//                     className="bg-green-50 text-green-700"
//                   >
//                     Completed
//                   </Badge>
//                 ) : (
//                   <Badge variant="outline" className="bg-red-50 text-red-700">
//                     Declined
//                   </Badge>
//                 )}
//               </div>
//             </div>

//             <p className="mt-2 text-sm px-2">{request.desc}</p>

//             {type === "received" && request.status === "pending" && (
//               <div className="mt-4 flex justify-end space-x-2 cursor-pointer">
//                 <Button
//                   onClick={() => {
//                     handleCancel(request.id);
//                   }}
//                   variant="outline"
//                   size="sm"
//                 >
//                   <X className="mr-1 h-4 w-4" />
//                   Decline
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={() => {
//                     handlePay(
//                       request.id,
//                       request.sender_id,
//                       request.receiver_id,
//                       request.amount
//                     );
//                   }}
//                 >
//                   <Check className="mr-1 h-4 w-4" />
//                   Pay
//                 </Button>
//               </div>
//             )}

//             {type === "sent" && request.status === "pending" && (
//               <div className="mt-4 flex justify-end cursor-pointer">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleCancel(request.id)}
//                 >
//                   Cancel Request
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

// export default RequestList;

import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card_ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoneyRequest } from "@/types";
import {
  acceptMoneyRequest,
  cancelMoneyRequest,
} from "@/app/actions/requestButtonActions";
import { toast } from "sonner";
import { useState } from "react";
import { PinInput } from "@/components/pin-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { fetchUserbyEmail } from "@/app/actions/getUser";
import { useUser } from "@clerk/nextjs";

interface RequestListProps {
  requests: MoneyRequest[];
  type: "received" | "sent";
  flag: boolean;
  setFlag: (value: boolean) => void;
}

export function RequestList({
  requests,
  type,
  flag,
  setFlag,
}: RequestListProps) {
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  // const [currUser, setCurrentUser] = useState<UserType>();
  const {user} = useUser();
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    sender_id: string;
    receiver_id: string;
    amount: number;
  } | null>(null);

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium">No requests found</p>
        <p className="text-muted-foreground">
          {type === "received"
            ? "You have no pending requests from others"
            : type === "sent"
              ? "You haven't sent any requests yet"
              : "You have no completed requests"}
        </p>
      </div>
    );
  }

  function handleCancel(request_id: string): void {
    cancelMoneyRequest(request_id)
      .then((res) => {
        if (res) {
          console.log("Request Cancelled");
          setFlag(!flag);
          toast("Request Cancelled", {
            description: "You have successfully cancelled the request",
            style: { color: "blue" },
          });
        } else {
          console.log("Request Cancel Failed");
          toast("Cancel Failed", {
            description: "Something went wrong. Please try again",
            style: { color: "red" },
          });
        }
      })
      .catch((e) => {
        console.log(e);
        toast("Cancel Failed", {
          description: "An error occurred. Please try again",
          style: { color: "red" },
        });
      });
  }

  function initiatePayment(
    request_id: string,
    sender_id: string,
    receiver_id: string,
    amount: number
  ): void {
    setSelectedRequest({ id: request_id, sender_id, receiver_id, amount });
    setIsPinDialogOpen(true);
  }

  function handlePinComplete(pin: string) {
    // Here you would typically validate the PIN with your backend
    // For this example, we'll just assume a successful validation
    if (selectedRequest) {
      // Close the dialog first for better UX
      setIsPinDialogOpen(false);
      
      // Then process the payment
      processPayment(
        selectedRequest.id,
        selectedRequest.sender_id,
        selectedRequest.receiver_id,
        selectedRequest.amount,
        pin
      );
    }
  }
  
  function processPayment(
    request_id: string,
    sender_id: string,
    receiver_id: string,
    amount: number,
    pin: string
  ): void {
    // First validate the PIN
    fetchUserbyEmail(user?.emailAddresses[0].emailAddress)
      .then((data) => {
        if (!data) {
          throw new Error("User data not found");
        }
        
        if (data.password !== Number(pin)) {
          toast("Payment Failed", {
            description: "Invalid PIN. Please try again",
            style: { color: "red" },
          });
          throw new Error("Invalid PIN"); // This will prevent the next .then from executing
        }
        
        // Only proceed to payment if PIN validation passes
        return acceptMoneyRequest(request_id, sender_id, receiver_id, amount);
      })
      .then((res) => {
        // This will only run if PIN validation passed
        if (res) {
          setFlag(!flag);
          toast("Payment Successful", {
            description: "You have successfully paid the request",
            style: { color: "green" },
          });
        } else {
          setFlag(!flag);
          toast("Payment Failed", {
            description: "Something went wrong. Please try again",
            style: { color: "red" },
          });
        }
      })
      .catch((e) => {
        console.log(e);
        // Only show generic error if it wasn't already handled
        if (e.message !== "Invalid PIN") {
          toast("Payment Failed", {
            description: "An error occurred. Please try again",
            style: { color: "red" },
          });
        }
      });
  }

  return (
    <>
      <div className="space-y-3">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="mr-4 h-10 w-10">
                    <AvatarImage src={""} alt={""} />
                    <AvatarFallback>
                      {(type === "received" 
                        ? request.sender?.name?.charAt(0) 
                        : request.receiver?.name?.charAt(0)) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {type === "received"
                        ? request.sender?.name
                        : request.receiver?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.request_date.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{request.amount} Rs.</p>
                  {request.status === "pending" ? (
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700"
                    >
                      Pending
                    </Badge>
                  ) : request.status === "completed" ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      Declined
                    </Badge>
                  )}
                </div>
              </div>

              <p className="mt-2 text-sm px-2">{request.desc}</p>

              {type === "received" && request.status === "pending" && (
                <div className="mt-4 flex justify-end space-x-2 cursor-pointer">
                  <Button
                    onClick={() => {
                      handleCancel(request.id);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      initiatePayment(
                        request.id,
                        request.sender_id,
                        request.receiver_id,
                        request.amount
                      );
                    }}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Pay
                  </Button>
                </div>
              )}

              {type === "sent" && request.status === "pending" && (
                <div className="mt-4 flex justify-end cursor-pointer">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(request.id)}
                  >
                    Cancel Request
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isPinDialogOpen} onOpenChange={setIsPinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Please enter your 4-digit PIN to authorize the payment of{" "}
              {selectedRequest?.amount} Rs.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <PinInput length={4} onComplete={handlePinComplete} />
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsPinDialogOpen(false)}
            >
              Cancel
            </Button>
            <div className="text-sm text-muted-foreground mt-2">
              Enter your security PIN to complete the transaction
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RequestList;