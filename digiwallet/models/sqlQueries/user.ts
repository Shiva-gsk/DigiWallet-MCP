"use server"
import { db } from "@/lib/db";
import { UserType } from "@/types";

// Fetch User by Name
export const fetchUserbyName = async (name: string) => {
    try {
        const user:UserType[] = await db.$queryRaw`
        SELECT * FROM "User"
        WHERE "name" = ${name}
        LIMIT 1;
        `;
        return user[0] || null;  
    } catch {
        return null;
    }
};

// Fetch User by Email
export const fetchUserbyEmail = async (email: string | undefined) => {
    if (!email) return null;
    try {
        const user:UserType[] = await db.$queryRaw`
        SELECT * FROM "User"
        WHERE "email" = ${email}
        LIMIT 1;
        `;
        return user[0] || null;
    } catch {
        return null;
    }
};

// Fetch User by ID
export const fetchUserbyId = async (id: string) => {
    try {
        const user:UserType[] = await db.$queryRaw`
        SELECT * FROM "User"
        WHERE "id" = ${id}
        LIMIT 1;
        `;
        return user[0] || null;
    } catch {
        return null;
    }
};

// Fetch All Users
export const fetchAllUsers = async () => {
    try {
        const users:UserType[] = await db.$queryRaw`
        SELECT * FROM "User";
        `;
        return users;
    } catch {
        console.log("error");
        return null;
    }
};

// Fetch All Users with Wallet
export const fetchAllUsersWithWallet = async () => {
    try {
        const users:UserType[] = await db.$queryRaw`
        SELECT 
            u.*, 
            w."isActive", 
            w."balance", 
            w."updatedAt"
        FROM "User" u
        LEFT JOIN "Wallet" w ON u.wallet_id = w.id;
        `;
        return users;
    } catch {
        console.log("error");
        return null;
    }
};

// Fetch User with Wallet by ID
export const fetchUserWithWallet = async (id: string) => {
    try {
        const user:UserType[] = await db.$queryRaw`
        SELECT 
            u.*, 
            w."isActive", 
            w."balance", 
            w."updatedAt"
        FROM "User" u
        LEFT JOIN "Wallet" w ON u.wallet_id = w.id
        WHERE u.id = ${id}
        LIMIT 1;
        `;
        return user[0] || null;
    } catch {
        console.log("error");
        return null;
    }
};



export const changePassword = async (email: string, password: number) => {
    try {
        await db.$queryRaw`
        UPDATE "User"
        SET "password" = ${password}, "updatedAt" = NOW()
        WHERE "email" = ${email};
        `;

        return { success: true, message: "Password Changed Successfully" };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Something went wrong! Try Later" };
    }
};


export const fetchActivities = async (id: string) => {
    try {
        const activities = await db.$queryRaw`
        SELECT * 
        FROM "ActivityLog"
        WHERE "userId" = ${id}
        ORDER BY "timestamp" DESC;
        `;

        // console.log(activities);
        return activities;

    } catch (e) {
        console.error(e);
        return null;
    }
};
