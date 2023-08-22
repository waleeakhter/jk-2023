import AdvanceSelect from '@/app/components/AdvanceSelect'
import React from 'react'
import { getClients } from '../SaleActions/ServerActions';

interface Props {
    setFieldValue?: Function
}

const ClientSelect = async ({ setFieldValue }: Props) => {
    const clientsData = await getClients();
    return (
        <AdvanceSelect name={"client"} value={"name"} lableValue={"name"} options={clientsData} setFieldValue={setFieldValue ?? Function} />
    )
}

export default ClientSelect
