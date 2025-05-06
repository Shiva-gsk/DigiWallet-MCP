"use server"
import { db } from "../../lib/db";

export const fetchUserbyName = async (name: string) => {
    try{
        const user = await db.user.findFirst({
            where:{
                name
            }
        });
        return user;
    }
    catch{
        return null;
    }
};

export const fetchUserbyEmail = async (email: string | undefined) => {
    if(!email) return null;
    try{
        const user = await db.user.findFirst({
            where:{
                email
            }
        });
        return user;
    }
    catch{
        return null;
    }
};
export const fetchUserbyId = async (id: string) => {
    try{
        const user = await db.user.findFirst({
            where:{
                id
            }
        });
        return user;
    }
    catch{
        return null;
    }
};

export const fetchAllUsers = async () => {
    try{
        const user = await db.user.findMany(
            
        );
        return user;
    }
    catch{
        console.log("error");
        return null;
    }
};
export const fetchAllUsersWithWallet = async () => {
    try{
        const user = await db.user.findMany(
            {
                include:{
                    user_wallet:{
                        select:{
                            isActive: true,
                            balance: true,
                            updatedAt: true
                        }
                    }
                }
            }
        );
        // console.log(user)
        return user;
    }
    catch{
        console.log("error");
        return null;
    }
};
export const fetchUserWithWallet = async (id:string) => {
    try{
        const user = await db.user.findFirst(
            {
                where:{
                    id
                },
                include:{
                    user_wallet:{
                        select:{
                            isActive: true,
                            balance: true,
                            updatedAt: true
                        }
                    }
                }
            }
        );
        // console.log(user)
        return user;
    }
    catch{
        console.log("error");
        return null;
    }
};


