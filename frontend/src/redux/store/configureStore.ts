import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, createStore, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";

import rootReducer from "../reducer";
import rootSaga from "../sagas";
import { ILanguageStore } from "@redux/reducer/language";

export const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const enhancer =
        process.env.STAGE === "production"
            ? compose(applyMiddleware(sagaMiddleware))
            : composeWithDevTools(applyMiddleware(sagaMiddleware));
    const persistConfig = {
        version: 1,
        key: "root",
        storage,
        whitelist: ["language"],
        transforms: [
            encryptTransform({
                secretKey: "my-super-secret-key",
                onError: function (error) {
                    console.log(error);
                },
            }),
        ],
    };

    const store = createStore(persistReducer(persistConfig, rootReducer), enhancer);
    (store as any).__PERSISTOR = persistStore(store);
    (store as any).sagaTask = sagaMiddleware.run(rootSaga);
    return store;
};

export type RootState = {
    // wallet: IWalletStore;
    language: ILanguageStore;
};

const wrapper = createWrapper(configureStore);

export default wrapper;
