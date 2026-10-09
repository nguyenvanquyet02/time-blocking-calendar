import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export interface PostsState {
    data: Post[];
    loading: boolean;
    error: string | null;
}

const initialState: PostsState = {
    data: [],
    loading: false,
    error: null,
};
// async thunk
export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async () => {
        console.log('fetch')
        const res = await fetch("https://jsonplaceholder.typicode.com/posts")
        if (!res.ok) {
            throw new Error("Failed to fetch posts!");
        }
        const data: Post[] = await res.json();
        return data
    }
)
// slice
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPosts.pending, (state) => {
            console.log('pending')
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                console.log('fulfilled')
                state.loading = false;
                state.data = action.payload
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                console.log('rejected')
                state.loading = false;
                state.error = action?.error.message || "Error!"
            })
    }
})

export default postsSlice.reducer;