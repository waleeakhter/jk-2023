import React, { useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Flex, Form, Input, InputNumber, Select, Space, Typography, notification } from 'antd';
import { Client } from '@/types/typings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

const PaymentForm = ({ clients }: { clients: Array<Client> }) => {
  const [date, setDate] = useState(dayjs("2024-04-05T00:00:00.000Z"))
  const defaultValues = {
    client: "",
    amount: 0,
    paymentDate: dayjs(date),
    paymentType: ""
  }
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient()
  const [amount, setAmount] = React.useState(0)
  const { mutate: addPayment, isPending } = useMutation({
    mutationFn: (values) => {

      return fetch('/api/client/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: "no-cache",
        body: JSON.stringify(values),
      })
    },
    onSuccess: async (res) => {
      const rest = await res.json();
      if (rest?.success) {
        api.success({
          message: "Success",
          description: rest?.message,
          "placement": "topRight",
        });

        form.resetFields();
      }
      return await queryClient.invalidateQueries({ queryKey: ['client'] });
    },
    onError: (err: Error) => {
      console.log(err)
      api.success({
        message: "Error",
        description: "Something went wrong",
        "placement": "topRight",
      });

    }
  })
  return  <>
      <DatePicker value={date} onChange={(e) => {setDate(e ?? dayjs(new Date())); form.resetFields()}}   disabledDate={(current) => current.isAfter(new Date())} format={"DD/MM/YY"} className='w-full' placeholder="Select Date" />

  <Form
  initialValues={defaultValues}
    form={form}
    name="dynamic_form_nest_item"
    onFinish={addPayment}
    autoComplete="off"
    layout='vertical'
    size='large'
    scrollToFirstError
    onValuesChange={(changedFields, allFields) => {
      console.log("changedFields", allFields?.payments as any)
      if(allFields.payments){
        const amount = allFields.payments.reduce((acc, curr) => acc + curr.amount, 0)
        setAmount(amount)
      }
    } }

  >
    {contextHolder}
    <Form.List name="payments" initialValue={[defaultValues]}>
      {(fields, { add, remove   }) => (
        <div>
          {fields.map(({ key, name, ...restField  }) => (
            <div key={key} className='flex gap-3 ' >
              <Form.Item className='flex-1'
                label="Select Client"
                {...restField}
                name={[name, 'client']}
                rules={[{ required: true, message: 'Missing client name' }]}
              >
                <Select className='flex-1' placeholder="First Name" options={clients ?? []}
                  fieldNames={{ label: "name", value: "_id" }} showSearch
                  filterOption={(input, option) =>
                    (option?.name?.toLocaleLowerCase() ?? '').includes(input.toLocaleLowerCase())} />
              </Form.Item>
              <Form.Item
                label="Enter Amount"
                {...restField}
                name={[name, 'amount']}
                rules={[{ required: true, message: 'Amount value is required', type: 'number', min: 1 }]}
              >
                <InputNumber parser={(value) => value ? parseInt(value) : 0} className='w-full' placeholder="Last Name" />
              </Form.Item>
              <Form.Item
                label="Select Date"
                {...restField}
                name={[name, 'paymentDate']}
                rules={[{ required: true, message: 'Select a date', type: "date", }]}
              >
                <DatePicker   disabledDate={(current) => current.isAfter(new Date())} format={"DD/MM/YY"} className='w-full' placeholder="Select Date" />
              </Form.Item>
              {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(name)} />}
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
    <Flex wrap="wrap" gap="small" className="site-button-ghost-wrapper" justify='end'>
      <Button loading={isPending} type="dashed" size='middle' htmlType="submit"  >
        Submit ({amount})
      </Button>
    </Flex>
    <Typography>
      <pre>Values: {JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
    </Typography>
  </Form>
  </>
};

export default PaymentForm;