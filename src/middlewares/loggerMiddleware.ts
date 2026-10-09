import type { Middleware } from "@reduxjs/toolkit";

export const loggerMiddleware: Middleware =
    (store) => (next) => (action) => {
        console.log("Before:", store.getState());
        console.log("Action:", action);

        const result = next(action);

        console.log("After:", store.getState());
        console.log("result:", result);

        return result;
    };

export const middlewareA: Middleware =
    (store) => (next) => (action) => {
        console.log("A:", store.getState());

        return next(action);
    };