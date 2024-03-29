'use client';
import { Modal } from 'antd'
import React from 'react'

type Props = {}

const AddModal = (
    {
        children,
        visible,
        setVisible,
        heading
    }: {
        children: React.ReactNode,
        visible: boolean,
        setVisible: Function,
        heading?: string | React.ReactNode,
    }
) => {
    return (
        <Modal footer="" styles={{content : {maxHeight : "85vh" , overflowY : "auto"}}} keyboard={false} destroyOnClose={true} centered className='w-[80%_!important]' title={<p className=' capitalize '>{heading}</p> ?? ""} open={visible} style={{ width: '80vw' }} onCancel={() => setVisible(false)}>
           <div className='mt-8'>
           {children}
           </div>
        </Modal>
    )
}

export default AddModal