"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { SignedIn, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link';
import { usePathname } from 'next/navigation'

function header() {
  const { user, isSignedIn } = useUser();
  const path=usePathname();
  useEffect(()=>{
    console.log(path);
    
  })
  return !path.includes('aiform') && (
    <div className='p-5 border-b shadow-sm'>
      <div className='flex items-center justify-between'>
        <Image src={'/logo.svg'} width={50} height={50} />
        {isSignedIn ?
          <div className='flex items-center gap-5'>
            <Link href={'/dashboard'}>
            <Button variant="outline">Dashboard</Button>
            </Link>
            <UserButton />
          </div> :
          <SignInButton>
          <Button >
            Get started
          </Button>
          </SignInButton> 

        }

      </div>
    </div>
  )
}

export default header