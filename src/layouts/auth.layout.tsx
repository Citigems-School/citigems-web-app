import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";

const AuthLayout = () => {
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