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
        <Modal title={<p className=' capitalize '>{heading}</p> ?? ""} open={visible} style={{ width: '80vw' }} onCancel={() => setVisible(false)}>
            {children}
        </Modal>
    )
}

export default AddModal