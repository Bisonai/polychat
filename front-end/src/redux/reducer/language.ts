import produce from "immer";

export const SET_LANGUAGE_ACTION = "SET_LANGUAGE_ACTION";

export interface ILanguageActionParam<Action extends keyof ILanguageActionPayload> {
    type: Action;
    payload: ILanguageActionPayload[Action];
}
export interface ILanguageActionPayload {
    SET_LANGUAGE_ACTION: { code: string };
}
export const LanguageMap = {
    ko: "KR",
    en: "EN",
};
export type ILanguage = keyof typeof LanguageMap;

export interface ILanguageStore {
    code: ILanguage;
}
const initialState: ILanguageStore = {
    code: "en",
};

const reducer = (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case SET_LANGUAGE_ACTION:
                draft.code = action.payload.code;
                break;
            default:
                break;
        }
    });
};

export default reducer;
