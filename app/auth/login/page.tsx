'use client'
import React, { useState } from 'react'
import { authenticate } from './functrion'
import { Form, Input, Button } from 'antd'
type FieldType = {
    username: string;
    password: string;
};
const Login = () => {

    const signIn = async (values : FieldType) => {
        console.log(values)
        const res = await authenticate(values);
        console.log(res, "rssss login")
    }
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <section className="h-screen">
            <div className="container h-full px-6 py-24 mx-auto">
                <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
                    {/* <!-- Left column container with background--> */}
                    <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
                        <img
                            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                            className="w-full"
                            alt="Phone image"
                        />
                    </div>

                    {/* <!-- Right column container with form --> */}
                    <div className="md:w-8/12 lg:ml-6 lg:w-5/12">
                        <Form
                            name="loginform"
                            initialValues={{ remember: true }}
                            onFinish={signIn}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            layout='vertical'
                        >
                            <Form.Item<FieldType>
                                label="Username"
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input size='large' />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password size='large' />
                            </Form.Item>

                            <Form.Item className='text-center'>
                                <Button type="dashed" className=' shadow-md ' htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login