// 'use client'
// import React, { useState } from 'react'
// import { TabPanel, TabView, TabViewTabChangeEvent } from 'primereact/tabview'
// import { usePathname, useRouter, useSearchParams } from 'next/navigation'
// interface Props {tabsData: { name: string} }

// const Tabs = ({ tabsData }: Props) => {
//     const [index, setIndex] = useState(0)
//     const pathname = usePathname()
//     const router = useRouter()
//     const removePrams = (el: TabViewTabChangeEvent) => {
//         setIndex(prev => prev = el.index)
//         // if (el.index === 1) {
//         //     return router.push("/sale/paid")
//         // }
//     }
//     return (
//         <div className='card'>
//             <TabView renderActiveOnly={true} onTabChange={removePrams} activeIndex={index}  >
//                 {tabsData?.map(tab => (
//                     <TabPanel key={tab?.name} header={tab.name} >
//                     </TabPanel>
//                 ))}

//             </TabView>
//         </div>
//     )
// }

// export default Tabs
