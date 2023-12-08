'use client'
import React, { useEffect, useState } from 'react';
import { _customStyles } from "./SelectStyle";
import CreatableSelect from './CreatableSelect';
import { Option, ReactSelect } from '@/types/typings';
import { GroupBase, MultiValue, OptionsOrGroups, SingleValue } from 'react-select';
import Group from 'react-select/dist/declarations/src/components/Group';

type AdvanceSelectProps = {
    callback?: (value: any, callback: Function) => void;
    name: string;
    value: string | null | undefined;
    options: Array<{}>;
    lableValue?: string;
    extraLabelValue?: string;
    extra?: any;
    setFieldValue?: Function | undefined,
    multiple?: boolean,
    classes?: string
};

const AdvanceSelect: React.FC<AdvanceSelectProps> = ({
    callback,
    name,
    value,
    options,
    setFieldValue,
    multiple,
    lableValue,
    classes,
    extraLabelValue,
    extra
}) => {
    const [values, setValues] = useState<OptionsOrGroups<any, GroupBase<any>>>()




    useEffect(() => {
        const newOptions = options ? options?.map((opt: any) => {
            return { label: opt.name ?? opt.toUpperCase(), value: opt._id ?? opt, extra: opt['price'] }
        }) : []
        setValues(newOptions)
    }, [options])

    const selectValue = async (selectedOption: SingleValue<Option> | MultiValue<Option>) => {
        console.log(selectedOption)
        setFieldValue && setFieldValue(name, selectedOption)
        callback && callback(selectedOption, setFieldValue ? setFieldValue : () => "");
    };

    return (

        <CreatableSelect aria-live="polite"
            isClearable
            isSearchable
            classNamePrefix='react-select'
            id={name}
            key={value}
            isMulti={multiple ?? false}
            styles={_customStyles}
            options={values}
            onChange={selectValue}
            defaultValue={values && values.filter(
                (val) => val.value === value
            )}
        />
    );
};

export default AdvanceSelect;
