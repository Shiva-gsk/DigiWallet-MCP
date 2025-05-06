"use server"

import { db } from "../../lib/db"

export const changePassword = async (email: string, password: number) => {
    try{
        await db.user.update({
            where: {
                email
            },
            data: {
                password
            }
        })
        return {success: true, message: "Password Changed Successfully"};
    }
    catch(e){
        console.error(e);
        return {success: false, message: "Something went wrong! Try Later"};
    }
}