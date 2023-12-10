'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, AreaChart, Title, Text } from '@tremor/react';
import {getSaleAndProfit } from './ServerActions';
import { useState } from 'react';

// const data = [
//   {
//     Month: 'Jan 21',
//     Sales: 2890,
//     Profit: 2400
//   },
//   {
//     Month: 'Feb 21',
//     Sales: 1890,
//     Profit: 1398
//   },
//   {
//     Month: 'Jan 22',
//     Sales: 3890,
//     Profit: 2980
//   }
// ];
const SaleChart =  () => {
    const[statics , setStatics] = useState([])
   const {data, isPending} =useQuery({
    queryKey:["sales_profit"],
    queryFn : async () => {
        const res = await getSaleAndProfit()
        console.log(res , "res")
        return res.data
    },
   })
   console.log(data , "data")
    return (

        <Card className="mt-8">
        <Title>Performance</Title>
        <Text>Comparison between Sales and Profit</Text>
        <AreaChart
          className="mt-4 h-80"
          data={data ?? []}
          categories={['Sales', 'Profit']}
          index="Month"
          colors={['indigo', 'fuchsia']}
          valueFormatter={(number: number) =>
            `€ ${Intl.NumberFormat('de-DE').format(number).toString()}`
          }
          yAxisWidth={60}
        />
      </Card>

    )
}

export default SaleChart