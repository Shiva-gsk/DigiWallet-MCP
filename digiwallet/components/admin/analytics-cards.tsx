"use client"

import { ArrowDown, ArrowUp, CreditCard, DollarSign, Users, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "@/app/actions/getAggregateStats";
import { useEffect, useState } from "react";
import { Stats } from "@/types";
import LoadingWidget from "../LoadingWidget";



export function AnalyticsCards() {
  const [stats, setStats] = useState<Stats>({} as Stats);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    setLoading(true);
    getDashboardStats().then((data)=>{
      setStats(data);
    }).finally(()=>{
      setLoading(false);
    }
    );
  }, [])
  return (
    <>
    {(loading) ? <LoadingWidget/>: <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
      <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
      <div className="text-2xl font-bold">{stats.userCount}</div>
          <div className="flex items-center pt-1">
          <span className="text-xs text-green-500 flex items-center">
          <ArrowUp className="mr-1 h-3 w-3" />
          12%
          </span>
          <span className="text-xs text-muted-foreground ml-1">from last month</span>
          </div>
          </CardContent>
          </Card>
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
          <div className="text-2xl font-bold">{stats.transactionCount}</div>
          <div className="flex items-center pt-1">
          <span className="text-xs text-green-500 flex items-center">
          <ArrowUp className="mr-1 h-3 w-3" />
          8.2%
          </span>
          <span className="text-xs text-muted-foreground ml-1">from last month</span>
          </div>
          </CardContent>
          </Card>
          <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
        <div className="text-2xl font-bold">{stats.totalMoney}</div>
        <div className="flex items-center pt-1">
        <span className="text-xs text-green-500 flex items-center">
        <ArrowUp className="mr-1 h-3 w-3" />
        18.5%
        </span>
        <span className="text-xs text-muted-foreground ml-1">from last month</span>
        </div>
        </CardContent>
        </Card>
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
        <div className="text-2xl font-bold">{stats.walletCount}</div>
        <div className="flex items-center pt-1">
        <span className="text-xs text-red-500 flex items-center">
        <ArrowDown className="mr-1 h-3 w-3" />
        4.1%
        </span>
        <span className="text-xs text-muted-foreground ml-1">from last month</span>
        </div>
        </CardContent>
        </Card>
        </div>
      }
      </>
  )
}

