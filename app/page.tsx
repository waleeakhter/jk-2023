"use client";
import React from "react";
import { Carousel, Image } from "antd";

import Datatable from "./components/Home/Datatable";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const contentStyle: React.CSSProperties = {
  height: "350px",
  color: "#fff",
  lineHeight: "350px",
  textAlign: "center",
  background: "#364d79",
  width: "100%",
};

const Home: React.FC = () => {
  const queryClient = new QueryClient({
    defaultOptions:{
      queries:{
        refetchOnWindowFocus: "always",
        refetchOnReconnect: "always",
        staleTime: Infinity,
      }
    }
  });
  const fetchItems = async () => {
    const response = await fetch("/api/item/public", {
      cache: "no-store",
    });
    const data = await response.json();
    return data.data;
  };
  const { data, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
   enabled: true,
  });


  return (
    <>
      <Carousel autoplay style={{ maxWidth: 621, margin: "auto" }}>
        <div className=" text-center">
          <Image style={contentStyle} src="/realme c35.png"></Image>
        </div>
        <div className=" text-center">
          <Image style={contentStyle} src="/12mini.png"></Image>
        </div>
        <div className=" text-center">
          <Image style={contentStyle} src="/x5.png"></Image>
        </div>
        <div className=" text-center">
          <Image style={contentStyle} src="/realme10pro.png"></Image>
        </div>
      </Carousel>
      <QueryClientProvider client={queryClient}>
        <Datatable loading={isLoading} data={data ?? []} />
      </QueryClientProvider>
    </>
  );
};

export default Home;
