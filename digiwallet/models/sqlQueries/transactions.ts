"use server"

import { db } from "@/lib/db";
import { fetchUserbyEmail } from "./user";
import { fetchWalletbyUserEmail } from "./wallet";

//  Deposit Money
export const depositMoney = async (email: string, amount: number) => {
    const sendUser = await fetchUserbyEmail(email);
    const sender = await fetchWalletbyUserEmail(email);

    if (!sender || !sendUser) {
        return false;
    }

    try {
        // Start transaction
        await db.$transaction(async (tx) => {
            // Increment balance
            await tx.$queryRaw`
            UPDATE "Wallet"
            SET "balance" = "balance" + ${amount}
            WHERE "id" = ${sender.id};
            `;

            // Create deposit record
            await tx.$queryRaw`
            INSERT INTO "Deposit" ("amount", "walletId", "status", "request_date", "process_date")
            VALUES (${amount}, ${sender.id}, 'success', NOW(), NOW());
            `;

            // Create activity log
            await tx.$queryRaw`
            INSERT INTO "ActivityLog" ("userId", "activity_type", "details", "timestamp")
            VALUES (${sendUser.id}, 'Deposit', ${`Deposited ${amount}`}, NOW());
            `;
        });

        return true;

    } catch (error) {
        console.error(error);

        // Log failed deposit and activity
        await db.$transaction(async (tx) => {
            await tx.$queryRaw`
            INSERT INTO "Deposit" ("amount", "walletId", "status", "request_date", "process_date")
            VALUES (${amount}, ${sender.id}, 'Failed', NOW(), NOW());
            `;

            await tx.$queryRaw`
            INSERT INTO "ActivityLog" ("userId", "activity_type", "details", "timestamp")
            VALUES (${sendUser.id}, 'Deposit', 'Failed deposit of ${amount}', NOW());
            `;
        });

        return false;
    }
};

//  Withdraw Money
export const withdrawMoney = async (email: string, amount: number) => {
    const sender = await fetchWalletbyUserEmail(email);
    const sendUser = await fetchUserbyEmail(email);

    if (!sender || sender.balance < amount) {
        return { success: false, message: "Insufficient Balance" };
    }
    if (!sendUser) {
        return { success: false, message: "User not Found" };
    }

    try {
        // Start transaction
        await db.$transaction(async (tx) => {
            // Decrement balance
            await tx.$queryRaw`
            UPDATE "Wallet"
            SET "balance" = "balance" - ${amount}
            WHERE "id" = ${sender.id};
            `;

            // Create withdrawal record
            await tx.$queryRaw`
            INSERT INTO "Withdrawal" ("amount", "walletId", "status", "request_date", "process_date")
            VALUES (${amount}, ${sender.id}, 'success', NOW(), NOW());
            `;

            // Create activity log
            await tx.$queryRaw`
            INSERT INTO "ActivityLog" ("userId", "activity_type", "details", "timestamp")
            VALUES (${sendUser.id}, 'Withdrawal', ${`Withdrawn ${amount}`}, NOW());
            `;
        });

        return { success: true, message: "Money Withdrawn Successfully" };

    } catch (error) {
        console.error(error);

        // Log failed withdrawal
        await db.$transaction(async (tx) => {
            await tx.$queryRaw`
            INSERT INTO "Withdrawal" ("amount", "walletId", "status", "request_date", "process_date")
            VALUES (${amount}, ${sender.id}, 'Failed', NOW(), NOW());
            `;

            await tx.$queryRaw`
            INSERT INTO "ActivityLog" ("userId", "activity_type", "details", "timestamp")
            VALUES (${sendUser.id}, 'Withdrawal', 'Failed withdrawal of ${amount}', NOW());
            `;
        });

        return { success: false, message: "Something went Wrong" };
    }
};


// Get Transactions by Email
export const getTransactions = async (email: string) => {
    try {
        const user: { id: string; email: string; username: string }[] = await db.$queryRaw`
        SELECT "id", "email", "username" 
        FROM "User"
        WHERE "email" = ${email};
        `;

        if (!user || user.length === 0) return null;

        const transactions: { month: string; count: number; total_amount: number }[] = await db.$queryRaw`
        SELECT t.*, 
               s."username" AS "sender_username", 
               s."email" AS "sender_email",
               r."username" AS "receiver_username", 
               r."email" AS "receiver_email"
        FROM "Transaction" t
        LEFT JOIN "User" s ON t."sender_id" = s."id"
        LEFT JOIN "User" r ON t."receiver_id" = r."id"
        WHERE t."sender_id" = ${user[0].id} 
           OR t."receiver_id" = ${user[0].id};
        `;

        return transactions;

    } catch (error) {
        console.error(error);
        return null;
    }
};

// Get Transactions by User ID
export const getTransactionsById = async (id: string) => {
    try {
        const user: { id: string; email: string; username: string }[] = await db.$queryRaw`
        SELECT "id", "email", "username" 
        FROM "User"
        WHERE "id" = ${id};
        `;

        if (!user || user.length === 0) return null;

        const transactions = await db.$queryRaw`
        SELECT t.*, 
               s."username" AS "sender_username", 
               s."email" AS "sender_email",
               r."username" AS "receiver_username", 
               r."email" AS "receiver_email"
        FROM "Transaction" t
        LEFT JOIN "User" s ON t."sender_id" = s."id"
        LEFT JOIN "User" r ON t."receiver_id" = r."id"
        WHERE t."sender_id" = ${user[0].id} 
           OR t."receiver_id" = ${user[0].id};
        `;

        return transactions;

    } catch (error) {
        console.error(error);
        return null;
    }
};

// Group Transactions by Month
export async function groupTransactionsByMonth() {
    try {
        const transactions: { month: string; count: number; total_amount: number }[] = await db.$queryRaw`
        SELECT 
            TO_CHAR("transaction_date", 'YYYY-MM') AS "month",
            COUNT(*) AS "count",
            SUM("amount") AS "total_amount"
        FROM "Transaction"
        GROUP BY "month"
        ORDER BY "month" DESC;
        `;

        const grouped = transactions.reduce((acc: Record<string, typeof transactions>, txn) => {
            const month = txn.month;
            if (!acc[month]) acc[month] = [];
            acc[month].push(txn);
            return acc;
        }, {} as Record<string, typeof transactions>);

        return grouped;

    } catch (error) {
        console.error(error);
        return {};
    }
}


import { fetchUserbyId } from "./user";
import { fetchWalletbyUser } from "./wallet";

import { EmailTemplate } from '@/components/resend/email-templates';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMoneyById = async (senderId:string, receiverId:string, amount:number, desc:string) => {
    const sendUser = await fetchUserbyId(senderId);
    const receiveUser = await fetchUserbyId(receiverId);
    const sender = await fetchWalletbyUser(senderId);
    const receiver = await fetchWalletbyUser(receiverId);

    if (!sender || !receiver || !sendUser || !receiveUser) return false;
    if (!sender.isActive || !receiver.isActive) return false;
    if (senderId === receiverId) return false;
    if (sender.balance < amount) return false;

    try {
        // Perform Wallet Balance Update and Transaction in a Single Query Block for Atomicity
        await db.$transaction(async (tx) => {
            // Update sender balance
            await tx.$queryRaw`
            UPDATE "Wallet"
            SET "balance" = "balance" - ${amount}
            WHERE "id" = ${sender.id};
            `;

            // Update receiver balance
            await tx.$queryRaw`
            UPDATE "Wallet"
            SET "balance" = "balance" + ${amount}
            WHERE "id" = ${receiver.id};
            `;

            // Create the transaction record
            await tx.$queryRaw`
            INSERT INTO "Transaction" ("id", "status", "amount", "desc", "sender_id", "receiver_id", "transaction_date")
            VALUES (gen_random_uuid(), 'completed', ${amount}, ${desc}, ${senderId}, ${receiverId}, NOW());
            `;

            // Create notifications
            await tx.$queryRaw`
            INSERT INTO "Notification" ("id", "userId", "message", "type", "is_read", "createdAt")
            VALUES (gen_random_uuid(), ${receiverId}, 'You have received $${amount} from ${sendUser?.username}', 'transaction', false, NOW()),
                   (gen_random_uuid(), ${senderId}, 'You sent $${amount} to ${receiveUser?.username}', 'transaction', false, NOW());
            `;

            // Create activity logs
            await tx.$queryRaw`
            INSERT INTO "ActivityLog" ("id", "userId", "activity_type", "details", "timestamp")
            VALUES (gen_random_uuid(), ${senderId}, 'transaction', 'You sent $${amount} to ${receiveUser?.username}', NOW());
            `;
        });

        //  Send Email Notification
        try {
            const { data, error } = await resend.emails.send({
                from: 'DigiWallet <noreply@resend.dev>',
                to: "shivakumargulapala2005@gmail.com",  // Replace with `receiveUser.email` in production
                subject: 'Transaction Notification',
                react: await EmailTemplate({
                    sender: sendUser?.username,
                    receiver: receiveUser?.username,
                    amount
                }),
            });

            if (error) {
                console.error("Email Error:", error);
            }
            console.log("Email Sent:", data);

        } catch (emailError) {
            console.error("Email Sending Failed:", emailError);
        }

        return true;

    } catch (e) {
        console.error("Transaction Failed:", e);

        //  Log failed transaction in case of an error
        await db.$queryRaw`
        INSERT INTO "Transaction" ("id", "status", "amount", "desc", "sender_id", "receiver_id", "transaction_date")
        VALUES (gen_random_uuid(), 'failed', ${amount}, ${desc}, ${senderId}, ${receiverId}, NOW());
        `;

        return false;
    }
};
