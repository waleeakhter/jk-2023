"use client"
import { ProgressSpinner } from 'primereact/progressspinner'
import React from 'react'

interface Props {

}

const Loading = (props: Props) => {
    return (
        <div className=' text-center h-screen flex items-center justify-center w-full'>
            <div className=' text-white '>
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="5" fill="var(--surface-ground)" animationDuration=".5s" />
            </div>
        </div>
    )
}

export default Loading
