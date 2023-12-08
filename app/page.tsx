import React from 'react'
import { redirect } from 'next/navigation'
import { auth } from './auth'
import SaleChart from './Dashboard/SaleChart'
import { getMonthlySalesAndProfit } from './Dashboard/ServerActions'

const Home = async () => {
  const session = await auth()
  if (!session?.user?.email) {
    return redirect('/api/auth/signin')
  }

  return (
    <>
      <h1>{JSON.stringify(session, null, 2)}</h1>
      <SaleChart />
    </>
  )
}

export default Home