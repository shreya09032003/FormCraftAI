import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import FieldEdit from './FieldEdit'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Checkbox } from "@/components/ui/checkbox"

function FormUi({ jsonform, onFieldUpdate, deleteField, selectedTheme, editable = true }) {

  const [formData, setFormData] = useState({});


  const handleInputChange = (event) => {
    const { name, value } = event.target;
   console.log(name,value);
   
    setFormData({
      ...formData,
      [name]: value
    })
  }


  const handleSelectChange=(name,value)=>{
    
    setFormData({
      ...formData,
      [name]: value
    })
  }
  const onFormSubmit = (event) => {

    event.preventDefault()
    console.log(formData);

  }
  return (

    <form
      onSubmit={onFormSubmit}
      className='border p-5 md:w-[600px] rounded-lg' data-theme={selectedTheme}>
      <h2 className='font-bold text-center text-2xl'>{jsonform?.formTitle}</h2>
      <h2 className='text-sm text-gray-400 text-center'>{jsonform?.formSubheading}</h2>
      {jsonform?.fields?.length > 0 ? (
        jsonform.fields.map((field, index) => (
          <div key={index} className='flex items-center gap-2'>
            {field.type === 'select' ? (
              <div className='my-3 w-full'>
                <label className='text-xs text-gray-500'>{field.label}</label>
                <Select 
                required={field?.required} 
                onValueChange={(v)=>handleSelectChange(field.label,v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((item, idx) => (
                      <SelectItem key={idx} value={item.label}>{item.label}</SelectItem> // Render label, not the entire object
                    ))}
                  </SelectContent>
                </Select>
              </div>

            ) : field.type === 'radio' ? (
              <div className='my-3 w-full'>
                <label className='text-xs text-gray-500'>{field.label}</label>
                <RadioGroup
                 required={field?.required}>
                  {field?.options?.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <RadioGroupItem value={item.value} id={item.label}
                                       onClick={()=>handleSelectChange(field.label,item.label)}
                                       />
                      <Label htmlFor={item.label}>{item.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : field.type === 'checkbox' ? (
              <div className='my-3 w-full'>
                <label className='text-xs text-gray-500'>{field.label}</label>
                <div>
                  <h2>
                    {field?.options ? field?.options?.map((item, idx) => (
                      <div key={idx} className='my-2 flex items-center space-x-2 gap-2'>
                        <Checkbox />
                        <Label htmlFor={item.label}>{item.label}</Label>
                      </div>
                    ))
                      :
                      <div className='flex gap-2 items-center'>

                        <Checkbox />
                        <Label>{field.label}</Label>
                      </div>
                    }
                  </h2>
                </div>
              </div>
            )
              : (
                <div className='my-3 w-full' >
                  <label className='text-xs text-gray-500'>{field.label}</label>
                  <Input type={field?.type}
                    placeholder={field.placeholder}
                    name={field.name}
                    required={field?.required}
                    onChange={(e) => handleInputChange(e)} />
                </div>


              )}
            {editable && <div>
              <FieldEdit defaultValue={field} onUpdate={(value) => {
                onFieldUpdate(value, index);
              }}
                deleteField={() => deleteField(index)}
              />
            </div>}
          </div>
        ))
      ) : (
        <p>No fields to display</p>
      )}
      <button
        type='submit'
        className='btn btn-primary' style={{ display: 'block', margin: '0 auto' }}>Submit</button>
    </form>
  )
}

export default FormUi