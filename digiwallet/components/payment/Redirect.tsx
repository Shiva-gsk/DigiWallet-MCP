"use client"
import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
const Redirect = () => {
    const router = useRouter();
    useEffect(() => {
    console.log("Redirecting to wallet page...");
    toast.success("Payment successful");

    const timeout = setTimeout(() => {
      router.replace("/wallet");
    }, 3000);

    return () => clearTimeout(timeout); 
  }, [router]);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Redirecting to wallet page... in 3 seconds
    </div>
  )
}

export default Redirect