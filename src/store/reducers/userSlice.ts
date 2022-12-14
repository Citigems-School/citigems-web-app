import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { child, get, onValue, ref } from 'firebase/database';
import { ErrorResponse } from '../../models/ErrorResponse';
import { LoginCredentians } from '../../models/LoginCredentials';
import { User } from '../../models/User';
import { auth, db } from '../../utils/firebase';

interface UserState {
  user?: User,
  error?: ErrorResponse | undefined,
  loading: boolean,
  isFetched: boolean,
}

const initialState: UserState = {
  loading: false,
  isFetched: false,
}

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (payload: string, { rejectWithValue }) => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'app_users/' + payload));
      const data = await snapshot.val();
      if (data) {
        return { code: 200, response: data };
      } else {
        return rejectWithValue({ code: 404, message: 'Not found' })
      }
    } catch (e) {
      return rejectWithValue({ code: 500, message: 'Error in fetching data' })
    }
  }
)
export const loginAdmin = createAsyncThunk(
  'user/login',
  async (payload: LoginCredentians, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, payload.email, payload.password);

      if (userCredential.user) {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'app_users/' + userCredential.user.uid));
        const data = await snapshot.val();
        if (data && data.role === "admin") {
          return { code: 200, response: data };
        } else {
          return rejectWithValue({ code: 404, message: 'Not found' })
        }
      } else {
        return rejectWithValue({ code: 404, message: 'Not found' })
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue({ code: 500, message: 'Error in login' })
    }
  }

)

export const registerUser = createAsyncThunk(
  'user/RegisterUser',
  async ({ email, password }: { email: string, password: string }, { rejectWithValue }) => {
    const auth = getAuth();
    let originalUser = auth.currentUser
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      getAuth().updateCurrentUser(originalUser)
      return userCredential.user.uid;
    }
    catch (e: any) {
      const errorCode = e.code;
      const errorMessage = e.message;
      return rejectWithValue({ code:errorCode, message:errorMessage })
    }
  }
)



export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    signupInit: (state) => {
      state.loading = false;
      state.error = undefined;
    },
    logout: (state) => {
      state.user = undefined;
      state.loading = false;
      state.isFetched = true;
      state.error = undefined;
    }
  },
  extraReducers: {

    [fetchUserData.typePrefix + '/pending']: (state, action) => {
      state.user = undefined;
      state.loading = true;
      state.error = undefined;
      state.isFetched = false;
    },

    [fetchUserData.typePrefix + '/fulfilled']: (state, action) => {
      if (action.payload.code === 200) {
        state.user = action.payload.response as unknown as User;
      }
      state.loading = false;
      state.isFetched = true;
    },

    [fetchUserData.typePrefix + '/rejected']: (state, action) => {
      state.user = undefined;
      state.loading = false;
      state.error = action.payload as ErrorResponse;
      state.isFetched = true;
    },

    [loginAdmin.typePrefix + '/pending']: (state, action) => {
      state.user = undefined;
      state.loading = true;
      state.error = undefined;
    },

    [loginAdmin.typePrefix + '/fulfilled']: (state, action) => {
      if (action.payload.code === 200) {
        state.user = action.payload.response as unknown as User;
      }
    },

    [loginAdmin.typePrefix + '/rejected']: (state, action) => {
      state.user = undefined;
      state.loading = false;
      state.error = action.payload as ErrorResponse;
    },

    [registerUser.typePrefix + '/pending']: (state, action) => {
      state.loading = true;
    },
    [registerUser.typePrefix + '/rejected']: (state, action) => {
      state.error = action.payload
      state.loading = false;
    }

  },
});


// selectors
export const selectUser = (state: UserState) => state?.user;
export const loadingUser = (state: UserState) => state.loading;
export const errorUSer = (state: UserState) => state.error;
// actions
export const { logout, signupInit } = userSlice.actions

export default userSlice.reducer;