"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import Types from "@/app/utils/types.json";
import Status from "@/app/utils/status.json";
import { Fieldset } from 'primereact/fieldset';
import AdvanceSelect from '@/app/components/AdvanceSelect';
import { ToggleButton } from 'primereact/togglebutton';
import BrandsSelect from '@/app/components/BrandsSelect';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import Router from 'next/router';
type FILTERS = {
    createdAt: Date | null | undefined,
    endAt: Date | null | undefined,
    status: Array<number> | undefined,
    paidOn: string | undefined,
    type: string[] | undefined
    brand: string[] | undefined,
    client: string[] | undefined,
}


type Props = { searchParams: URLSearchParams, clients: Object[] }



export const Filters = (props: Props) => {
    const searchParams = useSearchParams().toString()!;
    const params = new URLSearchParams(searchParams);
    const [toggleClientFilters, setToggleClientFilters] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const intialFilters = {
        status: [Status.at(0)?.value ?? 0],
        createdAt: null,
        endAt: null,
        paidOn: undefined,
        type: [],
        brand: [],
        client: []
    }
    const [filters, setFilters] = useState<FILTERS>(intialFilters);

    useEffect(() => {
        // const checkParams = Object.fromEntries(params);
        // setFilters(prev => ({ ...prev, ...checkParams, status: Number(checkParams.status) ?? 0 }))
    }, [])

    const types = Types.map(type => (
        {
            name: type.name, value: type.value,
            disabled: params.get(type.name) === type.value.toString() ?? filters.type?.includes(type.value)

        }
    ));
    const status = Status.map(el => (
        {
            name: el.name, value: el.value,
            disabled: params.get(el.name) === el.value.toString() ?? filters.status?.includes(el.value)

        }
    ));

    const createQueryString = useCallback(
        (name: string, value: string) => {

            params.set(name, value);
            return params.toString();
        },
        [searchParams, filters]
    );

    const deleteParams = (name: string) => {
        params.delete(name)
        router.push(pathname + '?' + params.toString());

    }
    const onChange = (e: SelectButtonChangeEvent, name: string) => {
        const value = name === "status" ? e.value?.length > 0 ? e.value : [0] : e.value?.length > 0 ? e.value : null
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
        console.log(e.value)
        if (value?.length > 0) {
            createQueryString(name, JSON.stringify(value))
            if (name === "status") {
                const checkStatus = [0, 2];
                const check1 = checkStatus.some(el => value.includes(el))
                console.log(check1)
                if (check1) {
                    deleteParams("paidOn");
                    return;
                }
            }
            router.push(pathname + '?' + params.toString());
        } else {
            deleteParams(name);

        }


    };
    const onDateChange = (dates: [Date, Date] | [any, any]) => {
        console.log(dates)
        const [start, end] = dates;
        setFilters(prevFilters => ({
            ...prevFilters, "createdAt": start ? start : "",
            "endAt": end ? end : ""
        }));
        if (start || end) {
            createQueryString("createdAt", start.toDateString())
            end && createQueryString("endAt", end.toDateString())
        } else {
            params.delete("createdAt")
            params.delete("endAt")
        }


        router.push(pathname + '?' + params.toString());
    };

    const onPaidDateChange = (date: Date) => {

        if (date) {
            createQueryString("paidOn", date.toDateString())
        } else {
            params.delete("paidOn")
        }


        router.push(pathname + '?' + params.toString());

    };

    const onClientSelect = (data: [{ value: string }], name: string) => {

        if (data?.length > 0) {
            const client = data.map(el => el.value)

            router.push(pathname + '?' + createQueryString(name, JSON.stringify(client)));
        } else {
            deleteParams(name)
            router.push(pathname + '?' + params.toString());

        }
    }
    const noop = () => { };
    const onBrandSelect = (res: Array<{ name: string, value: string }>) => {
        if (res?.length > 0) {
            const client = res.map(el => el.value)

            router.push(pathname + '?' + createQueryString("brands", JSON.stringify(client)));
        } else {
            deleteParams("brands")
            router.push(pathname + '?' + params.toString());

        }
    }

    const legendTemplate = (
        <div className="flex items-center text-primary text-sm">
            <span className="pi pi-filter mr-2"></span>
            <span className="font-bold ">Filters</span>
        </div>
    );
    return (
        <div className='p-5'>
            <Fieldset
                className='p-0 border-none'

                pt={{
                    legend: { className: 'p-5 text-sm bg-[#fff_!important] border-[white_!important] ' },
                    content: { className: "p-[0.25rem_!important]  border-[white_!important]" },
                    legendTitle: { className: 'text-sm p-[0.5rem_!important] ' },
                    togglerIcon: { className: 'text-white' },
                    toggler: { className: "p-[0.5rem_!important]  " }

                }}
                legend={legendTemplate} toggleable collapsed={true} >
                <div className='grid grid-cols-4 gap-4  items-center w-full'>
                    <div className='flex flex-col gap-1  '>
                        <div className="flex">
                            <ToggleButton checked={toggleClientFilters} onLabel='By Client' offLabel='Exclude Client'
                                onChange={(e) => setToggleClientFilters(e.value)} className="px-2 py-0 text-sm max-w-fit "
                            />
                            <div className="p-tooltip p-component p-tooltip-right p-tooltip-active relative inset-0"  >
                                <div className="p-tooltip-arrow" ></div>
                                <div className="p-tooltip-text" data-pc-section="text">Click to change Functionalty</div>
                            </div>
                        </div>
                        <AdvanceSelect name={"client"} value={"name"} multiple={true}
                            lableValue={"name"} options={props.clients} callback={(data) => onClientSelect(data, toggleClientFilters ? "client" : "excludeClients")} />
                    </div>
                    <div>
                        <label htmlFor="brans">By Brands</label>
                        <BrandsSelect callback={onBrandSelect} />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label htmlFor="" className='block font-semibold text-sm'>Created At</label>
                        <DatePicker className='p-inputtext h-10 relative'
                            showIcon isClearable={true}
                            placeholderText='Select a date...'
                            selectsRange
                            startDate={filters.createdAt} endDate={filters.endAt}
                            onChange={onDateChange} dateFormat={"dd-MM-yyyy"}
                        />
                    </div>
                    {filters.status?.includes(1) ? (
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='block font-semibold text-sm'>Paid At</label>
                            <DatePicker
                                isClearable
                                value={filters.paidOn}
                                className='p-inputtext h-10'
                                placeholderText='Select a date...'
                                onChange={onPaidDateChange}
                                dateFormat={"01-08-2023"}
                            />
                        </div>
                    ) : null}
                </div>

                <Button label="Clear" raised size='small' severity='danger' icon={"pi pi-filter-slash"}
                    onClick={() => { setFilters(intialFilters); router.push(pathname); }} className='mt-3' />


            </Fieldset>
            <div className="flex flex-wrap items-center  w-full mt-4 justify-end gap-4 ">
                {/* <SelectButton options={types} value={filters.type} onChange={(e) =>)} optionLabel="name" /> */}
                {/* <AdvanceSelect name={'types'} value={"name"} options={Types} /> */}
                <MultiSelect value={filters.type} showClear
                    onChange={(e) => (onChange(e, "type"))} options={types} optionLabel="name" optionValue='value'
                    filter placeholder="Select Item Type" maxSelectedLabels={3} className="" />
                <SelectButton multiple options={status} value={filters.status}
                    onChange={(e) => (onChange(e, "status"))} optionLabel="name" />
            </div>
        </div>

    );
};
export default Filters