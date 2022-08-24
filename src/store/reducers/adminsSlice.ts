import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { child, equalTo, get, orderByChild, push, query, ref, remove, update } from 'firebase/database';
import _, { isNil, omitBy } from 'lodash';
import { toArray } from 'lodash';
import { ErrorResponse } from '../../models/ErrorResponse';
import { Admin } from '../../models/Admin';
import { db } from '../../utils/firebase';

interface AdminsState {
    admins: Admin[],
    error?: ErrorResponse | undefined,
    loading: boolean
}

const initialState: AdminsState = {
    admins: [],
    loading: false,
}


export const getAdmins = createAsyncThunk(
    'Admins/getAdmins',
    async (payload, { rejectWithValue }) => {
        try {
            const dbRef = ref(db);
            const snapshot = await get(child(dbRef, '/stakeholders/admin/'));
            const keys = Object.keys(snapshot.val());
            const admins = toArray<Admin>(snapshot.val());
            admins.forEach((admin, index) => {
                admin.objectKey = keys[index];
            })
            return {
                code: 200,
                response: admins
            };
        } catch (e) {
            return rejectWithValue({ code: 500, message: 'Error in fetching data' })
        }
    }
)
export const removeAdmin = createAsyncThunk(
    "Admins/removeAdmin",
    async (payload: string, { rejectWithValue }) => {
        try {
            const AdminRef = ref(db, "/stakeholders/admin/" + payload);
            remove(AdminRef);
            return {
                code: 200,
                response: payload
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: 'Error in removing Admin' })

        }

    }
)

export const editAdmin = createAsyncThunk(
    'Admins/editAdmin',
    async (payload: Admin, { rejectWithValue }) => {
        try {
            const refDb = ref(db);
            const updates = {}
            //@ts-ignore
            updates['/stakeholders/admin/' + payload.objectKey] = payload;
            update(refDb, updates);
            return {
                code: 200,
                response: payload
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: e })

        }
    }
);

export const addAdmin = createAsyncThunk(
    'Admins/addAdmin',
    async (payload: Admin, { rejectWithValue }) => {
        try {
            const response = await push(ref(db, '/stakeholders/admin/'), omitBy(payload, isNil))
            const AdminObjectWithId = {
                ...payload,
                objectKey: response.key
            }
            return {

                code: 200,
                response: {
                    ...AdminObjectWithId
                }
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: 'Error in adding Admin' })

        }
    }
)

export const adminsSlice = createSlice({
    name: 'admins',
    initialState: initialState,
    reducers: {},
    extraReducers: {



        [getAdmins.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
            state.admins = [];
        },
        [getAdmins.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.admins = action.payload.response
            }
        },
        [getAdmins.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },


        [removeAdmin.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [removeAdmin.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                _.remove(state.admins, (admin) => admin.objectKey === action.payload.response);
            }
        },
        [removeAdmin.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },


        [editAdmin.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [editAdmin.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.admins = state.admins.map((admin) =>
                    admin.objectKey === action.payload.response.objectKey ? action.payload.response : admin
                )
            }
        },
        [editAdmin.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },

        [addAdmin.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [addAdmin.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.admins.push(action.payload.response)
            }
        },
        [addAdmin.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },
    },
});





// selectors
export const selectAdmins = (state: AdminsState) => state.admins;
export const loadingAdmins = (state: AdminsState) => state.loading;
export const errorAdmins = (state: AdminsState) => state.error;
// actions
export const { } = adminsSlice.actions

export default adminsSlice.reducer;