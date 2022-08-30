import { isNil } from "lodash";
import { useEffect } from "react";
import { Location, useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../useAuth";

const useRedirectToDashboard = () => {
    const { pathname } = useLocation();


    const navigate = useNavigate();
    const { isFetched, user } = useAuth();

    useEffect(() => {
        if (isFetched) {
            if ((isNil(user) || user.role !== "admin") && pathname.includes("admin")) {
                navigate("/auth/login")
            } else if ((!isNil(user) && user.role === "admin") && pathname.includes("auth")) {
                navigate("/admin/dashboard")
            } else if (pathname === "/") {
                navigate("/auth/login")
            }
        }
    }, [isFetched, user])

}

export default useRedirectToDashboard;
