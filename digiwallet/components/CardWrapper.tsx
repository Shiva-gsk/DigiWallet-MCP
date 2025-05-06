import { Card } from '@/components/ui/card_ui'
import React from 'react'


interface CardWrapperProps {
  children: React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ children }) => {
  return (
    <Card className='p-0 min-w-[200px] min-h-[150px] flex bg-white rounded-lg shadow-md justify-center items-center hover:scale-110 transition duration-300'>
        {children}
    </Card>
  )
}

export default CardWrapper
