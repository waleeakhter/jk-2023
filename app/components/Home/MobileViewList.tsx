"use client";
import React, { useState, useTransition } from "react";
import { Item } from "@/types/typings";
import { Affix, Input, Empty, Segmented } from "antd";
import Image from "next/image";
import { Caveat } from "next/font/google";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { itemTemplate, sanitizeUrlParam } from "./functions";
import Loading from "@/app/loading";
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
    name: decodeURIComponent(params.get("name") ?? ""),
    type: params.get("type") ?? "lcd",
  });

  const [isPending, startTransition] = useTransition();

  const onGlobalFilterChange = (name: string, value = "") => {
    console.log(value, "filter");
    if (value) {
      params.set(name, sanitizeUrlParam(value.toLocaleLowerCase()));
    } else {
      params.delete(name);
    }

    startTransition(() => replace(pathname + "?" + params.toString()));
    setGlobalFilterValue((prev) => ({ ...prev, [name]: value }));
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
              allowClear={true}
              loading={isPending}
              classNames={{ affixWrapper: " w-['80vmin'" }}
              size="large"
              className={" font-normal w-[90%] mx-auto my-4"}
              value={globalFilterValue.name}
              onChange={(e) =>
                onGlobalFilterChange("name", e.target.value ?? "")
              }
              placeholder="Keyword Search"
              enterButton={<i className="pi pi-search dark:text-white " />}
            />
            <Segmented
              classID="types"
              value={globalFilterValue.type}
              block={false}
              options={[
                {
                  label: "Lcd's",
                  value: "lcd",
                },
                {
                  label: "Mobile's",
                  value: "mobile",
                },
                {
                  label: "Laptop's",
                  value: "laptop",
                },
                {
                  label: "Nokia",
                  value: "nokia",
                },
              ]}
              size="large"
              className="dark:bg-[#18181B] dark:text-white w-fit mb-5"
              onChange={(value) =>
                onGlobalFilterChange("type", value as string)
              }
            />
            {isPending ? (
              <Loading />
            ) : data.length > 0 ? (
              <div className=" overflow-y-scroll flex-[1_1_100%] w-full h-full">
                {itemTemplate(
                  data,
                  globalFilterValue.name ?? "",
                  globalFilterValue.type
                )}
              </div>
            ) : (
              <Empty
                description={
                  <div className="dark:text-white">
                    {globalFilterValue.type === "nokia"
                      ? "Coming Soon"
                      : "No Data Found"}
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
