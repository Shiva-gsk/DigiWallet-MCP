import ResetInput from '@/components/reset-password/ResetInput';
import React, { Suspense } from 'react'

interface Props {
  params: Promise<{ resetToken: string }>
}

const ResetPassword =async ({ params }: Props) => {
  const {resetToken} = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ResetInput resetToken={resetToken} />
    </Suspense>
  )
}

export default ResetPassword