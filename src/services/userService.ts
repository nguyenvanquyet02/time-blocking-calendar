
export async function getUsersList(page: number = 1, limit: number = 3) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${limit}`)
    if (!res.ok) {
        throw new Error("Không thể tải Users");
    }
    return res.json()
}