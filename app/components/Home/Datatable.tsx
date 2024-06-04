"use client";
import React, { useEffect, useState } from "react";
import { Button, Carousel, Image, Input, Tooltip } from "antd";
import { FilterMatchMode } from "primereact/api";
import { Item, LazyTableState } from "@/types/typings";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import { columns } from "./columns";
import useScreenType from "@/lib/useMobile";
import MobileViewList from "./MobileViewList";
import Loading from "@/app/loading";
import useBodyScrollLock from "@/lib/useBodyScrollLock";
import PwaModal from "../PwaModal";
type Props = { data: Array<Item | string | any>; loading: boolean };
const Datatable = ({ data, loading }: Props) => {
  const { isMobile } = useScreenType();
  const [isMounted , setIsMounted] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [lazyState, setlazyState] = useState<LazyTableState>({
    first: 0,
    rows: 20,
    page: 1,
  });
  const [totalRecords, setTotalRecords] = useState(data.length ?? 0);
  const onPage = (event: DataTablePageEvent) => {
    setlazyState((prev) => {
      return { ...prev, ...event };
    });
  };

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;
    console.log((_filters["global"].value = value));
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  

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
  const contentStyle: React.CSSProperties = {
    height: "350px",
    color: "#fff",
    lineHeight: "350px",
    textAlign: "center",
    background: "#364d79",
    width: "100%",
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center flex-wrap lg:gap:1 gap-3">
        <div className="flex  gap-3 items-center ">
          <h5 className="m-0 text-2xl text-gray-800 ">{"Items List"}</h5>
        </div>
        <h2 className=" text-red-700 ">
          Dial:{" "}
          <a className=" text-blue-500 underline" href="tel:+351920390253">
            +351 920 390 253
          </a>{" "}
          to verify availability.<small>(If Quantity Less then 3)</small>
        </h2>
        <div className="flex w-full">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <Input.Search
              classNames={{ affixWrapper: " w-['100vmin'" }}
              size="large"
              className={" font-normal "}
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
            />
          </span>
        </div>
      </div>
    );
  };
  return (
    <div>
      <PwaModal />
      {!isMobile ? (
        <>
        
        
      <Carousel  autoplay style={{ maxWidth: 621, margin: "auto" }}>
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
        
        <DataTable
          loading={loading && isMobile}
          className="data-table w-full"
          dataKey="_id"
          totalRecords={totalRecords}
          scrollable
          paginator
          first={lazyState.first}
          onPage={onPage}
          size="small"
          rows={lazyState.rows ?? 10}
          rowsPerPageOptions={[10, 25, 50]}
          removableSort
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          value={[...data]}
          header={renderHeader}
          globalFilterFields={["name", "type"]}
          filters={filters}
          filterDisplay="row"
          emptyMessage="No Items found."
        >
          {columns.map((col: ColumnProps, i: number) => (
            <Column {...col} key={i.toString()} />
          ))}
          <Column
            rowEditor
            headerStyle={{ width: "10%", minWidth: "8rem" }}
            bodyStyle={{ textAlign: "center" }}
          ></Column>
        </DataTable>
        </>
      ) : (
        <MobileViewList data={data} />
      )}
    </div>
  );
};

export default Datatable;
