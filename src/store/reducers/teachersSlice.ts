import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { child, equalTo, get, orderByChild, push, query, ref, remove, update } from 'firebase/database';
import _, { defaults, isNil, omitBy } from 'lodash';
import { toArray } from 'lodash';
import { ErrorResponse } from '../../models/ErrorResponse';
import { db } from '../../utils/firebase';
import { Teacher, teacherDefaultObject } from '../../models/Teacher';

interface TeachersState {
    teachers: Teacher[],
    error?: ErrorResponse | undefined,
    loading: boolean
}

const initialState: TeachersState = {
    teachers: [],
    loading: false,
}


export const getTeachers = createAsyncThunk(
    'Teachers/getTeachers',
    async (payload, { rejectWithValue }) => {
        try {
            const dbRef = ref(db);
            const snapshot = await get(child(dbRef, '/stakeholders/teachers/'));
            const keys = Object.keys(snapshot.val());
            const teachers = toArray<Teacher>(snapshot.val());
            teachers.forEach((Teacher, index) => {
                Teacher.objectKey = keys[index];
            })
            return {
                code: 200,
                response: teachers
            };
        } catch (e) {
            return rejectWithValue({ code: 500, message: 'Error in fetching data' })
        }
    }
)
export const removeTeacher = createAsyncThunk(
    "Teachers/removeTeacher",
    async (payload: string, { rejectWithValue }) => {
        try {
            const TeacherRef = ref(db, "/stakeholders/teachers/" + payload);
            remove(TeacherRef);
            return {
                code: 200,
                response: payload
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: 'Error in removing Teacher' })

        }

    }
)

export const editTeacher = createAsyncThunk(
    'Teachers/editTeacher',
    async (payload: Teacher, { rejectWithValue }) => {
        try {
            const refDb = ref(db);
            const updates = {}
            //@ts-ignore
            updates['/stakeholders/teachers/' + payload.objectKey] = omitBy(defaults(payload,teacherDefaultObject), isNil);
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

export const addTeacher = createAsyncThunk(
    'Teachers/addTeacher',
    async (payload: Teacher, { rejectWithValue }) => {
        try {
            const response = await push(ref(db, '/stakeholders/teachers/'), omitBy(defaults(payload,teacherDefaultObject), isNil))
            const TeacherObjectWithId = {
                ...payload,
                objectKey: response.key
            }
            return {

                code: 200,
                response: {
                    ...TeacherObjectWithId
                }
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: 'Error in adding Teacher' })

        }
    }
)

export const teachersSlice = createSlice({
    name: 'Teachers',
    initialState: initialState,
    reducers: {},
    extraReducers: {



        [getTeachers.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
            state.teachers = [];
        },
        [getTeachers.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.teachers = action.payload.response
            }
        },
        [getTeachers.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },


        [removeTeacher.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [removeTeacher.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                _.remove(state.teachers, (teacher) => teacher.objectKey === action.payload.response);
            }
        },
        [removeTeacher.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },


        [editTeacher.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [editTeacher.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.teachers = state.teachers.map((Teacher) =>
                    Teacher.objectKey === action.payload.response.objectKey ? action.payload.response : Teacher
                )
            }
        },
        [editTeacher.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },

        
        [addTeacher.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [addTeacher.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.teachers.push(action.payload.response)
            }
        },
        [addTeacher.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },
    },
});





// selectors
export const selectTeachers = (state: TeachersState) => state.teachers;
export const loadingTeachers = (state: TeachersState) => state.loading;
export const errorTeachers = (state: TeachersState) => state.error;
// actions
export const { } = teachersSlice.actions

export default teachersSlice.reducer;