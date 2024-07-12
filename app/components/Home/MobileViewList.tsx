"use client";
import React, { useState, useTransition } from "react";
import { Item } from "@/types/typings";
import { Affix, Card, Input, Empty } from "antd";
import Image from "next/image";
import { Caveat } from "next/font/google";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Highlighter from "react-highlight-words";
import { Segmented } from "antd";
const caveat = Caveat({
  weight: "400",
  subsets: ["latin"],
});
export default function MobileViewList({ data }: Readonly<{ data: Item[] }>) {
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const [globalFilterValue, setGlobalFilterValue] = useState({
    name : params.get("name") ?? "",
    type : params.get("type") ?? "lcd"
  }
    
  );
  const [isPending, startTransition] = useTransition();
  const itemTemplate = (item: Item) => {
    return (
      <div
        className="grid grid-cols-[1fr_auto] items-center 
      gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-transparent 
      dark:shadow-lg   w-full card mb-3 dark:text-emerald-50 text-[#27272A] dark:backdrop-blur-lg "
      >
        <div className="grid gap-1 text-left">
          <h3 className="text-[0.8rem] sm:text-base  font-semibold">
            <Highlighter
              highlightClassName="YourHighlightClass"
              searchWords={[globalFilterValue.name]}
              autoEscape={true}
              textToHighlight={item.name}
            />
          </h3>
        </div>
        <div className="grid gap-1 text-right">
          <p className=" text-xl sm:text-2xl font-bold">€{item.price}</p>
          <p
            className={`${
              Number(item.stock + (item.wearHouseStock ?? 0)) === 0
                ? "text-red-600"
                : "text-gray-500 dark:text-gray-400"
            } text-sm  font-medium `}
          >
            In stock: {Number(item.stock + (item.wearHouseStock ?? 0))}
          </p>
        </div>
      </div>
    );
  };
  function sanitizeUrlParam(param: string): string {
    // Replace multiple spaces with a single space and trim leading/trailing spaces
    param = param.replace(/\s+/g, ' ').trim();
    // Replace all non-alphanumeric characters except for spaces, underscores, and hyphens
    return encodeURIComponent(param.replace(/[^a-zA-Z0-9-_ ]/g, ''));
  }
  const onGlobalFilterChange = ( name : string , value = "") => {
   
    setGlobalFilterValue((prev) => ({ ...prev, [name]: value }));
    if (value) {
      params.set(name, sanitizeUrlParam(value.toLocaleLowerCase()));
    } else {
      params.delete(name);
    }

    startTransition(() => replace(pathname + "?" + params.toString()));
  };

  return (
    <div className="flex relative flex-col dark:bg-[#18181B] h-dvh">
      <div className="flex overflow-x-hidden">
        <div className="flex h-[100dvh] flex-col p-2  sm:p-5 flex-1">
          <Affix
            className="flex-[0_0_9rem] [&>*:first-child]:h-full"
            offsetTop={0}
            onChange={(affixed) => console.log(affixed)}
          >
            <header className=" h-full text-center gap-4 flex items-center justify-center text-[#919591] font-bold text-3xl">
              <div className="flex gap-4 items-center justify-center">
                <Image src={"/jk3.svg"} width={50} height={50} alt="logo" />
                <p className={`${caveat.className}} pt-4 italic `}>
                  {" "}
                  Lcd Price List
                  <h2 className=" text-red-700 text-xs max-w-[12rem]">
                    Dial:{" "}
                    <a
                      className=" text-blue-500 underline"
                      href="tel:+351920390253"
                    >
                      +351 920 390 253
                    </a>{" "}
                    to verify availability.
                    <small>(If Quantity Less then 3)</small>
                  </h2>
                </p>
              </div>
            </header>
          </Affix>
          <div className="flex-1 flex-col flex dark:bg-[#27272A] p-4  overflow-hidden border-none rounded-3xl z-30 shadow-2xl">
            <Input.Search
              loading={isPending}
              classNames={{ affixWrapper: " w-['80vmin'" }}
              size="large"
              className={" font-normal w-[90%] mx-auto my-4"}
              value={globalFilterValue.name}
              onChange={(e) => onGlobalFilterChange("name", e.target.value ?? "")}
              placeholder="Keyword Search"
              enterButton={
                <i className="pi pi-search dark:text-white " />
              }
            />
            <Segmented
            value={globalFilterValue.type}
            block={false}
              options={[{
                label: "Lcd's",
                value: "lcd",
              },
              {
                label: "Mobile's",
                value: "mobile",
              },
            ]}
              size="large"
              className="dark:bg-[#18181B] dark:text-white w-fit"
           
              onChange={(value) => onGlobalFilterChange("type", value as string)}
            />
            {data.length > 0 ? (
              <div className=" overflow-y-scroll flex-[1_1_100%] w-full h-full">
                {data.map((item) => itemTemplate(item))}
              </div>
            ) : (
              <Empty
                description={
                  <div className="dark:text-white">No Data Found</div>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
