'use client'
import React, { useState } from 'react'
import { authenticate } from './functrion'
import { Form, Input, Button } from 'antd'
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation'
type FieldType = {
    username: string;
    password: string;
};
const Login = () => {
    const router = useRouter();
    const { data: session } = useSession()
    if (session?.user.email) {
        redirect(`/`)
    }
    const { mutate: signFn, isPending } = useMutation({
        mutationFn: authenticate,
        onSuccess: (data) => {
            let url = new URL(data);
            let callbackUrl = url.searchParams.get("callbackUrl");
            console.log(callbackUrl)
            router.replace( callbackUrl ?? "/");

        },
        onError: (error) => {
            console.log(error);
        }
    })
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
                            onFinish={signFn}
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
                                <Button type="dashed" className=' shadow-md ' htmlType="submit" disabled={isPending} loading={isPending}>
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