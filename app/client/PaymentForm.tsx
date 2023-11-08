import React from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, Select, Space, Typography } from 'antd';
import moment from 'moment';
import { Client } from '@/typings';

const onFinish = (values: any) => {
  console.log('Received values of form:', values);
};

const defaultValues= {
    client: "",
    amount: 0,
    paymentDate: null,
    paymentType: ""
}
const PaymentForm = ({clients}:{clients : Array<Client>}) => {
    const [form] = Form.useForm<typeof defaultValues>();
  return <Form
    name="dynamic_form_nest_item"
    onFinish={onFinish}
    autoComplete="off"
    layout='vertical'
    size='large'
    
  >
    <Form.List name="payments" initialValue={[defaultValues]}>
      {(fields, { add, remove }) => (
        <div>
          {fields.map(({ key, name, ...restField }) => (
            <div key={key} className='flex gap-3 ' >
              <Form.Item className='flex-1'
              label="Select Client"
                {...restField}
                name={[name, 'client']}
                rules={[{ required: true, message: 'Missing client name' }]}
              >
                <Select className='flex-1' placeholder="First Name" options={clients ?? []} 
                fieldNames={{label : "name" , value : "_id"}} showSearch
                filterOption={(input, option) =>
                    (option?.name?.toLocaleLowerCase() ?? '').includes(input.toLocaleLowerCase())} />
              </Form.Item>
              <Form.Item
              label="Enter Amount"
                {...restField}
                name={[name, 'amount']}
                rules={[{ required: true, message: 'Amount value is required' , type : 'number', min :1  }]}
              >
                <InputNumber   parser={(value) => value ? parseInt(value) : 0}  className='w-full' placeholder="Last Name" />
              </Form.Item>
              <Form.Item
              label="Select Date"
                {...restField}
                name={[name, 'paymentDate']}
                rules={[{ required: true, message: 'Select a date' , type : "date",  }]}
              >
                <DatePicker disabledDate={(current) => current.isAfter(new Date())} format={"DD/MM/YY"}  className='w-full' placeholder="Select Date"  />
              </Form.Item>
            { fields.length > 1 && <MinusCircleOutlined onClick={() => remove(name)} />}
            </div>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add(defaultValues)} block icon={<PlusOutlined />}>
              Add field
            </Button>
          </Form.Item>
        </div>
      )}
    </Form.List>
    <Form.Item>
      <Button  type="dashed" size='middle' htmlType="submit" ghost>
        Submit
      </Button>
    </Form.Item>
    {/* <Typography>
        <pre>Values: {JSON.stringify( Form.se,null , 2)}</pre>
      </Typography> */}
  </Form>
};

export default PaymentForm;