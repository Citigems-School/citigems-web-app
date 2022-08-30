import { Action, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
import usersReducer from './reducers/usersSlice';
import adminsReducer from "./reducers/adminsSlice";
import parentsReducer from "./reducers/parentsSlice";
import studentsReducer from "./reducers/studentsSlice";
import teachersReducer from "./reducers/teachersSlice";
import classesReducer from "./reducers/classesSlice";

import { useDispatch } from 'react-redux'

export const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    admins: adminsReducer,
    parents: parentsReducer,
    students: studentsReducer,
    teachers: teachersReducer,
    classes: classesReducer
  }
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;
export const useAppThunkDispatch = () => useDispatch<ThunkAppDispatch>();
