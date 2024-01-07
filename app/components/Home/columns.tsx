import { Badge, Tag } from 'antd';
import { ColumnEditorOptions, ColumnProps } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import DatePicker from "react-datepicker";

export const columns: Array<ColumnProps> = [
    {
        field: 'name', header: 'Item', sortable: true,
    },
    {
        field: 'type', header: 'Type',
        sortable: true
    },
    {
        field: 'price', header: 'Price',
    },
    {
        field: 'stock', body: (value) => {
          return  <div className='flex flex-col gap-2 max-w-fit '>
            {(value.wearHouseStock + value.stock) > 0 ?
            <Tag className='mr-2'> <Badge status="success"
                text={<span>Available: {value.wearHouseStock + value.stock ?? 0}</span>} />
            </Tag> :
            <Tag className='mr-2'> <Badge status="error"
                text={"Out of stock"} />
            </Tag> }

        </div>
        } , header: 'Stock',
    },


]



