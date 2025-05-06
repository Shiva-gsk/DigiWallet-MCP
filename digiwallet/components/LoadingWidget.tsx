import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingWidget = () => {
  return (
    <div className="flex justify-center items-center h-full">
    <Loader2 className="animate-spin" size={48} color="#4F46E5" />
  </div>
  )
}

export default LoadingWidget
