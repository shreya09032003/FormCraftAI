import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import GradientBg from '@/app/_data/GradientBg';
import Themes from '@/app/_data/Themes';
import { Button } from '@/components/ui/button';

function Controller({ selectedTheme, selectedBackground }) {
    // Correctly destructure the useState return value
    const [showMore, setShowMore] = useState(6);

    return (
        <div>
            {/* Theme selection Controller */}
            <h2 className='my-1'>Themes</h2>
            <Select onValueChange={(value) => selectedTheme(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    {Themes.map((theme, index) => (
                        <SelectItem value={theme.theme} key={index}>
                            <div className='flex gap-3'>
                                <div className='flex'>
                                    <div
                                        className='h-5 w-5 rounded-l-md'
                                        style={{ backgroundColor: theme.primary }}
                                    ></div>
                                    <div
                                        className='h-5 w-5'
                                        style={{ backgroundColor: theme.secondary }}
                                    ></div>
                                    <div
                                        className='h-5 w-5'
                                        style={{ backgroundColor: theme.accent }}
                                    ></div>
                                    <div
                                        className='h-5 w-5 rounded-r-md'
                                        style={{ backgroundColor: theme.neutral }}
                                    ></div>
                                </div>
                                <span>{theme.theme}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Background selection controller */}
            <h2 className='mt-8 my-1'>Background</h2>
            <div className='grid grid-cols-3 gap-5'>
                {GradientBg.map((bg, index) => (
                    index < showMore && (
                        <div
                            key={index}
                            onClick={()=>selectedBackground(bg.gradient)}
                            className='w-full h-[70px] rounded-lg cursor-pointer
                            hover:border-primary hover:border-2 flex items-center justify-center'
                            style={{ background: bg.gradient }}
                        >
                            {index === 0 && 'None'}
                        </div>
                    )
                ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full my-2"
                onClick={() => setShowMore(showMore>6?6:20)}
            >
                {showMore>6?'Show Less':'Show More'}
               
            </Button>
        </div>
    );
}

export default Controller;
