"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPieChartStats } from "@/app/actions/getAggregateStats";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import LoadingWidget from "../LoadingWidget";

// Mock data for the chart
// const data = [
//   { name: "Deposits", value: 540, color: "#10b981" }, // green
//   { name: "Withdrawals", value: 320, color: "#ef4444" }, // red
//   { name: "Payments", value: 210, color: "#3b82f6" }, // blue
//   // { name: "Transfers", value: 170, color: "#8b5cf6" }, // purple
// ]


export function TransactionTypeChart() {
   const [stats, setStats] = useState<{ name: string; value: number; color: string }[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
      setLoading(true);
      getPieChartStats().then((data)=>{
      setStats([
        { name: "Deposits", value: data.deposit, color: "#10b981" }, // green
          { name: "Withdrawals", value: data.withdrawal, color: "#ef4444" }, // red
          { name: "Payments", value: data.transaction, color: "#3b82f6" }, // blue
      ]);
        // console.log(data);
      }).finally(()=>{
        setLoading(false);
      }
      );
    }, [])
  return (
    <>
    {(loading) ? <LoadingWidget/>: <Card>
      <CardHeader>
      <CardTitle>Transaction Types</CardTitle>
      <CardDescription>Distribution of transaction types</CardDescription>
      </CardHeader>
      <CardContent>
      <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
      <PieChart>
      <Pie
      data={stats}
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={80}
      paddingAngle={5}
      dataKey="value"
      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
      {stats.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
      </Pie>
      <Tooltip formatter={(value) => [`${value} transactions`, "Count"]} />
      <Legend />
      </PieChart>
      </ResponsiveContainer>
      </div>
      </CardContent>
      </Card>
    }
    </>
    )
  }
  
  