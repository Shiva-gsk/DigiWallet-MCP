// import { useSearchParams } from 'next/navigation'
// "use client"
import React from 'react'
import { SetPassword } from '../setPassword';

const ResetInput = ({ resetToken }: { resetToken: string }) => {

  console.log("Reset Token:", resetToken);
  return (
    // <div>ResetInput</div>
    <SetPassword resetToken={resetToken}>Set Password</SetPassword>
  )
}

export default ResetInput