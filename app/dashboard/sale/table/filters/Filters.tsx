import React, { useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { DatePicker, Button } from "antd";
import Types from "@/utils/types.json";
import Status from "@/utils/status.json";
import { Fieldset } from "primereact/fieldset";
import { ToggleButton } from "primereact/togglebutton";
import BrandsSelect from "@/app/components/BrandsSelect";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { DatePickerProps } from "antd/es/date-picker";
import { Select } from "antd";
import { Client } from "@/types/typings";
import { ClearOutlined } from "@ant-design/icons";
type FILTERS = {
  createdAt: RangeValue;
  status: Array<number> | undefined;
  paidStart: RangeValue;
  type: string[] | undefined;
  brand: string[] | string | undefined;
  client: string[] | undefined;
};

type Props = {
  searchParams: URLSearchParams;
  clients: Array<Client> | undefined;
  startTransition: React.TransitionStartFunction;
  isPending: boolean;
};
type RangeValue = [Dayjs | null, Dayjs | null] | null;

export const Filters = (props: Props) => {
  const { RangePicker } = DatePicker;
  const searchParams = useSearchParams().toString()!;
  const params = new URLSearchParams(searchParams);
  const [toggleClientFilters, setToggleClientFilters] = useState(true);

  const { replace } = useRouter();
  const pathname = usePathname();
  const initialFilters = {
    status: [Status.at(0)?.value ?? 0],
    createdAt: null,
    endAt: null,
    paidStart: null,
    paidEnd: null,
    type: [],
    brand: [],
    client: [],
  };
  const [filters, setFilters] = useState<FILTERS>(initialFilters);

  const types = Types.map((type) => ({
    name: type.name,
    value: type.value,
    disabled:
      params.get(type.name) === type.value.toString() ??
      filters.type?.includes(type.value),
  }));
  const status = Status.map((el) => ({
    name: el.name,
    value: el.value,
    disabled:
      params.get(el.name) === el.value.toString() ??
      filters.status?.includes(el.value),
  }));

  const deleteParams = (name: string) => {
    params.delete(name);
    props.startTransition(() => replace(pathname + "?" + params.toString()));
  };
  const onSelectType = async (value: string[] | number[], name: string) => {
    console.log(name);
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    if (value.length > 0) {
      params.set(name, JSON.stringify(value));
    } else {
      params.delete(name);
    }
    props.startTransition(() => replace(pathname + "?" + params.toString()));
  };
  const onDateChange = async (rawValues: RangeValue, dates: Array<string>) => {
    console.log(dates, rawValues);
    if (rawValues) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        createdAt: rawValues,
      }));
      params.set("createdAt", dayjs(rawValues[0]).toString());
      params.set("endAt", dayjs(rawValues[1]).toString());
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        createdAt: rawValues,
      }));
      params.delete("createdAt");
      params.delete("endAt");
    }
    props.startTransition(() => replace(pathname + "?" + params.toString()));
  };

  const onPaidDateChange =async (rawValues: RangeValue, dates: Array<string>) =>  {
    console.log(dates, rawValues);
    if (rawValues) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        paidStart: rawValues,
      }));
      params.set("paidStart", dayjs(rawValues[0]).toString());
      params.set("paidEnd", dayjs(rawValues[1]).toString());
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        paidStart: rawValues,
      }));
      params.delete("paidStart");
      params.delete("paidEnd");
    }
    props.startTransition(() => replace(pathname + "?" + params.toString()));
  };

  const onClientSelect = async (data: string[], name: string) => {
    if (data?.length > 0) {
      setFilters((prev) => ({ ...prev, client: data }));
      params.set(name, JSON.stringify(data));
      props.startTransition(() => replace(pathname + "?" + params.toString()));
    } else {
      params.delete(name);
      setFilters((prev) => ({ ...prev, client: data }));
      props.startTransition(() => replace(pathname + "?" + params.toString()));
    }
  };
  const noop = () => {};
  const onBrandSelect = async (res: Array<string> | string) => {
    setFilters((prev) => ({ ...prev, brand: res }));
    if (res?.length > 0) {
      params.set("brands", JSON.stringify(res));

      props.startTransition(() => replace(pathname + "?" + params.toString()));
    } else {
      params.delete("brands");
      props.startTransition(() => replace(pathname + "?" + params.toString()));
    }
  };

  const legendTemplate = (
    <div className="flex items-center text-primary text-sm">
      <span className="pi pi-filter mr-2"></span>
      <span className="font-bold ">Filters</span>
    </div>
  );
  return (
    <div className="p-5">
      <Fieldset
        className="p-0 border-none"
        pt={{
          legend: {
            className:
              "p-5 text-sm bg-[#fff_!important] border-[white_!important] ",
          },
          content: {
            className: "p-[0.25rem_!important]  border-[white_!important]",
          },
          legendTitle: { className: "text-sm p-[0.5rem_!important] " },
          togglerIcon: { className: "text-white" },
          toggler: { className: "p-[0.5rem_!important]  " },
        }}
        legend={legendTemplate}
        toggleable
        collapsed={true}
      >
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4  items-center w-full">
          <div className="flex flex-col gap-1  ">
            <div className="flex relative">
              <ToggleButton
                checked={toggleClientFilters}
                onLabel="By Client"
                offLabel="Exclude Client"
                onChange={(e) => setToggleClientFilters(e.value)}
                className="px-2 py-0 text-sm max-w-fit "
              />
              <div className="p-tooltip p-component p-tooltip-right p-tooltip-active relative inset-0">
                <div className="p-tooltip-arrow"></div>
                <div className="p-tooltip-text" data-pc-section="text">
                  Click to change Functionalty
                </div>
              </div>
            </div>
            <Select
              mode="multiple"
              placeholder="Filter by client"
              value={filters.client}
              onChange={(values) =>
                onClientSelect(
                  values,
                  toggleClientFilters ? "client" : "excludeClients"
                )
              }
              options={props.clients}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.name?.toLocaleLowerCase() ?? "").includes(
                  input.toLocaleLowerCase()
                )
              }
              fieldNames={{ label: "name", value: "_id" }}
              size="large"
              loading={props.isPending}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="brans" className="block font-semibold text-sm">
              By Brands
            </label>
            <BrandsSelect
              callback={onBrandSelect}
              value={filters.brand ?? ""}
              loading={props.isPending}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="createdAt" className="block font-semibold text-sm">
              Created At
            </label>
            <RangePicker
             id="createdAt"
              size="large"
              value={filters?.createdAt}
              onChange={onDateChange}
              format={"DD-MM-YYYY"}
            />
          </div>
          {filters.status?.includes(1) ? (
            <div className="flex flex-col gap-1">
              <label htmlFor="paidAt" className="block font-semibold text-sm">
                Paid At
              </label>
              <RangePicker
                id="paidAt"
                value={filters?.paidStart}
                onChange={onPaidDateChange}
                size="large"
                format={"DD-MM-YYYY"}
              />
            </div>
          ) : null}
        </div>

        <Button
          title="Clear"
          size="middle"
          danger
          type="dashed"
          icon={<ClearOutlined />}
          onClick={() => {
            setFilters(initialFilters);
            props.startTransition(() => replace(pathname));
          }}
          className="mt-3"
        >
          Clear
        </Button>
      </Fieldset>
      <div className="flex flex-wrap items-center  w-full mt-4 justify-end gap-4 ">
        <Select
          mode="multiple"
          placeholder="Filter by type"
          value={filters.type}
          onChange={(e) => onSelectType(e, "type")}
          options={types}
          size="large"
          className="flex-1 max-w-[20rem]"
        />
        <Select
          mode="multiple"
          placeholder="Filter by status"
          value={filters.status}
          onChange={(e) => onSelectType(e, "status")}
          options={status}
          size="large"
          fieldNames={{ label: "name", value: "value" }}
          className="flex-1 max-w-[20rem]"
        />
      </div>
    </div>
  );
};
export default Filters;
