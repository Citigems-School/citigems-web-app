import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import useRedirectToDashboard from "../hooks/redirects/useRedirect";

const AuthLayout = () => {
    useRedirectToDashboard();
    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Outlet />
            </div>
        </>
    )
}

export default AuthLayout;