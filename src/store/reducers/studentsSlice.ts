import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { child, equalTo, get, orderByChild, push, query, ref, remove, update } from 'firebase/database';
import _, { defaults, isNil, omitBy } from 'lodash';
import { toArray } from 'lodash';
import { ErrorResponse } from '../../models/ErrorResponse';
import { db } from '../../utils/firebase';
import { Student, studentDefaultObject } from '../../models/Student';

export interface StudentsState {
    students: {
        registered: Student[],
        unregistered: Student[]
    },
    error?: ErrorResponse | undefined,
    loading: boolean
}

const initialState: StudentsState = {
    students: {
        registered: [],
        unregistered: []
    },
    loading: false,
}


export const getStudents = createAsyncThunk(
    'Students/getStudents',
    async (payload, { rejectWithValue }) => {
        try {
            const dbRef = ref(db);
            const snapshotRegistered = await get(child(dbRef, '/stakeholders/students/registered'));
            const snapshotUnRegistered = await get(child(dbRef, '/stakeholders/students/unregistered'));

            const regkeys = Object.keys(snapshotRegistered.val());
            const regStudents = toArray<Student>(snapshotRegistered.val());
            regStudents.forEach((student, index) => {
                student.student_key = regkeys[index];
            })

            const unRegkeys = Object.keys(snapshotUnRegistered.val());
            const unRegStudents = toArray<Student>(snapshotUnRegistered.val());
            unRegStudents.forEach((student, index) => {
                student.student_key = unRegkeys[index];
            })

            return {
                code: 200,
                response: {
                    registered: regStudents,
                    unregistered: unRegStudents
                }
            };
        } catch (e) {
            return rejectWithValue({ code: 500, message: 'Error in fetching data' })
        }
    }
)
export const removeStudent = createAsyncThunk(
    "Students/removeStudent",
    async ({ studentId, type }: { studentId: string, type: string }, { rejectWithValue }) => {
        const path = ((type === "registered") ? "/stakeholders/students/registered/" : "/stakeholders/students/unregistered/") + studentId

        try {
            const StudentRef = ref(db, path);
            remove(StudentRef);
            return {
                code: 200,
                response: studentId,
                type: type
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: 'Error in removing Student' })

        }

    }
)

export const editStudent = createAsyncThunk(
    'Students/editStudent',
    async (payload: { type: string, student: Student }, { rejectWithValue }) => {
        try {
            const refDb = ref(db);
            const updates = {}
            //@ts-ignore
            updates[`/stakeholders/students/${payload.type}/` + payload.student.student_key] = omitBy(defaults(payload.student,studentDefaultObject), isNil);
            await update(refDb, updates);
            return {
                code: 200,
                type: payload.type,
                response: payload.student
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: e })

        }
    }
);

export const addStudent = createAsyncThunk(
    'Students/addStudent',
    async (payload: { type: string, student: Student }, { rejectWithValue }) => {
        try {
            const dbUrl = '/stakeholders/students/' + payload.type + "/";
            const response = await push(ref(db, dbUrl), omitBy(defaults(payload.student,studentDefaultObject), isNil))
            const studentObjectWithId = {
                ...defaults(payload.student),
                student_key: response.key
            }
            const updates = {}
            //@ts-ignore
            updates[`/stakeholders/students/${payload.type}/` + response.key] = omitBy(studentObjectWithId, isNil);
            await update(ref(db), updates);

            return {
                code: 200,
                type: payload.type,
                response: {
                    ...studentObjectWithId
                }
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: 'Error in adding Student' })

        }
    }
)

export const studentsSlice = createSlice({
    name: 'Students',
    initialState: initialState,
    reducers: {},
    extraReducers: {

        [getStudents.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
            state.students = {
                registered: [],
                unregistered: []
            };
        },
        [getStudents.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.students = action.payload.response
            }
        },
        [getStudents.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },


        [removeStudent.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [removeStudent.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                if (action.payload.type === "registered") {
                    _.remove(state.students.registered, (student) => student.student_key === action.payload.response);
                } else {
                    _.remove(state.students.unregistered, (student) => student.student_key === action.payload.response);
                }
            }
        },
        [removeStudent.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },


        [editStudent.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [editStudent.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                if (action.payload.type === "registered") {
                    state.students.registered = state.students.registered.map((Student) =>
                        Student.student_key === action.payload.response.student_key ? action.payload.response : Student
                    )
                } else {
                    state.students.unregistered = state.students.unregistered.map((Student) =>
                        Student.student_key === action.payload.response.student_key ? action.payload.response : Student
                    )
                }

            }
        },
        [editStudent.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },

        [addStudent.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [addStudent.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.students[action.payload.type as keyof {
                    registered: Student[];
                    unregistered: Student[];
                }].push(action.payload.response)
            }
        },
        [addStudent.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },

    },
});





// selectors
export const selectStudents = (state: StudentsState) => state.students;
export const loadingStudents = (state: StudentsState) => state.loading;
export const errorStudents = (state: StudentsState) => state.error;

// actions
export const { } = studentsSlice.actions
export default studentsSlice.reducer;