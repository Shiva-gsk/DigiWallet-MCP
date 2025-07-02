import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
// import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    if(eventType === 'user.created') {
      // Handle user creation event
      const userId = evt.data.id
      const wallet = await db.wallet.create({
        data: {
          id: Math.random().toString(36).substring(7),
          balance: 0,
        },
      });
  
      const walletId = wallet.id;
      // Hash the password
      // const hashedPassword = await bcrypt.hash('1234', 10); // Default password
      await db.user.create({
        data: {
          id: userId,
          email: evt.data.email_addresses[0]?.email_address || '',
          name: evt.data.first_name || '',
          username: evt.data.username || '',
          phoneNum: evt.data.phone_numbers[0]?.phone_number || '',
          wallet_id: walletId,
          password: 1234,
        },
      })
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}