"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Filter,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useTransition } from "react";
import { getTransactionsById } from "@/app/actions/getTransactions";
import { Transactions } from "@/types";
import LoadingWidget from "../../LoadingWidget";

interface TransactionHistoryProps {
  userId: string;
}

export function TransactionHistory({ userId }: TransactionHistoryProps) {
  const [isPending, startTransition] = useTransition();
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  // const [error, setError] = useState("");
  useEffect(() => {
    startTransition(() => {
      getTransactionsById(userId).then((data) => {
        if (data) {
          setTransactions(
            data.map((transaction) => ({
              ...transaction,
              type: transaction.sender_id === userId ? "sent" : "received",
            }))
          );
          // setLoading(false);
          // console.log(userId);
        } else {
          // setError("Failed to fetch activities");
          return;
          // setLoading(false);
        }
      });
    });
  }, [userId]);
  // In a real app, you would fetch transaction data based on userId
  // const transactions = [
  //   {
  //     id: "tx_1",
  //     type: "deposit",
  //     amount: "$500.00",
  //     date: "Mar 28, 2023",
  //     time: "10:45 AM",
  //     status: "completed",
  //     description: "Bank Transfer Deposit",
  //     method: "Bank Transfer",
  //   },
  //   {
  //     id: "tx_2",
  //     type: "withdrawal",
  //     amount: "$150.00",
  //     date: "Mar 25, 2023",
  //     time: "3:20 PM",
  //     status: "completed",
  //     description: "ATM Withdrawal",
  //     method: "Card",
  //   },
  //   {
  //     id: "tx_3",
  //     type: "payment",
  //     amount: "$42.50",
  //     date: "Mar 24, 2023",
  //     time: "1:15 PM",
  //     status: "completed",
  //     description: "Coffee Shop Payment",
  //     method: "Card",
  //   },
  //   {
  //     id: "tx_4",
  //     type: "deposit",
  //     amount: "$1,000.00",
  //     date: "Mar 20, 2023",
  //     time: "9:30 AM",
  //     status: "completed",
  //     description: "Salary Deposit",
  //     method: "Bank Transfer",
  //   },
  //   {
  //     id: "tx_5",
  //     type: "withdrawal",
  //     amount: "$350.00",
  //     date: "Mar 18, 2023",
  //     time: "5:45 PM",
  //     status: "completed",
  //     description: "Online Purchase",
  //     method: "Card",
  //   },
  // ]

  return (
    <>
      {isPending ? (
        <LoadingWidget />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8 w-[200px] md:w-[250px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Date & Time</TableHead>

                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-full p-2 ${
                            transaction.type === "deposit"
                              ? "bg-green-100 text-green-600"
                              : transaction.type === "withdrawal"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {transaction.type === "deposit" ? (
                            <ArrowDownLeft className="h-4 w-4" />
                          ) : transaction.type === "withdrawal" ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <CreditCard className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{transaction.desc}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {transaction.type}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {transaction.transaction_date.toDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.transaction_date.toLocaleTimeString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </div>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transaction.receiver_id === userId
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.receiver_id === userId ? "+" : "-"}
                      {transaction.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
