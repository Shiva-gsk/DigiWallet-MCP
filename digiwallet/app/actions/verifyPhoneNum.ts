// app/actions/updatePhone.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'



export async function updatePhoneNumber(userId: string, newPhoneNumber: string) {
  try {
    // Validate the input
    if (!userId || !newPhoneNumber) {
      return { success: false, message: 'User ID and phone number are required' }
    }
    
    // Update the user's phone number in the database
    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        phoneNum: newPhoneNumber,
      },
    })
    
    // Revalidate the path to refresh the data
    revalidatePath('/')
    
    return { 
      success: true, 
      message: 'Phone number updated successfully',
      user: updatedUser
    }
  } catch (error) {
    console.error('Failed to update phone number:', error)
    return { 
      success: false, 
      message: 'Failed to update phone number' 
    }
  }
}