"use server"
import { db } from "@/lib/db";
import { Wallet } from "@/types";

// Fetch Wallet by User ID
export const fetchWalletbyUser = async (id: string) => {
    try {
        const wallet:Wallet[] = await db.$queryRaw`
        SELECT w.*
        FROM "Wallet" w
        JOIN "User" u ON u.wallet_id = w.id
        WHERE u.id = ${id}
        LIMIT 1;
        `;
        
        return wallet[0] || null;
    } catch {
        return null;
    }
};

// Fetch Wallet by User Email
export const fetchWalletbyUserEmail = async (email: string) => {
    try {
        const wallet:Wallet[] = await db.$queryRaw`
        SELECT w.*
        FROM "Wallet" w
        JOIN "User" u ON u.wallet_id = w.id
        WHERE u.email = ${email}
        LIMIT 1;
        `;
        
        return wallet[0] || null;
    } catch {
        return null;
    }
};

