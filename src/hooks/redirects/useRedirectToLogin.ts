import { isNil } from "lodash";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../useAuth";

const useRedirectToLogin = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { isFetched, user } = useAuth();

    if (isFetched) {
        if (isNil(user) || user.role !== "admin") {
            navigate("/auth/login")
        }
    }

}

export default useRedirectToLogin;