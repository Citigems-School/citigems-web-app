import {AsyncThunk, createAsyncThunk, createSlice, Slice} from '@reduxjs/toolkit';
import { child, equalTo, get, orderByChild, push, query, ref, remove, update } from 'firebase/database';
import _, { defaults, isNil, omitBy } from 'lodash';
import { toArray } from 'lodash';
import { ErrorResponse } from '../../models/ErrorResponse';
import { db } from '../../utils/firebase';
import { Parent, parentDefaultObject } from '../../models/Parent';
import { selectStudents, StudentsState } from './studentsSlice';
import { RootState } from '../store';
import { Student } from 'models/Student';

interface ParentsState {
    parents: Parent[],
    error?: ErrorResponse | undefined,
    loading: boolean
}

const initialState: ParentsState = {
    parents: [],
    loading: false,
}

interface StudentState {
    studentsState: StudentsState
}

interface Result {
    code: number;
    response?: Parent;
    message?: string;
}


export const getParents = createAsyncThunk(
    'Parents/getParents',
    async (payload, { rejectWithValue }) => {
        try {
            const dbRef = ref(db);
            const snapshot = await get(child(dbRef, '/stakeholders/parents/'));
            const keys = Object.keys(snapshot.val());
            const parents = toArray<Parent>(snapshot.val());
            parents.forEach((Parent, index) => {
                Parent.objectKey = keys[index];
            })
            return {
                code: 200,
                response: parents
            };
        } catch (e) {
            return rejectWithValue({ code: 500, message: 'Error in fetching data' })
        }
    }
)
export const removeParent = createAsyncThunk(
    "Parents/removeParent",
    async (payload: string, { rejectWithValue }) => {
        try {
            const ParentRef = ref(db, "/stakeholders/parents/" + payload);
            remove(ParentRef);
            return {
                code: 200,
                response: payload
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: 'Error in removing Parent' })

        }

    }
)

export const editParent = createAsyncThunk(
    'Parents/editParent',
    async (payload: Parent, { rejectWithValue, getState }) => {
        try {
            payload.number_of_children = payload.child_name.length.toString();
            let children_names: string[] = [];
            const { student } = getState() as { student: StudentsState };
            (payload.child_name as string[]).forEach((childId) => {
                const childObj = student.students.registered.concat(student.students.unregistered).find(s => s.student_key === childId);
                children_names.push(childObj?.first_name + " " + childObj?.last_name)
            })
            payload.child_name = children_names.join(', ');
            const refDb = ref(db);
            const updates = {}
            //@ts-ignore
            updates['/stakeholders/parents/' + payload.objectKey] = omitBy(defaults(payload, parentDefaultObject), isNil);
            update(refDb, updates);
            return {
                code: 200,
                response: defaults(payload, parentDefaultObject)
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: e })

        }
    }
);

export const addParent = createAsyncThunk(
    'Parents/addParent',
    async ({newParent,students}: {
        newParent:Parent,
        students:Student[]
    }, {rejectWithValue}) => {

        try {
            newParent.number_of_children = newParent.child_name.length.toString();
            let children_names: string[] = [];

            (newParent.child_name as string[]).forEach((childId) => {
                const childObj = students.find(s => s.student_key === childId);
                children_names.push(childObj?.first_name + " " + childObj?.last_name)
            })
            newParent.child_name = children_names.join(', ');
            const response = await push(ref(db, '/stakeholders/parents/'), omitBy(defaults(newParent, parentDefaultObject), isNil))
            const ParentObjectWithId = {
                ...newParent,
                objectKey: response.key
            }
            return {

                code: 200,
                response: {
                    ...ParentObjectWithId
                }
            }
        } catch (e) {
            console.error(e);
            return rejectWithValue({ code: 500, message: 'Error in adding Parent' })

        }
    }
)

export const parentsSlice: Slice<ParentsState, {}, string> = createSlice({
    name: 'Parents',
    initialState: initialState,
    reducers: {},
    extraReducers: {

        [getParents.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
            state.parents = [];
        },
        [getParents.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.parents = action.payload.response
            }
        },
        [getParents.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },


        [removeParent.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [removeParent.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                _.remove(state.parents, (parent) => parent.objectKey === action.payload.response);
            }
        },
        [removeParent.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },


        [editParent.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [editParent.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.parents = state.parents.map((parent) =>
                    parent.objectKey === action.payload.response.objectKey ? action.payload.response : parent
                )
            }
        },
        [editParent.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },

        [addParent.typePrefix + '/pending']: (state, action) => {
            state.loading = true;
        },
        [addParent.typePrefix + '/fulfilled']: (state, action) => {
            state.loading = false;
            if (action.payload.code === 200) {
                state.parents.push(action.payload.response)
            }
        },
        [addParent.typePrefix + '/rejected']: (state, action) => {
            state.loading = false;
        },
    },
});





// selectors
export const selectParents = (state: ParentsState) => state.parents;
export const loadingParents = (state: ParentsState) => state.loading;
export const errorParents = (state: ParentsState) => state.error;
// actions
export const { } = parentsSlice.actions

export default parentsSlice.reducer;