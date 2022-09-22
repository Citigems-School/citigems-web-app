import Icon, {
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
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
import { useTranslation } from 'react-i18next';
import ChangeLanguageDropdown from 'components/change-lang-dropdown.component';

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





const AdminDashboardLayout = () => {
    const { t } = useTranslation();

    const items: MenuItem[] = [
        getItem(t('dashboard.dashboard'), '/admin/dashboard', <PieChartOutlined />),
        getItem(t('dashboard.users'), '/admin/dashboard/users', <UserOutlined />),
        getItem(t('dashboard.stakeholders'), 'stakeholders', <TeamOutlined />, [
            getItem(t('dashboard.admins'), '/admin/dashboard/stakeholders/admins'),
            getItem(t('dashboard.parents'), '/admin/dashboard/stakeholders/parents'),
            getItem(t('dashboard.students'), '/admin/dashboard/stakeholders/students'),
            getItem(t('dashboard.teachers'), '/admin/dashboard/stakeholders/teachers'),
    
        ]),
        getItem(t('dashboard.classes'), '/admin/dashboard/classes',
            <Icon
                className="i20"
                component={
                    Class20Regular as ForwardRefExoticComponent<any>
                }
            />
        ),
        getItem(t('dashboard.announcement'), '/admin/dashboard/announcements',
            <Icon
                className="i20"
                component={
                    DocumentOnePage20Regular as ForwardRefExoticComponent<any>
                }
            />
        ),
        getItem(t('dashboard.articles'), '/admin/dashboard/articles',
            <Icon
                className="i20"
                component={
                    DocumentText20Regular as ForwardRefExoticComponent<any>
                }
            />
        ),
        getItem(t('dashboard.records'), '/admin/dashboard/records', <TeamOutlined />, [
            getItem(t('dashboard.attendance'), 'admin/dashboard/records/attendance'),
            getItem(t('dashboard.scores'), 'admin/dashboard/scores'),
        ]),
    ];

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
                <title>{t('dashboard.admin_dashboard')}</title>
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
                <Layout className="site-layout" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                    <Header style={{ padding: 0, backgroundColor: "transparent" }} />
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: '1' }}></div>
                        <ChangeLanguageDropdown />
                    </div>

                    <Content style={{ margin: '0 16px' }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default AdminDashboardLayout;