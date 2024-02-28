import React, { ReactNode } from 'react';
import DashboardLayout from '../components/WebLayout';

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <DashboardLayout>
            {/* Add your layout components here */}
            {children}
        </DashboardLayout>
    );
};

export default Layout;