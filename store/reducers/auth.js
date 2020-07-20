import {AUTHENTICATE, LOGOUT, SET_DID_TRY_AL, SET_PUSH_TOKEN} from "../actions/auth";

const initialState = {
    token: null,
    userId: null,
    didTryAutoLogin: false,
    userData: null,
    isAdmin: false,
    pushNotificationToken: null
};

export default (state = initialState, action) => {
    switch(action.type){
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId,
                didTryAutoLogin: true,
                userData: action.user,
                isAdmin: action.isAdmin
                };  
        case SET_DID_TRY_AL: 
            return{
                ...state,
                didTryAutoLogin:true
            };
        case LOGOUT:
            return {
                ...initialState,
                didTryAutoLogin: true
            };
        case SET_PUSH_TOKEN: 
            return {
                ...state,
                pushNotificationToken: action.token
            }
        default: 
            return state;

    }
}