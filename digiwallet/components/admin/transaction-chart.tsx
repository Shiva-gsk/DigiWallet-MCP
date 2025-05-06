"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { groupTransactionsByMonth } from "@/app/actions/getTransactions";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LoadingWidget from "../LoadingWidget";

// Mock data for the chart
// const data = [
//   { name: "Jan", value: 2400 },
//   { name: "Feb", value: 1398 },
//   { name: "Mar", value: 9800 },
//   { name: "Apr", value: 3908 },
//   { name: "May", value: 4800 },
//   { name: "Jun", value: 3800 },
//   { name: "Jul", value: 4300 },
//   { name: "Aug", value: 5300 },
//   { name: "Sep", value: 4500 },
//   { name: "Oct", value: 6500 },
//   { name: "Nov", value: 7500 },
//   { name: "Dec", value: 8500 },
// ]

interface chartProps {
  name: string;
  value: number;
}

export function TransactionChart() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<chartProps[]>();
  useEffect(() => {
    setLoading(true);
    groupTransactionsByMonth()
      .then((data) => {
        const d = Object.entries(data).map(([month, transactions]) => ({
          name: month.trim(), // Ensure there's no extra space
          value: transactions.length, // Count of transactions in that month
        }));
        setData(d);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      {loading ? (
        <LoadingWidget />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
            <CardDescription>
              Monthly transaction volume over the past year
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} transactions`, "Volume"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
