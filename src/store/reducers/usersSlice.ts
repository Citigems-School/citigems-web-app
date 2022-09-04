import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { child, equalTo, get, orderByChild, push, query, ref, remove, set, update } from 'firebase/database';
import _, { defaults, isNil, omitBy } from 'lodash';
import { toArray } from 'lodash';
import { ErrorResponse } from '../../models/ErrorResponse';
import { User, userDefaultObject } from '../../models/User';
import { db } from '../../utils/firebase';

interface UsersState {
  users: User[],
  error?: ErrorResponse | undefined,
  loading: boolean,
  counts: {
    total: number,
    admins: number,
    students: number,
    teachers: number,
    parents: number,
  }
}

const initialState: UsersState = {
  users: [],
  loading: false,
  counts: {
    total: 0,
    admins: 0,
    students: 0,
    teachers: 0,
    parents: 0
  }
}

export const countUsers = createAsyncThunk(
  'users/countUsers',
  async (payload, { rejectWithValue }) => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'app_users'));
      const countTotal = await snapshot.size;

      const adminQuery = query(ref(db, 'app_users'), orderByChild("role"), equalTo("admin"))
      const adminsSnapshot = await get(adminQuery);
      const countAdmins = await adminsSnapshot.size;

      const studentsSnapshot = await get(child(dbRef, 'stakeholders/students/registered'));
      const countStudents = await studentsSnapshot.size;

      const parentsSnapshot = await get(child(dbRef, 'stakeholders/parents'));
      const countParents = await parentsSnapshot.size;

      const teachersSnapshot = await get(child(dbRef, 'stakeholders/teachers'));
      const countTeachers = await teachersSnapshot.size;

      return {
        code: 200, response: {
          total: countTotal,
          admins: countAdmins,
          students: countStudents,
          parents: countParents,
          teachers: countTeachers,
        }
      }
    } catch (e) {
      return rejectWithValue({ code: 500, message: 'Error in fetching data' })
    }
  }
)

export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (payload, { rejectWithValue }) => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'app_users'));
      return {
        code: 200,
        response: toArray(snapshot.val())
      };
    } catch (e) {
      return rejectWithValue({ code: 500, message: 'Error in fetching data' })
    }
  }
)
export const removeUser = createAsyncThunk(
  "users/removeUser",
  async (payload: string, { rejectWithValue }) => {
    if (payload !== "" || isNil(payload)) {
      try {
        const userRef = ref(db, "/app_users/" + payload);
        remove(userRef);
        return {
          code: 200,
          response: payload
        }
      } catch (e) {
        console.error(e);
        return rejectWithValue({ code: 500, message: 'Error in removing user' })

      }
    } else {
      return rejectWithValue({ code: 500, message: 'Error in removing user ( empty id )' })
    }


  }
)

export const editUser = createAsyncThunk(
  'users/editUser',
  async (payload: User, { rejectWithValue }) => {
    if (!isNil(payload.child_key))
      payload.child_key = (typeof payload.child_key !== "string") ? payload.child_key.join(', ') : payload.child_key
    try {
      const refDb = ref(db);
      const updates = {}
      //@ts-ignore
      updates['/app_users/' + payload.user_id] = omitBy(defaults(payload, userDefaultObject), isNil);
      update(refDb, updates);
      return {
        code: 200,
        response: payload
      }
    } catch (e) {
      console.error(e);
      return rejectWithValue({ code: 500, message: 'Error in removing user' })

    }
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (payload: User, { rejectWithValue }) => {
    if (!isNil(payload.child_key))
      payload.child_key = (typeof payload.child_key !== "string") ? payload.child_key.join(', ') : payload.child_key
    try {
      switch (payload.role) {
        case "parent":{
          break;
        }
        default: {
          payload.parent_key = "";
          payload.child_key = "";
          break;
        }
      }
      await set(ref(db, '/app_users/' + payload.user_id), omitBy(defaults(payload, userDefaultObject), isNil))
      return {
        code: 200,
        response: payload
      }
    } catch (e) {
      console.error(e);
      return rejectWithValue({ code: 500, message: 'Error in adding user' })

    }
  }
)

export const usersSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [countUsers.typePrefix + '/pending']: (state, action) => {
      state.loading = true;
    },
    [countUsers.typePrefix + '/fulfilled']: (state, action) => {
      state.loading = false;
      if (action.payload.code === 200) {
        state.counts = action.payload.response;
      }
    },
    [countUsers.typePrefix + '/rejected']: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [getUsers.typePrefix + '/pending']: (state, action) => {
      state.loading = true;
      state.users = [];
    },
    [getUsers.typePrefix + '/fulfilled']: (state, action) => {
      state.loading = false;
      if (action.payload.code === 200) {
        state.users = action.payload.response
      }
    },
    [getUsers.typePrefix + '/rejected']: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },


    [removeUser.typePrefix + '/pending']: (state, action) => {
      state.loading = true;
    },
    [removeUser.typePrefix + '/fulfilled']: (state, action) => {
      state.loading = false;
      if (action.payload.code === 200) {
        _.remove(state.users, (user) => user.user_id === action.payload.response);
      }
    },
    [removeUser.typePrefix + '/rejected']: (state, action) => {
      state.loading = false;
    },


    [editUser.typePrefix + '/pending']: (state, action) => {
      state.loading = true;
    },
    [editUser.typePrefix + '/fulfilled']: (state, action) => {
      state.loading = false;
      if (action.payload.code === 200) {
        state.users = state.users.map((user) =>
          user.user_id === action.payload.response.user_id ? action.payload.response : user
        )
      }
    },
    [editUser.typePrefix + '/rejected']: (state, action) => {
      state.loading = false;
    },

    [addUser.typePrefix + '/pending']: (state, action) => {
      state.loading = true;
    },
    [addUser.typePrefix + '/fulfilled']: (state, action) => {
      state.loading = false;
      state.users.unshift(action.payload.response)
    },
    [addUser.typePrefix + '/rejected']: (state, action) => {
      state.loading = false;
    },
  },
});





// selectors
export const selectUsers = (state: UsersState) => state.users;
export const loadingUsers = (state: UsersState) => state.loading;
export const errorUSers = (state: UsersState) => state.error;
// actions
export const { } = usersSlice.actions

export default usersSlice.reducer;