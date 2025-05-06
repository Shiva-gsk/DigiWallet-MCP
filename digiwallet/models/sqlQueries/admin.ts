"use server"

import { db } from "@/lib/db";

export const fetchActivities = async (id: string) => {
    try {
        const activities = await db.$queryRaw`
        SELECT * 
        FROM "ActivityLog"
        WHERE "userId" = ${id}
        ORDER BY "timestamp" DESC;
        `;

        console.log(activities);
        return activities;

    } catch (e) {
        console.error(e);
        return null;
    }
};


//  Get Dashboard Stats
export async function getDashboardStats() {
    try {
        const [userCount, transactionCount, totalMoney, walletCount] = await Promise.all([
            db.$queryRaw<{ userCount: number }[]>`SELECT COUNT(*) AS "userCount" FROM "User";`,
            db.$queryRaw<{ transactionCount: number }[]>`SELECT COUNT(*) AS "transactionCount" FROM "Transaction";`,
            db.$queryRaw<{ totalMoney: number }[]>`SELECT COALESCE(SUM("amount"), 0) AS "totalMoney" FROM "Transaction";`,
            db.$queryRaw<{ walletCount: number }[]>`SELECT COUNT(*) AS "walletCount" FROM "Wallet";`
        ]);

        return {
            userCount: userCount[0]?.userCount || 0,
            transactionCount: transactionCount[0]?.transactionCount || 0,
            totalMoney: totalMoney[0]?.totalMoney || 0,
            walletCount: walletCount[0]?.walletCount || 0
        };

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            userCount: 0,
            transactionCount: 0,
            totalMoney: 0,
            walletCount: 0
        };
    }
}

//  Get Pie Chart Stats
export async function getPieChartStats() {
    try {
        const [withdrawal, transaction, deposit] = await Promise.all([
            db.$queryRaw<{ withdrawalCount: number }[]>`SELECT COUNT(*) AS "withdrawalCount" FROM "Withdrawal";`,
            db.$queryRaw<{ transactionCount: number }[]>`SELECT COUNT(*) AS "transactionCount" FROM "Transaction";`,
            db.$queryRaw<{ depositCount: number }[]>`SELECT COUNT(*) AS "depositCount" FROM "Deposit";`
        ]);

        return {
            withdrawal: withdrawal[0]?.withdrawalCount || 0,
            transaction: transaction[0]?.transactionCount || 0,
            deposit: deposit[0]?.depositCount || 0
        };

    } catch (error) {
        console.error("Error fetching pie chart stats:", error);
        return {
            withdrawal: 0,
            transaction: 0,
            deposit: 0
        };
    }
}

