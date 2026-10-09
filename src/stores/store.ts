import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/couter/counterSlice";
// import { loggerMiddleware, middlewareA } from "../middlewares/loggerMiddleware";
import postsReducer from "../features/posts/postsSlice";
import usersReducer from "../features/users/userSlice";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../features/users/userSaga";


const sagaMiddleware = createSagaMiddleware() // tao middleware saga

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        posts: postsReducer,
        users: usersReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware)
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(loggerMiddleware).concat(middlewareA), // getDefaultMiddleware redux toolkit đã cung cấp sẵn
});

sagaMiddleware.run(rootSaga) // saga middleware chay rootSaga

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;