import { combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import language from "./language";

export const reducers = {
    // wallet,
    language,
};

// (이전상태, 액션) => 다음상태
const rootReducer = (state, action) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload };
        default: {
            const combinedReducer = combineReducers(reducers);
            return combinedReducer(state, action);
        }
    }
};

export default rootReducer;
