"use server"
import { db } from "../../lib/db";

export const fetchWalletbyUser = async (id: string) => {
    try{
        const user = await db.user.findFirst({
            where:{
                id: id
            },
            select:{wallet_id: true}
        });
        if(!user || !user.wallet_id){
            return null;
        }
        const wallet = await db.wallet.findFirst({
            where:{
                id: user?.wallet_id
            }
        });
        
        return wallet;
    }
    
    catch{
        return null;
    }
};
export const fetchWalletbyUserEmail = async (email: string) => {
    try{
        const user = await db.user.findFirst({
            where:{
                email
            },
            select:{wallet_id: true}
        });
        if(!user || !user.wallet_id){
            return null;
        }
        const wallet = await db.wallet.findFirst({
            where:{
                id: user?.wallet_id
            }
        });
        
        return wallet;
    }
    
    catch{
        return null;
    }
};

export const fetchWalletbyUserRaw = async (id: string) => {
    try{
        
        const u: { wallet_id: string }[] = await db.$queryRaw`SELECT wallet_id FROM "User" WHERE id = ${id}`;
        console.log(u);
        const w: { [key: string]: unknown }[] = await db.$queryRaw`SELECT * FROM "Wallet" WHERE id = ${u[0].wallet_id}`;
        // console.log(w);
        return w[0];
    }
    catch{
        return null;
    }
};

