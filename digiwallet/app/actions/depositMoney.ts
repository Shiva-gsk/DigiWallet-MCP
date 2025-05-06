"use server"

import { db } from "../../lib/db";
import { fetchUserbyEmail } from "./getUser";
import { fetchWalletbyUserEmail } from "./getWallet"

export const depositMoney = async (email: string, amount:number) =>{
    const sendUser = await fetchUserbyEmail(email);
    const sender = await fetchWalletbyUserEmail(email);

    if(!sender || !sendUser){
        return false;
    }

      try{
            await db.wallet.update({
                where: {id:sender.id},
                data: {balance: {increment: amount}}
            })

            await db.deposit.create({
                data: {
                    amount: amount,
                    walletId: sender.id,
                    status: "success",

                }
            })
            await db.activityLog.create({
                data:{
                    userId: sendUser?.id,
                    activity_type: "Deposit",
                    details: `Deposited ${amount} Rs.`
                }
            })
            return true;
        }
        catch{
            await db.deposit.create({
                data: {
                    amount: amount,
                    walletId: sender.id,
                    status: "Failed",
    
                }
            })

            return false;
        }
}

export const withdrawMoney = async (email: string, amount:number) =>{
    const sender = await fetchWalletbyUserEmail(email);
    const sendUser = await fetchUserbyEmail(email);
    if(!sender || sender.balance < amount){
        return {success: false, message: "Insufficient Balance"};
    }
    if(!sendUser){
        return {success: false, message: "User not Found"};
    }
      try{
            await db.wallet.update({
                where: {id:sender.id},
                data: {balance: {decrement: amount}}
            })

            await db.withdrawal.create({
                data: {
                    amount: amount,
                    walletId: sender.id,
                    status: "success",
                    
                }
            })
            await db.activityLog.create({
                data:{
                    userId: sendUser?.id,
                    activity_type: "Withdrawal",
                    details: `Withdrawal of ${amount} Rs.`
                }
            })
            return {success: true, message: "Money Withdrawn Successfully"};
        }
        catch{
            await db.withdrawal.create({
                data: {
                    amount: amount,
                    walletId: sender.id,
                    status: "Failed",
    
                }
            })
            return {success: false, message: "Something went Wrong"};
        }
}