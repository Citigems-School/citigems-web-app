import { useEffect } from "react";
import { fetchUserData, logout } from "../store/reducers/userSlice";
import { useDispatch } from 'react-redux';
import {
  onAuthStateChanged,
  getAuth,
} from 'firebase/auth';
import { useAppThunkDispatch } from "../store/store";

export default function useCheckAuth() {
  const thunkDispatch = useAppThunkDispatch();
  const dispatch = useDispatch();
  const auth = getAuth();

  useEffect(() => {
    let authFlag = true;
    onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth !== null && authFlag) {
        await thunkDispatch(fetchUserData(userAuth.uid));
        authFlag = false;
      } else if (userAuth === null) {
        dispatch(logout());
      }
    });

  }, []);

  return;
}