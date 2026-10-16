import { usePosts } from "../hooks/usePosts";


export default function PostPage() {
    const { posts, fetchNextPage, hasNextPage, isError, isLoading, isFetchingNextPage } = usePosts()

    if (isLoading) {
        return <div className="p-6 text-center text-gray-500">Đang tải danh sách bài viết...</div>;
    }
    if (isError) {
        return <div className="p-6 text-center text-red-500">Lỗi khi tải bài viết!</div>;
    }
    return (
        <div className="max-w-[800px] overflow-auto mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Danh sách Bài viết (Infinite Query)
            </h1>
            {/* Danh sách các bài viết đã dồn qua các trang */}
            <div className="space-y-4 mb-8">
                {posts.map((post, index) => (
                    <div key={post.id} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            #{index + 1} - ID: {post.id}
                        </span>
                        <h2 className="text-lg font-semibold text-gray-900 mt-2 capitalize">{post.title}</h2>
                        <p className="text-gray-600 mt-1 text-sm line-clamp-2">{post.body}</p>
                    </div>
                ))}
            </div>
            {/* điều khiển Tải thêm */}
            <div className="text-center">
                {hasNextPage ? (
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition shadow"
                    >
                        {isFetchingNextPage ? "Đang tải thêm..." : "Xem thêm bài viết ↓"}
                    </button>
                ) : (
                    <p className="text-gray-400 text-sm italic">🎉 Bạn đã xem hết tất cả bài viết!</p>
                )}
            </div>
        </div>
    );
}