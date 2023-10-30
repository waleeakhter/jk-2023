"use client"
import { Spin } from 'antd'
import React from 'react'

interface Props {

}

const Loading = (props: Props) => {
    return (
        <div className=' text-center h-screen flex items-center justify-center w-full'>
            <div className=' text-white '>
                <Spin size="large" />
            </div>
        </div>
    )
}

export default Loading
