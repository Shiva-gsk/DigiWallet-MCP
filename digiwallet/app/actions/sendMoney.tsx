"use server"
import { db } from "../../lib/db";
import { fetchUserbyId } from "./getUser";
import { fetchWalletbyUser } from "./getWallet";

import { EmailTemplate } from '@/components/resend/email-templates';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMoneyById = async(senderId: string, receiverId:string, amount:number, desc:string) => {
    const sendUser = await fetchUserbyId(senderId);
    const receiveUser = await fetchUserbyId(receiverId);
    const sender = await fetchWalletbyUser(senderId);
    const receiver = await fetchWalletbyUser(receiverId);

    if(!sender || !receiver){
        return false;
    }
    if(!sender.isActive || !receiver.isActive){
        return false;
    }
    if(senderId === receiverId){
        return false;
    }
    if(sender.balance < amount){
        return false;
    }
    // console.log(sender);
    // console.log(receiver);
    try{
        await db.wallet.update({
            where: {id:sender.id},
            data: {balance: {decrement: amount}}
        })
        await db.wallet.update({
            where: {id:receiver.id},
            data: {balance: {increment: amount}}
        })

        await db.transaction.create({
            data: {
                status: "completed",
                amount,
                sender: {connect: {id: senderId}},
                receiver: {connect: {id: receiverId}},
                desc
            }
        })

        await db.notification.create({
            data:{
                message: `You have received $${amount} from ${sendUser?.username}`,
                userId: receiverId,
                type: "transaction",
                is_read: false,
            }
        })

        await db.notification.create({
            data:{
                message: `You sent $${amount} to ${receiveUser?.username}`,
                userId: senderId,
                type: "transaction",
                is_read: false,
            }
        });

        await db.activityLog.create({
            data:{
                details: `You sent $${amount} to ${receiveUser?.username}`,
                userId: senderId,
                activity_type: "transaction",
            }
        });

        try {
            if(!sendUser || !receiveUser){
                return false;
            }
            const { data, error } = await resend.emails.send({
              from: 'DigiWallet <noreply@resend.dev>',
            //   to: [receiveUser?.email],
                to: "shivakumargulapala2005@gmail.com",
              subject: 'Hello world',
              react: await EmailTemplate({ sender: sendUser?.username, receiver: receiveUser?.username, amount }),
            });
        
            if (error) {
            //   return Response.json({ error }, { status: 500 });
            console.log(error);
            console.log(data);
            }
        
            // return Response.json(data);
          } catch (error) {
            // return Response.json({ error }, { status: 500 });
            console.log(error);
          }
        
        return true;
    }
    catch(e){
        await db.transaction.create({
            data: {
                status: "failed",
                amount,
                desc,
                sender: {connect: {id: senderId}},
                receiver: {connect: {id: receiverId}}
            }
        })
        console.log(e);
        return false;
    }
}