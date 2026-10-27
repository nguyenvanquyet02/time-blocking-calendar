import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as usersService from '../services/userService'

export const USER_QUERY_KEY = 'users'
export function useUsers(page: number = 1, limit: number = 3) {
    // isPlaceholderData cờ cho biết dữ liệu trên màn hình đang là dữ liệu cũ đang giữ lại hay không
    // sử dụng để disable nút Next/Prev khi chuyển trang
    const { data: users = [], isLoading, isFetching, isError, isPlaceholderData } = useQuery({
        // đưa page,limit vào định danh queryKey cho từng page
        queryKey: [USER_QUERY_KEY, { page, limit }],
        queryFn: () => usersService.getUsersList(page, limit),
        // giữ lại dữ liệu trang cũ trong lúc trang mới đang được fetch
        placeholderData: keepPreviousData
    })
    return { users, isLoading, isError, isFetching, isPlaceholderData }
}