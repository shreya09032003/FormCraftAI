"use client"
import { JsonForms } from '@/configs/schema';
import {  eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { db } from '@/configs'
import FormUi from '@/app/edit-form/_components/FormUi'
import Image from 'next/image'
import Link from 'next/link'
function LiveAiForm({params}) {
    const [record,setRecord] = useState();
    const [jsonform, setjsonForm] = useState([]);

    useEffect(()=>{
        params&&GetFormData()
    },[params])

    const GetFormData=async()=>{
        const result = await db.select().from(JsonForms)
        .where(eq(JsonForms.id,Number(params?.formid)))
      setRecord(result[0])
      setjsonForm(JSON.parse(result[0].jsonform))
        console.log(result);
        
    }
  return (
    
    <div className='flex justify-center items-center min-h-screen' style={{ background: 'linear-gradient(to right, #ff9933, #66b3ff)' }}>
  <div>
    <FormUi 
      jsonform={jsonform}
      onFieldUpdate={()=>console.log}
      deleteField={()=>console.log}
      selectedTheme={record?.theme}
      editable={false}
    />
    <Link href={'/'} className='flex gap-2 items-center bg-black
     text-white px-3 py-1 rounded-full fixed bottom-5 left-5
     cursor-pointer'>
      <Image src={'/logo.png'} width={26} height={26} />
      Build your Ai form
    </Link>
  </div>
</div>

  )
}

export default LiveAiForm