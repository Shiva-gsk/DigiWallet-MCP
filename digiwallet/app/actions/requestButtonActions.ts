"use server"
import { db } from "../../lib/db";
import { fetchWalletbyUser } from "./getWallet";
import { sendMoneyById } from "./sendMoney";

export const acceptMoneyRequest = async (id: string, sender_id: string, receiver_id: string, amount:number) => {
    // console.log(1);
    try{
        const wallet = await fetchWalletbyUser(receiver_id);
        // console.log(sender_id);
        // console.log(wallet?.balance);
        if(!wallet || wallet.balance < amount){
            console.log(1);
            return false;
        }
        const req = await db.moneyRequest.delete({
            where:{
                id
            }
        });
        
        if(!req){
            return false;
        }
        const transaction = await sendMoneyById( receiver_id, sender_id, amount, "From Money Request");
        
        if(!transaction){
            return false;
        }
        return true;
        
        // console.log(1);
    }
    catch(e){
        console.log(e);
        return false;
    }
}

export const cancelMoneyRequest = async (id: string) => {
    try{
        await db.moneyRequest.update({
            where:{
                id
            },
            data:{
                status: "deleted"
            }
        });

        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}