import {AsyncStorage} from 'react-native';
import User from '../../models/user';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL'; 
export const CREATE_NANNY = 'CREATE_NANNY'; 
export const SET_PUSH_TOKEN = 'SET_PUSH_TOKEN';

let timer;

export const setDidTryAl = () => {
    return {type: SET_DID_TRY_AL};
}

export const authenticate = (isNanny, userId, token, expiryTime) => {
    return async dispatch => {
        try{
            const user = await getUserData(userId, isNanny);
            dispatch(setLogoutTimer(expiryTime));
            dispatch({type: AUTHENTICATE, userId: userId, token: token, user: user, isAdmin: user.isAdmin});
        }catch (error){
            throw new Error('Login Failed');
        }
    }
};

export  const signup = (
    email,
    password,
    firstName,
    lastName,
    address,
    postalCode,
    city,
    province,
    country,
    isNanny
) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyADYFVRfgEMckmIYzWnq6Sg8mrkBiWpCEs',
            {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if(!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';

            if(errorId ==='EMAIL_EXISTS'){
                message = 'A user with this Email already exists'
            }
            if(errorId === 'WEAK_PASSWORD : Password should be at least 6 characters'){
                message = 'Password should be at least 6 characters';
            }
            throw new Error(message);
        }

        const resData = await response.json();

        const userId = resData.localId;

        const user = new User(
            userId, 
            email,
            firstName,
            lastName, 
            address,
            postalCode, 
            country, 
            province, 
            city, 
            isNanny,
            false
        );

        await createUser(user,userId, resData.idToken);

        if(!isNanny){
            dispatch(authenticate(
                false,
                userId, 
                resData.idToken, 
                parseInt(resData.expiresIn) * 1000)
            );
            const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
            saveDataToStorage(resData.idToken, userId, expirationDate, false);
        }else{
            dispatch({type:CREATE_NANNY, nanny: user});
        }
    };
};

export  const login = (email, password, isNanny) => {
    return async (dispatch, getState) => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyADYFVRfgEMckmIYzWnq6Sg8mrkBiWpCEs',
            {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );


        if(!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';

            if(errorId ==='EMAIL_NOT_FOUND' || errorId === 'INVALID_PASSWORD'){
                message = 'Email or Password is incorrect'
            }
            if(errorId === 'USER_DISABLED'){
                message = 'Your Account Has Been Locked'
            }
            throw new Error(message);
        }
        const resData = await response.json();

        

        try{
            await dispatch(authenticate(
                isNanny,
                resData.localId, 
                resData.idToken, 
                parseInt(resData.expiresIn) * 1000),
            );
            const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
            saveDataToStorage(resData.idToken, resData.localId, expirationDate, isNanny);
            await savePushNotificationToken(getState().auth.pushNotificationToken, resData.localId, resData.idToken, isNanny);
        } catch(error){
            throw new Error('Invalid Login, \n make sure your type is correct \n (e.g Nanny has nanny selected)');
        }
    };
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData')
    return {type: LOGOUT};
};

export const setPushToken = (token) => {
    return {type: SET_PUSH_TOKEN, token: token}
}

const createUser = async (user, userId, token) => {
    let url = '';
    if(user.isNanny){
        url = `https://rn-complete-guide-eh.firebaseio.com/users/nannys/${userId}.json?auth=${token}`;
    }else{
        url = `https://rn-complete-guide-eh.firebaseio.com/users/clients/${userId}.json?auth=${token}`
    }
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(user)
    });

    const resData = await response.json();

        if(!response.ok){
            throw new Error('Something went wrong!');
        }
};

export const getUserData = async (userId, isNanny) =>{
    let url = '';
    if(isNanny){
        url = `https://rn-complete-guide-eh.firebaseio.com/users/nannys/${userId}.json`;
    }else {
        url = `https://rn-complete-guide-eh.firebaseio.com/users/clients/${userId}.json`
    }
    try {
        const response = await fetch(url);

        if(!response.ok){
            throw new Error('Something went wrong!');
        }

        const userData = await response.json();

        const user = new User(
            userId, 
            userData.email,
            userData.firstName, 
            userData.lastName, 
            userData.address, 
            userData.postalCode,
            userData.country,
            userData.province, 
            userData.city,
            userData.isNanny,
            userData.isAdmin
        );

        return user;

    } catch(error){
        throw new Error('Something went wrong here!');
    }
};

const clearLogoutTimer = () => {
    if(timer){
        clearTimeout(timer);
    }
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};

const saveDataToStorage = (token, userId, expirationDate, isNanny) => {
    AsyncStorage.setItem(
        'userData', 
        JSON.stringify({
            token: token,
            userId: userId,
            expirationDate: expirationDate.toISOString(),
            isNanny: isNanny
        })
    );
};

const savePushNotificationToken =  async (token, userId, auth, isNanny) => {
    let url = '';
    if(isNanny){
        url = `https://rn-complete-guide-eh.firebaseio.com/users/nannys/${userId}.json?auth=${auth}`;
    }else {
        url = `https://rn-complete-guide-eh.firebaseio.com/users/clients/${userId}.json?auth=${auth}`
    }
    const response = await fetch(url,
        {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            pushNotificationToken: token
        })
    });

    if(!response.ok){
        throw new Error('Something went wrong!');
    }
}