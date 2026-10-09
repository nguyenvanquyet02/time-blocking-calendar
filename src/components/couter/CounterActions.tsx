import { useDispatch } from "react-redux";

import {
    increment,
    decrement,
    incrementByAmount,
} from "../../features/couter/counterSlice";
import { useEffect } from "react";
import { fetchUsersRequest } from "../../features/users/userSlice";

export function CounterActions() {
    const dispatch = useDispatch();
    useEffect(() => {
        console.log('dispatch')
        dispatch(fetchUsersRequest());
    }, [])
    return (
        <div className="flex items-center gap-4 mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-sm" onClick={() => dispatch(increment())}>
                +
            </button>

            <button className="px-4 py-2 bg-red-600 text-white rounded-sm" onClick={() => dispatch(decrement())}>
                -
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-sm" onClick={() => dispatch(incrementByAmount(5))}>
                +5
            </button>
        </div>
    );
}