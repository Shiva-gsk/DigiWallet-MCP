import ResetInput from '@/components/reset-password/ResetInput';
import React, { Suspense } from 'react'

interface Props {
  params: Promise<{ resetToken: string }>
}

const ResetPassword =async ({ params }: Props) => {
  const {resetToken} = await params;

  return (
    <div className='container mx-auto flex h-screen items-center justify-center'>

    <Suspense fallback={<div>Loading...</div>}>
        <ResetInput resetToken={resetToken} />
    </Suspense>
    </div>
  )
}

export default ResetPassword