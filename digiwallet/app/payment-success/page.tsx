"use client"
import Loading from '@/components/loading'
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'


const Page = () => {
  const searchParams = useSearchParams()
  const amount = searchParams.get('amount')

    useEffect(()=>{
      if(amount){
        // Fetch payment status or any other data related to the payment
      }
    },[amount])
  return (
    <div>
        <Loading/>
    </div>
  )
}

export default Page