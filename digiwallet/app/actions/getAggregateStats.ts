"use server"
import { db } from "@/lib/db"; // Adjust based on your setup

export async function getDashboardStats() {
  const [userCount, transactionCount, totalMoney, walletCount] = await Promise.all([
    db.user.count(), // Count total users
    db.transaction.count(), // Count total transactions
    db.transaction.aggregate({ // Sum of all transactions
        _sum: { amount: true },
    }),
    db.wallet.count(),
  ]);

  return {
    userCount,
    transactionCount,
    totalMoney: totalMoney._sum.amount || 0, // If no transactions, return 0
    walletCount
  };
}
export async function getPieChartStats() {
  const [withdrawal, transaction, deposit ] = await Promise.all([
    db.withdrawal.count(), // Count total users
    db.transaction.count(), // Count total transactions
    db.deposit.count()
  ]);

  return {
    withdrawal, transaction, deposit
  };
}



