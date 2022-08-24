import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { child, equalTo, get, orderByChild, push, query, ref, remove, set, update } from 'firebase/database';
import _, { isNil, omitBy } from 'lodash';
import { toArray } from 'lodash';
import { ErrorResponse } from '../../models/ErrorResponse';
import { db } from '../../utils/firebase';
import { Class } from '../../models/Class';

interface ClassesState {
    classes: Class[],
    error?: ErrorResponse | undefined,
    loading: boolean
}

const initialState: ClassesState = {
    classes: [],
    loading: false,
}


export const getClasses = createAsyncThunk(
    'classes/getClasses',
    async (payload, { rejectWithValue }) => {
        try {
            const dbRef = ref(db);
            const snapshot = await get(child(dbRef, '/classes/'));
            const keys = Object.keys(snapshot.val());
            const classes = toArray<Class>(snapshot.val());
            classes.forEach((classObject, index) => {
                classObject.class_name = keys[index];
            })
            return {
                code: 200,
                response: classes
            };
        } catch (e) {
            return rejectWithValue({ code: 500, message: 'Error in fetching data' })
        }
    }
)
export const removeClass = createAsyncThunk(
    "classes/removeClass",
    async (payload: string, { rejectWithValue }) => {
        try {
            const ClassRef = ref(db, "/classes/" + payload);
            remove(ClassRef);
            return {
                code: 200,
                response: payload
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: 'Error in removing Class' })

        }

    }
)

export const editClass = createAsyncThunk(
    'classes/editClass',
    async (payload: any, { rejectWithValue }) => {
        try {
            const refDb = ref(db);
            const updates = {}
            //@ts-ignore
            updates['/classes/' + payload.class_name] = {
                ...payload,
                student_ids: (payload.student_ids as String[]).join(', ')
            };
            update(refDb, updates);
            return {
                code: 200,
                response: {
                    ...payload,
                    student_ids: (payload.student_ids as String[]).join(', ')
                }
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: e })
        }
    }
);

export const addClass = createAsyncThunk(
    'classes/addClass',
    async (payload: any, { rejectWithValue }) => {
        console.log(payload.student_ids);
        try {
            await set(ref(db, '/classes/' + payload.class_name), omitBy({
                ...payload,
                student_ids: (payload.student_ids as String[]).join(', ')
            }, isNil))
            return {

                code: 200,
                response: {
                    ...payload,
                    student_ids: (payload.student_ids as String[]).join(', ')
                }
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: 'Error in adding Class' })

        }
    }
)

export const classesSlice = createSlice({
    name: 'classes',
    initialState: initialState,
    reducers: {},
    extraReducers: {


        [getClasses.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
            state.classes = [];
        },
        [getClasses.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.classes = action.payload.response
            }
        },
        [getClasses.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },


        [removeClass.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [removeClass.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                _.remove(state.classes, (classObject) => classObject.class_name === action.payload.response);
            }
        },
        [removeClass.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },


        [editClass.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [editClass.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.classes = state.classes.map((classObject) =>
                    classObject.class_name === action.payload.response.class_name ? action.payload.response : classObject
                )
            }
        },
        [editClass.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },


        [addClass.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [addClass.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.classes.push(action.payload.response)
            }
        },
        [addClass.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },
    },
});





// selectors
export const selectClasses = (state: ClassesState) => state.classes;
export const loadingClasses = (state: ClassesState) => state.loading;
export const errorClasses = (state: ClassesState) => state.error;
// actions
export const { } = classesSlice.actions

export default classesSlice.reducer;