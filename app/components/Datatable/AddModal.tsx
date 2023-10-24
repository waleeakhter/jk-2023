'use client';
import { Dialog } from 'primereact/dialog'
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
        <Dialog closeOnEscape={false} header={heading ?? ""} visible={visible} style={{ width: '80vw' }} onHide={() => setVisible(false)}>
            {children}
        </Dialog>
    )
}

export default AddModal