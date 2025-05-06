'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function toggleWalletActive(walletId: string, userId: string) {
  try {
    // First, get the current wallet to determine its current status
    const wallet = await db.wallet.findUnique({
      where: { id: walletId },
      select: { isActive: true }
    })

    if (!wallet) {
      return { 
        success: false, 
        message: "Wallet not found" 
      }
    }

    // Update the wallet by toggling the isActive field
    const updatedWallet = await db.wallet.update({
      where: { id: walletId },
      data: { isActive: !wallet.isActive }
    })

    // Revalidate the page to show updated data
    revalidatePath('/admin/users/')
    revalidatePath(`/admin/users/${userId}`)

    return { 
      success: true, 
      message: `Wallet ${updatedWallet.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: updatedWallet.isActive
    }
  } catch (error) {
    console.error('Error toggling wallet status:', error)
    return { 
      success: false, 
      message: "Failed to update wallet status" 
    }
  }
}