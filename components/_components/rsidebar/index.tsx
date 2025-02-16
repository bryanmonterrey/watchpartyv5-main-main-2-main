import React from 'react'
import { Wrapper } from './wrapper'
import { OnToggle } from './toggle'
import ChatPage from '@/app/(dashboard)/dashboard/[username]/chat/page'

const RSidebar = () => {
  return (
    <Wrapper >
        <OnToggle />
        <ChatPage />
        <div className='absolute flex px-9 flex-col items-center justify-center mr-auto bottom-2'>
        <div className='flex items-center mr-2 justify-end gap-x-3 '>
        </div>
        </div>
    </Wrapper>
  )
}

export default RSidebar