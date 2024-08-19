"use client"
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm'
import { ArrowLeft, Share, Share2Icon, ShareIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FormUi from '../_components/FormUi'
import React, { use, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Controller from '../_components/Controller'
import { Button } from '@/components/ui/button'
import { SquareArrowOutUpRight } from 'lucide-react'
import Link from 'next/link'


function EditForm({ params }) {
  const { user } = useUser();
  const [jsonform, setjsonForm] = useState([]);
  const router = useRouter()
  const [updateTrigger, setUpdateTrigger] = useState();
  const [record, setRecord] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedBackground, setSelectedBackground] = useState();
  useEffect(() => {
    user && GetFormData();
  }, [user])
  const GetFormData = async () => {
    const result = await db.select().from(JsonForms)
      .where(and(eq(JsonForms.id, params?.formId),
        eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))
    setRecord(result[0])
    console.log(JSON.parse(result[0].jsonform));
    
    setjsonForm(JSON.parse(result[0].jsonform))
    setSelectedBackground((result[0].background))
  }
  useEffect(() => {
    if (updateTrigger) {

      setjsonForm(jsonform)
      updateJsonFormInDb();

    }
  }, [updateTrigger])

  const onFieldUpdate = (value, index) => {
    jsonform.fields[index].label = value.label;
    jsonform.fields[index].placeholder = value.placeholder;
    setUpdateTrigger(Date.now())



  }

  const updateJsonFormInDb = async () => {
    const result = await db.update(JsonForms)
      .set({
        jsonform: jsonform
      }).where(and(eq(JsonForms.id, record.id),
        eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))
    toast('updated successfully')
    console.log(result);

  }

  const deleteField = (indexToRemove) => {
    const result = jsonform.fields.filter((item, index) => index != indexToRemove)
    console.log(result);
    jsonform.fields = result;
    setUpdateTrigger(Date.now())



  }

  const updateControllerFields = async (value, columnName) => {
    const result = await db.update(JsonForms).set({
      [columnName]: value
    }).where(and(eq(JsonForms.id, record.id),
      eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))
    toast('updated successfully')
  }
  return (
    <div className='p-10'>
      <div className='flex justify-between items-center'>

        <h2 className='flex gap-2 items-center my-5 cursor-pointer hover:font-bold
        ' onClick={() => router.back()}>
          <ArrowLeft /> back
        </h2>
        <div className='flex gap-2'>

          <Link href={'/aiform/' + record?.id} target='_blank'>
            <Button className='flex gap-2 bg-primary hover:bg-blue-600'>
              <SquareArrowOutUpRight className='h-5 w-5' /> Live Preview
            </Button>
          </Link>

          <Button className='flex gap-2 bg-green-500 hover:bg-green-400'><ShareIcon className='h-5 w-5' /> Share</Button>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <div className='p-5 border rounded-lg shadow-md'>
          <Controller
            selectedTheme={(value) => {
              updateControllerFields(value, 'theme')
              setSelectedTheme(value)
            }}
            selectedBackground={(value) => {
              updateControllerFields(value, 'background')
              setSelectedBackground(value)
            }
            }
          />
        </div>
        <div className='md:col-span-2 border rounded-lg p-5 
         flex items-center justify-center'
          style={{
            backgroundImage: selectedBackground
          }}
        >
          <FormUi jsonform={jsonform}
            onFieldUpdate={onFieldUpdate}
            deleteField={(index) => deleteField(index)}
            selectedTheme={selectedTheme}
          />
        </div>
      </div>
    </div>
  )
}

export default EditForm
