
import { Payments, Sale } from '@/types/typings';
import { Button, Input, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { RollbackOutlined } from '@ant-design/icons';

const StatusComponent = ({ status }: { status: number }) => {
  let color = "red";
  let title = "Pending";
  switch (status) {
    case 1:
      color = "green";
      title = "Paid";
      break;
    case 2:
      color = "blue";
      title = "Credit";
      break;
    default:
      break;
  }

  return <Tag color={color}>{title}</Tag>;
};

export const ClinetDetailColumns: ColumnsType<Sale & Payments> = [
  {
    title: 'Item',
    dataIndex: 'item',
    key: 'item',
    render: (text: string, record) => {
      return <Tooltip placement="bottomLeft" title={<p className=' text-xs '>{record.item?.name}</p>} >{record.item?.name}</Tooltip>
    },
    sorter: {
      compare: (a, b) => a.item?.name.localeCompare(b.item?.name),
      multiple: 1,
    }
    ,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Type',
    dataIndex: 'item.type',
    key: 'item.type',
    render(_, record) {
      return record.item?.type;
    },
    width: 80,
    sorter: {
      compare: (a, b) => a.item?.type?.localeCompare(b.item?.type),
      multiple: 2
    },
  },
  {
    title: 'price',
    dataIndex: 'sell_price',
    key: 'sell_price',
    width: 50,
  },
  {
    title: 'Qty',
    dataIndex: 'sell_quantity',
    key: 'sell_quantity',
    width: 50,
  },
  {
    title: 'T/A',
    dataIndex: 'total_amount',
    key: 'total_amount',
    width: 50,
  },

  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (_, record) => <StatusComponent status={record.status ?? 0} />,
    sorter: {
      compare: (a, b) => a.status && b.status ? a.status - b.status : 0,
      multiple: 5,
    },
    width: 80,
    defaultSortOrder: "ascend"
  },
  {
    title: 'Sold At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render(_, { createdAt, paidOn }) {
      return <>
        <Tag color={"default"}><span>Sold: {moment(createdAt).format("DD-MM-YYYY")}</span></Tag>
      </>
    },
    width: 130,
    sorter: {
      compare: (a, b) => {
        const dateA: Date = moment(a.createdAt, "DD-MM-YY").toDate();
        const dateB: Date = moment(b.createdAt, "DD-MM-YY").toDate();
        return dateA.getTime() - dateB.getTime();
      },
      multiple: 3
    },
  },
  {
    title: 'Paid At',
    dataIndex: 'paidOn',
    key: 'paidOn',
    render(_, { paidOn }) {
      return <>
        {paidOn ? <Tag color={"default"}><span>Paid: {moment(paidOn).format("DD-MM-YYYY")}</span></Tag> : <small>No Date Available</small>}
      </>
    }
    ,
    width: 130,
    sorter: {
      compare: (a, b) => {
        const dateA: Date = moment(a.createdAt, "DD-MM-YY").toDate();
        const dateB: Date = moment(b.createdAt, "DD-MM-YY").toDate();
        return dateA.getTime() - dateB.getTime();
      },
      multiple: 4
    }
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: 100,
    render: (_, record) => {
      return <div className='p-buttonset'>
        <Button size='small' icon={<RollbackOutlined />} type='default' danger />
      </div>
    }
  }
];

export const paymentHistoryColumns: ColumnsType<Payments & Sale> = [
  {
    title: 'Index',
    dataIndex: 'key',
    rowScope: 'row',
    render(_, __, index) {
      return <span>{index + 1}</span>;
    },
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render(_, record) {
      return record.amount;
    },
    sorter: {
      compare: (a, b) => a.amount - b.amount,
      multiple: 2
    },
  },
  {
    title: 'Details',
    dataIndex: 'details',
    key: 'details',
    render: (value) =>  {
     console.log(value)
     return value ? <Typography  > <pre className="text-xs">
        {Object.keys(value).map((key, index) => <div key={index}>{`${key}: ${value[key]}`}</div>)}
    </pre> </Typography> : ''
    }
  },
  {
    title: 'Date',
    dataIndex: 'paymentDate',
    key: 'paymentDate',
  },
];
