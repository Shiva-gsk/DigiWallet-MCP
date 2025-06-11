"use client"
import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
const Redirect = () => {
    const router = useRouter();
    console.log("Redirecting to wallet page...");
    useEffect(()=>{
        const fn = async ()=>{
            setTimeout(()=>{
                router.replace("/wallet");
            }, 5000);
        } 
        fn();
    }, [router])
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Redirecting to wallet page... in 5 seconds
    </div>
  )
}

export default Redirect