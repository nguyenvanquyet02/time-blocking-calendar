import { useState } from "react";
import { USER_QUERY_KEY, useUsers } from "../hooks/useUsers";
import { useQueryClient } from "@tanstack/react-query";
import * as usersService from '../services/userService'


export default function UserPage() {
    const [page, setPage] = useState(1);
    const LIMIT = 3;
    const { users, isLoading, isError, isPlaceholderData } = useUsers(page, LIMIT)
    const queryClient = useQueryClient()

    const prefetchNextPage = () => {
        if (!isPlaceholderData) {
            queryClient.query({
                queryKey: [USER_QUERY_KEY, { page: page + 1, limit: LIMIT }],
                queryFn: () => usersService.getUsersList(page + 1, LIMIT),
                staleTime: 1000 * 6
            })
        }
    }
    return (
        <div>
            <h1>Users Page</h1>
            {isLoading && <div>Loading...</div>}
            {isError && <div>Error...</div>}
            {users?.length > 0 && (<ul>
                {users.map((user) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>)}

            {/* Bộ điều khiển Phân trang */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setPage((old) => Math.max(old - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 font-medium text-sm transition"
                >
                    ← Trang trước
                </button>
                <span className="text-sm font-medium">
                    Trang <span className="text-blue-600 font-bold">{page}</span>
                </span>
                <button
                    onClick={() => {
                        // Chỉ cho sang trang kế tiếp nếu trang hiện tại còn dữ liệu và không phải placeholder
                        if (!isPlaceholderData && users.length === LIMIT) {
                            setPage((old) => old + 1);
                        }
                    }}
                    onMouseEnter={prefetchNextPage}
                    disabled={isPlaceholderData || users.length < LIMIT}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 font-medium text-sm transition"
                >
                    Trang sau →
                </button>
            </div>
        </div>
    );
}