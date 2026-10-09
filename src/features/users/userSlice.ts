import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

interface UsersState {
    data: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    data: [],
    loading: false,
    error: null
}
const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        // cac actions
        fetchUsersRequest: (state) => {
            console.log('fetchUsersRequest')

            state.loading = true,
                state.error = null
        },
        fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
            console.log('fetchUsersSuccess')

            state.loading = false,
                state.data = action.payload
        },
        fetchUsersFailure: (
            state, action: PayloadAction<string>
        ) => {
            console.log('fetchUsersFailure')

            state.loading = false,
                state.error = action.payload
        }
    }
})

export const {
    fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure
} = userSlice.actions

export default userSlice.reducer