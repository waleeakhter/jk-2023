import React from "react";

import Datatable from "./components/Home/Datatable";

import { fetchItems } from "@/lib/data";



const Home = async ({searchParams} : {searchParams : URLSearchParams}) => {




  const data  =  await fetchItems(searchParams)

  return (
    <>
        <Datatable loading={false} data={data ?? []} />
    </>
  );
};

export default Home;
