"use server"

import { db } from "../../lib/db"


export const getTransactions = async (email:string) =>{
    const user = await db.user.findFirst({
        where:{
            email: email
        }
    })
    if(!user) return null;
    const transactions =await db.transaction.findMany({
        where:{
            OR: [
                { sender_id: user.id },
                { receiver_id: user.id }
              ] 
        },
        include:{
            sender: {
                select: {
                    username: true,
                    email: true
                }
            },
            receiver: {
                select: {
                    username: true,
                    email: true
                }
            }
        }
    })
    // console.log(transactions);
    return transactions;
}

export const getTransactionsById = async (id:string) =>{
    const user = await db.user.findFirst({
        where:{
            id: id
        }
    })
    if(!user) return null;
    const transactions =await db.transaction.findMany({
        where:{
            OR: [
                { sender_id: user.id },
                { receiver_id: user.id }
              ] 
        },
        include:{
            sender: {
                select: {
                    username: true,
                    email: true
                }
            },
            receiver: {
                select: {
                    username: true,
                    email: true
                }
            }
        }
    })
    // console.log(transactions);
    return transactions;
}

export async function groupTransactionsByMonth() {
    const transactions = await db.transaction.findMany();
  
    const grouped = transactions.reduce((acc, txn) => {
      const month = txn.transaction_date.toDateString().slice(4, 8); // Extract YYYY-MM
      if (!acc[month]) acc[month] = [];
      acc[month].push(txn);
      return acc;
    }, {} as Record<string, typeof transactions>);
  
    return grouped;
  }
  
  
  