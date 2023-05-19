import { all, fork } from "redux-saga/effects";
// import modalSaga from "./modal";
// import walletSaga from "./wallet";

export default function* rootSaga() {
    // yield all([fork(walletSaga), fork(modalSaga)]);
    yield all([]);
}
