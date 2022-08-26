import Icon, {
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {  Layout, Menu } from 'antd';
import React, { ForwardRefExoticComponent, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useRedirect from "../hooks/redirects/useRedirect";
import { xor } from "lodash";
import { Class20Regular, DocumentOnePage20Regular, DocumentText20Regular } from '@ricons/fluent';
import { useAppThunkDispatch } from '../store/store';
import { getUsers } from '../store/reducers/usersSlice';
import { getAdmins } from '../store/reducers/adminsSlice';
import { getParents } from '../store/reducers/parentsSlice';
import { getStudents } from '../store/reducers/studentsSlice';
import { getTeachers } from '../store/reducers/teachersSlice';
import { getClasses } from '../store/reducers/classesSlice';
import { Helmet } from 'react-helmet';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}


const items: MenuItem[] = [
    getItem('Dashboard', '/admin/dashboard', <PieChartOutlined />),
    getItem('Users', '/admin/dashboard/users', <UserOutlined />),
    getItem('Stakeholders', 'stakeholders', <TeamOutlined />, [
        getItem('Admins', '/admin/dashboard/stakeholders/admins'),
        getItem('Parents', '/admin/dashboard/stakeholders/parents'),
        getItem('Students', '/admin/dashboard/stakeholders/students'),
        getItem('Teachers', '/admin/dashboard/stakeholders/teachers'),

    ]),
    getItem('Classes', '/admin/dashboard/classes',
        <Icon
            className="i20"
            component={
                Class20Regular as ForwardRefExoticComponent<any>
            }
        />
    ),
    getItem('Announcement', '/admin/dashboard/announcements',
        <Icon
            className="i20"
            component={
                DocumentOnePage20Regular as ForwardRefExoticComponent<any>
            }
        />
    ),
    getItem('Articles', '/admin/dashboard/articles',
        <Icon
            className="i20"
            component={
                DocumentText20Regular as ForwardRefExoticComponent<any>
            }
        />
    ),
    getItem('Records', 'records', <TeamOutlined />, [
        getItem('Attendance', 'admin/dashboard/records/attendance'),
        getItem('Scores', 'admin/dashboard/scores'),
    ]),
];


const AdminDashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedMenuItems = location.pathname?.split("/").slice(1);
    const selectedMenuItem = selectedMenuItems.join("/");
    const [openKeys, setOpenKeys] = useState([
        selectedMenuItems[0] + "/" + selectedMenuItems[1],
        selectedMenuItems[0]
    ]);
    useRedirect();
    const thunkDispatch = useAppThunkDispatch();

    useEffect(() => {
        thunkDispatch(getUsers());
        thunkDispatch(getAdmins());
        thunkDispatch(getParents());
        thunkDispatch(getStudents());
        thunkDispatch(getTeachers());
        thunkDispatch(getClasses());

    }, [thunkDispatch]);

    return (
        <>
                <Helmet>
                    <title>Admin Dashboard</title>
                </Helmet>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                        <div style={{ padding: "20px 10px" }}>
                            {
                                collapsed ?
                                    <img alt="logo" src="/images/logo/logo-icon-yellow-only.png" width="100%" />
                                    :
                                    <img alt="logo" src="/images/logo/logo-fulltext.png" width="100%" />
                            }
                        </div>
                        <Menu theme="dark" mode="inline" items={items} defaultSelectedKeys={[selectedMenuItem]}
                            selectedKeys={[selectedMenuItem]}
                            defaultOpenKeys={
                                !collapsed
                                    ? [
                                        selectedMenuItems[0] + "/" + selectedMenuItems[1],
                                        selectedMenuItems[0]
                                    ]
                                    : undefined
                            }
                            onSelect={(selected) => navigate(selected.key)}
                            openKeys={openKeys}
                            onOpenChange={(ok) => {
                                let diff = xor(ok, openKeys)[0];
                                setOpenKeys(
                                    diff?.split("/").length > 1
                                        ? ok.indexOf(diff) < 0
                                            ? ok
                                            : openKeys.concat(diff)
                                        : ok.indexOf(diff) < 0
                                            ? []
                                            : [diff]
                                );
                            }}
                            inlineIndent={20} />
                    </Sider>
                    <Layout className="site-layout">
                        <Header style={{ padding: 0, backgroundColor: "transparent" }} />
                        <Content style={{ margin: '0 16px' }}>
                            <Outlet />
                        </Content>
                    </Layout>
                </Layout>
            </>
            )
}

            export default AdminDashboardLayout;