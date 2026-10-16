import { useInfiniteQuery } from "@tanstack/react-query";
import * as postsService from '../services/postService'

export const POST_QUERY_KEY = 'posts'
const LIMIT = 50
export function usePosts() {
    const {
        data,
        isLoading,
        isError,
        fetchNextPage, // tải data page + 1
        hasNextPage, // cờ còn page sau không
        isFetchingNextPage // cờ đang tải page + 1 không
    } = useInfiniteQuery({
        queryKey: [POST_QUERY_KEY],
        initialPageParam: 1, // tham số trang ban đầu
        queryFn: ({ pageParam }) => postsService.getPostList(pageParam, LIMIT),
        getNextPageParam: (lastPage, allPage, lastPageParam) => {
            // lastPage chứa data 1 trang vừa tải gần nhất
            // allPage chứa data của tất cả  trang đã tải từ trước tới nay
            // lastPageParam tham số trang hiện tại
            if (lastPage.length < LIMIT) {
                return undefined
            }
            return lastPageParam + 1;
        }
    })
    // data trả về dạng mảng lồng mảng, cần làm phẳng bằng flatMap
    const posts = data?.pages.flatMap((page) => page) || []

    return {
        posts,
        isLoading,
        isError,
        fetchNextPage, // tải data page + 1
        hasNextPage, // cờ còn page sau không
        isFetchingNextPage // cờ đang tải page + 1 không
    }
}