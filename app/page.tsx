import React from "react";

import Datatable from "./components/Home/Datatable";

import { fetchItems } from "@/lib/data";
import PwaModal from "./components/PwaModal";

const Home = async ({ searchParams }: { searchParams: URLSearchParams }) => {
  const data = await fetchItems(searchParams);

  return (
    <>
      <PwaModal />
      <Datatable loading={false} data={data ?? []} />
    </>
  );
};

export default Home;
