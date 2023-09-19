import { ColumnEditorOptions, ColumnProps } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import DatePicker from "react-datepicker";

const inputsEditor = (options: any, type: string) => {

    switch (type) {
        case "number":
            return <InputNumber inputClassName=' max-w-[4rem] w-16 overflow-hidden ' step={1} type="text" mode="decimal" maxFractionDigits={2}
                value={options.value || options.props.children || 0} onChange={(e) => options.editorCallback(e.value)} />;
        case "text":
            return <InputText step={1} type="text"
                value={options.value || " "} onChange={(e) => options.editorCallback(e.target.value)} />;
        case "date":
            return <DatePicker name="createdAt" selected={new Date(options.value)} className=' z-[100] '
                placeholderText="Select a date" maxDate={new Date()} showTimeInput
                onChange={(date) => options.editorCallback(date)} />
        default:
            break;
    }

}


export const columns: Array<ColumnProps> = [
    {
        field: 'name', header: 'Item', sortable: true,
    },
    {
        field: 'type', header: 'Type',
        sortable: true
    },
    {
        field: 'purchase_price', header: 'Purchase Price', editor: (options: ColumnEditorOptions) => {
            return inputsEditor(options, "number")
        },

    },
    {
        field: 'price', header: 'Price', editor: (options: ColumnEditorOptions) => {
            return inputsEditor(options, "number")
        }
    },
    {
        field: 'stock', header: 'Stock',
        editor: (options: ColumnEditorOptions) => {
            return inputsEditor(options, "number")
        },
    },


]



