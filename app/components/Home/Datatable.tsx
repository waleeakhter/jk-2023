"use client";
import React, { useEffect, useState } from "react";
import { Item } from "@/types/typings";

import useScreenType from "@/lib/useMobile";
import MobileViewList from "./MobileViewList";
import Loading from "@/app/loading";
type Props = { data: Array<Item | string | any>; loading: boolean };
const Datatable = ({ data, loading }: Props) => {
  const { isMobile } = useScreenType();
  const [isMounted , setIsMounted] = useState(false);
 

  

  useEffect(() => {
      setIsMounted(true);
  },[]);

  useEffect(() => { 
    if(isMobile){
      document.body.classList.add("overflow-hidden");
    }else{
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  },[isMobile]);

  if(!isMounted) {
   return <Loading />
  }

  return (
    <div>
     <MobileViewList data={data} />
    </div>
  );
};

export default Datatable;
