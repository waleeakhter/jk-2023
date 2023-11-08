import { Badge, Tag } from 'antd';
import { ColumnEditorOptions, ColumnProps } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import DatePicker from "react-datepicker";

const inputsEditor = (options: ColumnEditorOptions, type: string) => {

    switch (type) {
        case "number":
            return <InputNumber inputClassName=' max-w-[4rem] w-16 overflow-hidden ' step={1} type="text" mode="decimal" maxFractionDigits={2}
                value={options.value || options.rowData[options.field] || 0} onChange={(e) => options.editorCallback && options.editorCallback(e.value)} />;
        case "text":
            return <InputText step={1} type="text"
                value={options.value || " "} onChange={(e) => options.editorCallback &&  options.editorCallback(e.target.value)} />;
        default:
            break;
    }

}


export const columns: Array<ColumnProps> = [
    {
        field: 'name', header: 'Client', sortable: true,
        editor: (options: ColumnEditorOptions) => {
            return inputsEditor(options, "text")
        },
    },
    {
        field: 'credit', header: 'Credit',
        sortable: true,editor: (options: ColumnEditorOptions) => {
            return inputsEditor(options, "number")
        }
    },
    {
        field: 'debit', header: 'Debit', editor: (options: ColumnEditorOptions) => {
            return inputsEditor(options, "number")
        }
    },


]



