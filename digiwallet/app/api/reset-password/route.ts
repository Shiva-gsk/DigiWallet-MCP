import { fetchUserbyId } from "@/app/actions/getUser";
import { db } from "@/lib/db";

import { EmailTemplate } from "@/components/resend/reset-link";
import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  const { userId } = await req.json();

  if (!userId) {
    return new Response('Error: Missing user ID', {
      status: 400,
    });
  }
  const randomString = Math.random().toString(36).substring(2, 12); // Generate a random string
  try{
    const userExists = await db.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return new Response('Error: User not found', {
        status: 404,
      });
    }
    db.user.update({
      where: { id: userId },
      data: { resetToken: randomString }, 
    });
  }
  catch{
    return new Response('Error: Database query failed', {
      status: 500,
    });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const user = await fetchUserbyId(userId);
    try {
        if (!user) {
          return new Response('Error: User not found', {
            status: 404,
          });
        }

        const { data, error } = await resend.emails.send({
          from: "DigiWallet <noreply@shivagulapala.me>",
            to: [user?.email],
          // to: "shivakumargulapala2005@gmail.com",
          subject: "Reset Password Request",
          react: await EmailTemplate({
            sender: user?.username,
            resetToken: randomString,
          }),
        });
  
        if (error) {
            console.log(error);
            console.log(data);
            return Response.json({ error }, { status: 500 });
        }
  
        // return Response.json(data);
      } catch (error) {
        // return Response.json({ error }, { status: 500 });
        console.log(error);
        return new Response('Error sending email', {
          status: 500,
        });
      }

  console.log(`Reset password request received for user ID: ${userId}`);

  return new NextResponse('Password reset request processed successfully', {
    status: 200,
  });
}