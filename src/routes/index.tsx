import { ElementType, lazy, Suspense } from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';

// Layout

import AdminDashboardLayout from '../layouts/admin-dashboard.layout';
import AuthLayout from '../layouts/auth.layout';

// components

import Loading from '../components/public.components/loading.component';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { pathname } = useLocation();

    return (
        <Suspense
            fallback={<Loading />}>
            <Component {...props} />
        </Suspense>
    );
};


export default function Router() {
    return useRoutes([
        {
            path: '/',
            element: <Index />,
        },
        {
            path: '/auth',
            element: <AuthLayout />,
            children: [
                {
                    path: '/auth/login/',
                    element: <Login />,
                }
            ],
        },
        {
            path: '/admin',
            element: <AdminDashboardLayout></AdminDashboardLayout>,
            children: [
                { element: <Navigate to="/admin/dashboard" replace />, index: true },
                {
                    path: 'dashboard',
                    children: [
                        { path: '', element: <Dashboard /> },
                        { path: 'users', element: <UsersPage /> },
                        { path: 'stakeholders/admins', element: <StackholderAdminPage /> },
                        { path: 'stakeholders/parents', element: <StackholderParentsPage /> },
                        { path: 'stakeholders/students', element: <StackholderStudentsPage /> },
                        { path: 'stakeholders/teachers', element: <StackholderTeachersPage /> },
                        { path: 'classes', element: <ClassesPage /> },

                    ]
                }
            ]
        },
        {
            path: '*',
            children: [
                { path: '404', element: <NotFound /> },
                { path: '*', element: <Navigate to="/404" replace /> },
            ],
        },
        { path: '*', element: <Navigate to="/404" replace /> },
    ]);
}

//Home
const Index = Loadable(lazy(() => import('../pages/index.page')));

//Auth
const Login = Loadable(lazy(() => import('../pages/auth/login.page')));

//Admin
const Dashboard = Loadable(lazy(() => import('../pages/admin/dashboard/index.page')));
const UsersPage = Loadable(lazy(() => import('../pages/admin/dashboard/users.page')));
const StackholderAdminPage = Loadable(lazy(() => import('../pages/admin/dashboard/stackholder-admin.page')));
const StackholderParentsPage = Loadable(lazy(() => import('../pages/admin/dashboard/stackholder-parents.page')));
const StackholderStudentsPage = Loadable(lazy(() => import('../pages/admin/dashboard/stackholder-students.page')));
const StackholderTeachersPage = Loadable(lazy(() => import('../pages/admin/dashboard/stackholder-teachers.page')));
const ClassesPage = Loadable(lazy(() => import('../pages/admin/dashboard/classes.page')));

//ERRORS
const NotFound = Loadable(lazy(() => import('../pages/errors/page404.page')));