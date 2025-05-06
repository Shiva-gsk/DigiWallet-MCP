"use server"
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const syncUsers = async () => {
    const Users = await clerkClient();
    const list = await Users.users.getUserList();
    // console.log(list);
    const arr = list["data"];

    // for (const user of arr) {
    //   const w_id = Math.random().toString(36).substring(7);
    //   await db.user.upsert({
    //     where: { id: user.id },
    //     update: {},
    //     create: {
    //       id: user.id,
    //       email: user.emailAddresses[0]?.emailAddress || "",
    //       name: user.firstName,
    //       username: user.username || "",
    //       phoneNum: user.phoneNumbers[0]?.phoneNumber || "",
    //       wallet_id: w_id,

    //     },
    //   });

    //   await db.wallet.upsert({
    //     where: { id: w_id },
    //     update: {},
    //     create: {
    //       id: w_id,
    //       balance: 0,
    //     },
    //   });
    // }
    for (const user of arr) {
      // Check if the user already exists
      const existingUser = await db.user.findUnique({
        where: { id: user.id },
        select: { wallet_id: true },
      });
  
      let walletId = existingUser?.wallet_id;
  
      if (!walletId) {
        // Create a Wallet first before linking it to the User
        const wallet = await db.wallet.create({
          data: {
            id: Math.random().toString(36).substring(7),
            balance: 0,
          },
        });
  
        walletId = wallet.id;
      }
  
      // Now create or update the User with the correct wallet_id
      await db.user.  upsert({
        where: { id: user.id },
        update: {
          wallet_id: walletId, // Ensure the wallet_id is set correctly
        },
        create: {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress || "",
          name: user.firstName || "",
          username: user.username || "",
          phoneNum: user.phoneNumbers[0]?.phoneNumber || "",
          wallet_id: walletId,
          password: 1234,
        },
      });
    }
  };

