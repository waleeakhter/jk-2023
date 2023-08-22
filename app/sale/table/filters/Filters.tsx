"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import Types from "@/app/utils/types.json";
import Status from "@/app/utils/status.json";
import { Fieldset } from 'primereact/fieldset';
import AdvanceSelect from '@/app/components/AdvanceSelect';
import { ToggleButton } from 'primereact/togglebutton';

type date = {
    createdAt: Date | null | undefined,
    endAt: Date | null | undefined,
    status: number | undefined,
    paidOn: string | undefined,
    type: string | undefined
}


type Props = { searchParams: URLSearchParams, clients: Object[] }



export const Filters = (props: Props) => {
    const searchParams = useSearchParams().toString()!;
    const params = new URLSearchParams(searchParams);
    const [toggleClientFilters, setToggleClientFilters] = useState(false);


    const [filters, setFilters] = useState<date>({
        status: Status.at(0)?.value,
        createdAt: null,
        endAt: null,
        paidOn: undefined,
        type: Types.at(0)?.value
    });

    useEffect(() => {
        // const checkParams = Object.fromEntries(params);
        // setFilters(prev => ({ ...prev, ...checkParams, status: Number(checkParams.status) ?? 0 }))
    }, [])

    const types = Types.map(type => (
        {
            name: type.name, value: type.value,
            disabled: params.get(type.name) === type.value.toString() ?? filters.type === type.value

        }
    ));
    const status = Status.map(el => (
        {
            name: el.name, value: el.value,
            disabled: params.get(el.name) === el.value.toString() ?? filters.status === el.value

        }
    ));
    const router = useRouter();
    const pathname = usePathname();
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
        setFilters(prevFilters => ({ ...prevFilters, [name]: e.value }));
        const value = e.value
        switch (value) {
            case "all":
                deleteParams("type");
                break;
            case 0:
            case 2:
                createQueryString(name, e.value)
                deleteParams("paidOn");
                break;
            default:
                router.push(pathname + '?' + createQueryString(name, e.value));
                break;
        }

    };
    const onDateChange = (dates: [Date, Date] | [any, any]) => {
        console.log(dates)
        const [start, end] = dates;
        setFilters(prevFilters => ({
            ...prevFilters, "createdAt": start ? start : "",
            "endAt": end ? end : ""
        }));
        if (start && end) {
            createQueryString("createdAt", start.toDateString())
            createQueryString("endAt", end.toDateString())
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
                legend="Filters" toggleable collapsed={true} >
                <div className='grid grid-cols-4 gap-4  items-center w-full'>
                    <div className='flex flex-col gap-1  '>
                        <ToggleButton checked={toggleClientFilters} onLabel='By Client' offLabel='Exclude Client'
                            onChange={(e) => setToggleClientFilters(e.value)} className="p-1 text-sm w-16 "
                            tooltip="Click to change Functionalty" tooltipOptions={{ position: "top", showDelay: 0, onHide: noop }} />
                        <AdvanceSelect name={"client"} value={"name"} multiple={true}
                            lableValue={"name"} options={props.clients} callback={(data) => onClientSelect(data, toggleClientFilters ? "client" : "excludeClients")} />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label htmlFor="" className='block font-semibold text-sm'>Created At</label>
                        <DatePicker className='p-inputtext h-10 relative'
                            showIcon isClearable={true}
                            placeholderText='Select a date...'
                            selectsRange

                            selected={filters.createdAt}
                            startDate={filters.createdAt} endDate={filters.endAt}
                            onChange={onDateChange} dateFormat={"01-08-2023"}
                        />
                    </div>
                    {filters.status === 1 ? (
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


                    <div className=" ml-auto mt-auto text-end w-full ">
                        <SelectButton className='h-10' options={types} value={filters.type} onChange={(e) => (onChange(e, "type"))} optionLabel="name" />
                        <SelectButton className='h-10' options={status} value={filters.status} onChange={(e) => (onChange(e, "status"))} optionLabel="name" />
                    </div>
                </div>
            </Fieldset>
        </div>

    );
};
export default Filters