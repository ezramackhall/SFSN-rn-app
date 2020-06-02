import {AsyncStorage} from 'react-native';
import User from '../../models/user';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL'; 

let timer;

export const setDidTryAl = () => {
    return {type: SET_DID_TRY_AL};
}

export const authenticate = (userId, token, expiryTime, isNanny) => {
    return async dispatch => {
        const user = await getUserData(userId, isNanny);
        dispatch(setLogoutTimer(expiryTime));
        dispatch({type: AUTHENTICATE, userId: userId, token: token, user: user});
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
    country
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
            console.log(errorId);
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
            false,
            false
        );

        await createUser(user,userId, resData.idToken);

        dispatch(authenticate(
            userId, 
            resData.idToken, 
            parseInt(resData.expiresIn) * 1000)
        );
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, userId, expirationDate, false);
    };
};

export  const login = (email, password) => {
    return async dispatch => {
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
            console.log(errorId);
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

        dispatch(authenticate(
            resData.localId, 
            resData.idToken, 
            parseInt(resData.expiresIn) * 1000),
            false
        );
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData')
    return {type: LOGOUT};
};

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
            console.log(resData);
            throw new Error('Something went wrong!');
        }
};

const getUserData = async (userId, isNanny) =>{
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
        console.log(error);
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