import { fetchUserbyId } from "@/app/actions/getUser";

import { EmailTemplate } from "@/components/resend/reset-link";
import { Resend } from "resend";

export async function POST(req:Request) {
  const { userId } = await req.json();

  if (!userId) {
    return new Response('Error: Missing user ID', {
      status: 400,
    });
  }

  const randomString = Math.random().toString(36).substring(2, 12); // Generate a random string
  const resend = new Resend(process.env.RESEND_API_KEY);
  const user = await fetchUserbyId(userId);
    try {
        if (!user) {
          return false;
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
          //   return Response.json({ error }, { status: 500 });
          console.log(error);
          console.log(data);
        }
  
        // return Response.json(data);
      } catch (error) {
        // return Response.json({ error }, { status: 500 });
        console.log(error);
      }
  
  console.log(`Reset password request received for user ID: ${userId}`);

  return new Response('Password reset request processed successfully', {
    status: 200,
  });
}