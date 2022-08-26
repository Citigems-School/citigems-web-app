import { isNil } from "lodash";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../useAuth";

const useRedirectToDashboard = () => {
    const navigate = useNavigate();
    const { isFetched, user } = useAuth();

    useEffect(() => {
        if (isFetched) {
            if (!isNil(user) && user.role === "admin") {
                navigate("/admin/dashboard/")
            } else {
                navigate("/auth/login")
            }
        }
    }, [isFetched, user])

}

export default useRedirectToDashboard;