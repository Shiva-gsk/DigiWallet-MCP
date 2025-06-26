"use server"

// import { redirect } from "next/navigation";
import { db } from "../../lib/db";
import { fetchUserbyEmail, fetchUserbyId } from "./getUser";
import { fetchWalletbyUser, fetchWalletbyUserEmail } from "./getWallet"

export const depositMoneyById = async (id: string, amount:number) =>{
    const sendUser = await fetchUserbyId(id);
    const sender = await fetchWalletbyUser(id);
    // console.log("Sender:", sender);

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
            // redirect("/wallet/");
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


export const depositMoney = async (email: string, amount:number) =>{
    const sendUser = await fetchUserbyEmail(email);
    const sender = await fetchWalletbyUserEmail(email);
    // console.log("Sender:", sender);

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
            // redirect("/wallet/");
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