"use client";
import React, { useState, useTransition } from "react";
import { Item } from "@/types/typings";
import { Affix, Card, Input } from "antd";
import Image from "next/image";
import { Caveat } from "next/font/google";
import { Empty } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Highlighter from "react-highlight-words";
const caveat = Caveat({
  weight: "400",
  subsets: ["latin"],
});
export default function MobileViewList({ data }: Readonly<{ data: Item[] }>) {
  const pathname = usePathname();
  const searchParams = useSearchParams().toString()!;
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const [globalFilterValue, setGlobalFilterValue] = useState(
    params.get("name") ?? ""
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
          <h3 className="text-base  font-semibold">
            <Highlighter
              highlightClassName="YourHighlightClass"
              searchWords={[globalFilterValue]}
              autoEscape={true}
              textToHighlight={item.name}
            />
          </h3>
        </div>
        <div className="grid gap-1 text-right">
          <p className="text-2xl font-bold">€{item.price}</p>
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
  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    if (value) {
      params.set("name", value);
    } else {
      params.delete("name");
    }

    startTransition(() => replace(pathname + "?" + params.toString()));
  };

  return (
    <div className="flex flex-col bg-[#18181B] h-screen">
      <Affix
        className="flex-[0_0_15rem] [&>*:first-child]:h-full"
        offsetTop={0}
        onChange={(affixed) => console.log(affixed)}
      >
        <header className=" h-full text-center gap-4 flex items-center justify-center text-[#919591] font-bold text-3xl">
          <div className="flex gap-4 items-center justify-center -mt-16">
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
                to verify availability.<small>(If Quantity Less then 3)</small>
              </h2>
            </p>
          </div>
        </header>
      </Affix>
      <Card className=" flex-1 p-1 dark:bg-[#27272A] border-none rounded-none -mt-16 rounded-t-[4rem] z-30 relative flex [&>*:first-child]:flex-1 [&>*:first-child]:p-1 [&>*:first-child]:text-center">
        <Input.Search
          loading={isPending}
          classNames={{ affixWrapper: " w-['80vmin'" }}
          size="large"
          className={" font-normal w-[90%] mx-auto my-4"}
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
          enterButton={
            <i className="pi pi-search dark:text-white text-[#27272A]" />
          }
        />
        {data.length > 0 ? (
          <div className="overflow-y-auto h-[100vmax] pb-8">
            {data.map((item) => itemTemplate(item))}
          </div>
        ) : (
          <Empty
            description={<div className="dark:text-white">No Data Found</div>}
          />
        )}
      </Card>
    </div>
  );
}
