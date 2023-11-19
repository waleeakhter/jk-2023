import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { DatePicker, Button } from 'antd';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import Types from "@/app/utils/types.json";
import Status from "@/app/utils/status.json";
import { Fieldset } from 'primereact/fieldset';
import { ToggleButton } from 'primereact/togglebutton';
import BrandsSelect from '@/app/components/BrandsSelect';
import type { Dayjs } from 'dayjs';
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { Select } from 'antd';
import { Client } from '@/typings';
import { ClearOutlined } from '@ant-design/icons';
type FILTERS = {
    createdAt: RangeValue,
    status: Array<number> | undefined,
    paidOn: Dayjs | null | undefined,
    type: string[] | undefined
    brand: string[] | string | undefined,
    client: string[] | undefined,
}


type Props = { searchParams: URLSearchParams, clients: Array<Client> | undefined }
type RangeValue = [Dayjs | null, Dayjs | null] | null;


export const Filters = (props: Props) => {
    const { RangePicker } = DatePicker;
    const searchParams = useSearchParams().toString()!;
    const params = new URLSearchParams(searchParams);
    const [toggleClientFilters, setToggleClientFilters] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const intialFilters = {
        status: [Status.at(0)?.value ?? 0],
        createdAt: null,
        endAt: null,
        paidOn: null,
        type: [],
        brand: [],
        client: []
    }
    const [filters, setFilters] = useState<FILTERS>(intialFilters);



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
        async (name: string, value: string) => {

            params.set(name, value);
            return params.toString();
        },
        [searchParams, filters]
    );

    const deleteParams = (name: string) => {
        params.delete(name)
        router.push(pathname + '?' + params.toString());

    }
    const onSelectType = async (value: string[] | number[], name: string) => {
        console.log(value)
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
        if (value.length > 0) {
            await createQueryString(name, JSON.stringify(value))
            router.push(pathname + '?' + params.toString());
        } else {
            deleteParams(name);
        }


    };
    const onDateChange = async (rawValues: RangeValue, dates: Array<string>) => {
        console.log(dates, rawValues)
        if (rawValues) {
            setFilters(prevFilters => ({
                ...prevFilters, "createdAt": rawValues
            }));

            await createQueryString("createdAt", dates.at(0) as string)
            await createQueryString("endAt", dates.at(1) as string)


        } else {
            setFilters(prevFilters => ({
                ...prevFilters, "createdAt": rawValues
            }));
            params.delete("createdAt")
            params.delete("endAt")
        }
        router.push(pathname + '?' + params.toString());
    };

    const onPaidDateChange: DatePickerProps['onChange'] = (date, dateString) => {

        if (date) {
            setFilters(prev => ({ ...prev, paidOn: date }))
            createQueryString("paidOn", dateString)
        } else {
            params.delete("paidOn")
        }


        router.push(pathname + '?' + params.toString());

    };

    const onClientSelect = async (data: string[], name: string) => {

        if (data?.length > 0) {
            setFilters(prev => ({ ...prev, [name]: data }))
            await createQueryString(name, JSON.stringify(data))
            router.push(pathname + '?' + params.toString());
        } else {
            deleteParams(name)
            setFilters(prev => ({ ...prev, [name]: data }))
            router.push(pathname + '?' + params.toString());

        }
    }
    const noop = () => { };
    const onBrandSelect = async (res: Array<string> | string) => {
        setFilters(prev => ({ ...prev, brand: res }))
        if (res?.length > 0) {
            await createQueryString("brands", JSON.stringify(res))
            router.push(pathname + '?' + params.toString());
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
                <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4  items-center w-full'>
                    <div className='flex flex-col gap-1  '>
                        <div className="flex relative">
                            <ToggleButton checked={toggleClientFilters} onLabel='By Client' offLabel='Exclude Client'
                                onChange={(e) => setToggleClientFilters(e.value)} className="px-2 py-0 text-sm max-w-fit "
                            />
                            <div className="p-tooltip p-component p-tooltip-right p-tooltip-active relative inset-0"  >
                                <div className="p-tooltip-arrow" ></div>
                                <div className="p-tooltip-text" data-pc-section="text">Click to change Functionalty</div>
                            </div>
                        </div>
                        <Select
                            mode="multiple"
                            placeholder="Filter by client"
                            value={filters.client}
                            onChange={(values) => onClientSelect(values, toggleClientFilters ? "client" : "excludeClients")}
                            options={props.clients}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.name?.toLocaleLowerCase() ?? '').includes(input.toLocaleLowerCase())}
                            fieldNames={{ label: "name", value: "_id" }}
                            size='large'
                        />
                        {/* <AdvanceSelect name={"client"} value={"name"} multiple={true}
                            lableValue={"name"} options={props.clients} callback={(data) => onClientSelect(data, toggleClientFilters ? "client" : "excludeClients")} /> */}
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="brans" className='block font-semibold text-sm'>By Brands</label>
                        <BrandsSelect callback={onBrandSelect} value={filters.brand ?? ""} />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label htmlFor="" className='block font-semibold text-sm'>Created At</label>
                        <RangePicker size='large'
                            value={filters?.createdAt}
                            onChange={onDateChange}
                            format={"DD-MM-YYYY"}
                        />
                    </div>
                    {filters.status?.includes(1) ? (
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='block font-semibold text-sm'>Paid At</label>
                            <DatePicker
                                value={filters.paidOn ?? null}
                                onChange={onPaidDateChange}
                                size='large'
                                format={"DD-MM-YYYY"}
                            />
                        </div>
                    ) : null}
                </div>

                <Button title="Clear" size='middle' danger type='dashed' icon={<ClearOutlined />}
                    onClick={() => { setFilters(intialFilters); router.push(pathname); }}
                    className='mt-3' >
                    Clear
                </Button>


            </Fieldset>
            <div className="flex flex-wrap items-center  w-full mt-4 justify-end gap-4 ">
                <Select
                    mode="multiple"
                    placeholder="Filter by type"
                    value={filters.type}
                    onChange={(e) => (onSelectType(e, "type"))}
                    options={types}
                    size='large'
                    className='flex-1 max-w-[20rem]'
                />
                <Select
                    mode="multiple"
                    placeholder="Filter by status"
                    value={filters.status}
                    onChange={(e) => (onSelectType(e, "status"))}
                    options={status}
                    size='large'
                    fieldNames={{ label: "name", value: "value" }}
                    className='flex-1 max-w-[20rem]'
                />
            </div>
        </div >

    );
};
export default Filters