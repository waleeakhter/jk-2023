'use client';
import { Dialog } from 'primereact/dialog'
import React from 'react'

type Props = {}

const AddModal = (
    {
        children,
        visible,
        setVisible,
    }: {
        children: React.ReactNode,
        visible: boolean,
        setVisible: Function
    }
) => {
    return (
        <Dialog closeOnEscape={false} header="Header" visible={visible} style={{ width: '80vw' }} onHide={() => setVisible(false)}>
            {visible ? children : ""}
        </Dialog>
    )
}

export default AddModal