export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}
export async function getPostList(page: number = 1, limit: number = 3): Promise<Post[]> {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`)
    if (!res.ok) {
        throw new Error("Không thể tải Post");
    }
    return res.json()
}