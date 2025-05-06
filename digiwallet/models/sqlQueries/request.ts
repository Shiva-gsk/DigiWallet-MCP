"use server";
import { db } from "@/lib/db";

export const storeMoneyRequest = async (senderId: string, receiverId: string, amount: number, desc: string) => {
    console.log(senderId, receiverId, amount, desc);

    try {
        await db.$queryRaw`
        INSERT INTO "MoneyRequest" ("id", "receiver_id", "sender_id", "amount", "status", "desc", "request_date")
        VALUES (gen_random_uuid(), ${receiverId}, ${senderId}, ${amount}, 'pending', ${desc}, NOW());
        `;

        return true;

    } catch (e) {
        console.error("Error inserting money request:", e);
        return false;
    }
};

import { fetchWalletbyUser } from "./wallet";
import { sendMoneyById } from "./transactions";

export const acceptMoneyRequest = async (id: string, sender_id: string, receiver_id: string, amount: number) => {
    try {
        const wallet = await fetchWalletbyUser(receiver_id);

        if (!wallet || wallet.balance < amount) {
            console.log("Insufficient balance or wallet not found.");
            return false;
        }

        // Delete money request
        const req: { id: string; receiver_id: string; sender_id: string; amount: number; status: string; desc: string; request_date: string }[] = await db.$queryRaw`
        DELETE FROM "MoneyRequest"
        WHERE id = ${id}
        RETURNING *;
        `;

        if (req.length === 0) {
            console.log("No money request found.");
            return false;
        }

        // Perform the money transfer
        const transaction = await sendMoneyById(receiver_id, sender_id, amount, "From Money Request");

        if (!transaction) {
            return false;
        }

        return true;

    } catch (e) {
        console.error("Error accepting money request:", e);
        return false;
    }
};

export const cancelMoneyRequest = async (id: string) => {
    try {
        await db.$queryRaw`
        UPDATE "MoneyRequest"
        SET status = 'deleted'
        WHERE id = ${id};
        `;

        return true;

    } catch (e) {
        console.error("Error cancelling money request:", e);
        return false;
    }
};
