"use client";

import React from "react";
import { ConfigProvider } from "antd";

const WithTheme = (children: JSX.Element) => (
    <>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#52c41a',
                },
            }}
        >
            <ConfigProvider
                theme={{
                    token: {
                        borderRadius: 16,
                    },
                }}
            >
                {children}
            </ConfigProvider>
        </ConfigProvider>
    </>
)

export default WithTheme;