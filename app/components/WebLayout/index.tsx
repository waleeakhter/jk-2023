import React from 'react'
import Header from '../Header'

type Props = {}

const WebLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <>
            {/* <Header /> */}
            <div className='p-8'>
                {children}
            </div>
        </>
    )
}

export default WebLayout