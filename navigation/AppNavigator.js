import React from'react';
import {useSelector, useDispatch} from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import StartUpScreen from '../screens/user/StartUpScreen';

import {ShopNavigator, AuthNavigator} from './ShopNavigator';
import * as authActions from '../store/actions/auth';

const AppNavigator = props => {
    const isAuth = useSelector(state => !!state.auth.token);
    const didTryAL = useSelector(state => state.auth.didTryAutoLogin);
    const userData = useSelector(state => state.auth.userData);
    const dispatch = useDispatch();
    dispatch(authActions.setPushToken(props.token));
    let isAdmin = false;
    let isNanny = false;

    if(userData !== null){
        isAdmin = userData.isAdmin;
        isNanny = userData.isNanny;
    }

    return (
    <NavigationContainer>
        {isAuth && <ShopNavigator admin={isAdmin} nanny={isNanny}/>}
        {!isAuth && didTryAL && <AuthNavigator/>}
        {!isAuth && !didTryAL && <StartUpScreen/>}
    </NavigationContainer>
    )
}

export default AppNavigator;