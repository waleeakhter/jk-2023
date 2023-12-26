import React from 'react'
import DashboardLayout from '../components/WebLayout'
import SaleChart from '../components/SaleChart'

type Props = {}

const Dashboard = (props: Props) => {
    return (
        <DashboardLayout>
            <SaleChart />
        </DashboardLayout>
    )
}

export default Dashboard