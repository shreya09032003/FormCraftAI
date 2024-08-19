"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { chatSession } from '@/configs/AiModal'
import { useUser } from '@clerk/nextjs'
import { JsonForms } from '@/configs/schema'
import { db } from '@/configs/index'
import moment from 'moment';
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const PROMPT =",  Provide only the JSON code without any additional formatting like backticks or descriptions with the form title (formTitle), form subheading(formSubheading), form fields(fields), form name(formName), placeholders, form labels, field types(radio type with values and labels), and whether the fields are required.."

function CreateForm() {
    const [openDialog, setOpenDialog] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const route = useRouter();

    const cleanJsonString = (jsonString) => {
        // Remove backticks and markdown
        return jsonString.replace(/^```json|```$/g, '').trim();
    }

    const onCreateForm = async () => {
        setLoading(true);
        try {
            const result = await chatSession.sendMessage("Description:" + userInput + PROMPT);
            let jsonResponse = result.response?.text();

            console.log("API Response:", jsonResponse); // Log the response for debugging

            if (jsonResponse) {
                const cleanedJson = cleanJsonString(jsonResponse);
                console.log("Cleaned JSON:", cleanedJson); // Log the cleaned JSON for debugging

                // Parse JSON
                let parsedJson;
                try {
                    parsedJson = JSON.parse(cleanedJson);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    throw new Error("Invalid JSON format.");
                }
                const resp = await db.insert(JsonForms).values({
                    jsonform : JSON.stringify(parsedJson),
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD/MM/YYYY')
                }).returning({ id: JsonForms.id });

                console.log("NEW FORM ID", resp[0].id);
                if (resp[0].id) {
                    route.push('/edit-form/' + resp[0].id);
                    setOpenDialog(false);
                }
            } else {
                console.error("Error: No JSON response received.");
            }
        } catch (error) {
            console.error("Error creating form:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Form</DialogTitle>
                        <DialogDescription>
                            <Textarea
                                className="my-2"
                                value={userInput}
                                onChange={(event) => setUserInput(event.target.value)}
                                placeholder="Write a description of your form"
                            />
                            <div className='flex gap-2 my-3 justify-end'>
                                <Button onClick={() => setOpenDialog(false)} variant="destructive">
                                    Cancel
                                </Button>
                                <Button
                                    disabled={loading}
                                    onClick={onCreateForm}
                                >
                                    {loading ? <Loader2 className='animate-spin' /> : 'Create'}
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateForm
