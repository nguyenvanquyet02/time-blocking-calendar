import { useSelector } from "react-redux";
import type { RootState } from "../../stores/store";

export function CounterDisplay() {

    const count = useSelector(
        (state: RootState) => state.counter.value
    );

    return <h2>Current count: {count}</h2>;
}