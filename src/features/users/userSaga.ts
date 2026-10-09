import { call, put, takeLatest } from 'redux-saga/effects'
import { fetchUsersFailure, fetchUsersRequest, fetchUsersSuccess, type User } from './userSlice'
// worker saga no chua workflow call api, check res va dispatch action khac
function* fetchUsersSaga() {
    try {
        console.log(' run worker saga')
        // yield call k truc tiep call api no la instruction/object mo ta call api cho saga middleware, call dua effect ra ngoai va tam dung generator
        // saga middleware nhin thay effect => call api => return res
        const res: Response = yield call(fetch, "https://jsonplaceholder.typicode.com/users")
        if (!res.ok) throw new Error("Failed to fetch users")

        const users: User[] = yield call([res, res.json])
        // put cung la effect mo ta saga middleware phai dispatch action fetchUsersSuccess
        yield put(fetchUsersSuccess(users))
    } catch (error: any) {
        yield put(fetchUsersFailure(error.message || 'failed'))

    }
}
// watcher saga: theo doi action va kich hoat worker saga
function* watchUsers() {
    console.log(' watcher saga triggered')
    yield takeLatest(fetchUsersRequest.type, fetchUsersSaga)
}

//root saga: tap hop cac watcher saga lai
export default function* rootSaga() {
    console.log(' run root saga')
    yield watchUsers()
}