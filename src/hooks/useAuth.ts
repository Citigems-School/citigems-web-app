import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const useAuth = () => {

    const userSelector = useSelector((state: RootState) => state.user)
    
    return userSelector;
};

export default useAuth;