import React from'react';
import {useSelector} from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import StartUpScreen from '../screens/user/StartUpScreen';

import {ShopNavigator, AuthNavigator} from './ShopNavigator';


const AppNavigator = props => {
    const isAuth = useSelector(state => !!state.auth.token);
    const didTryAL = useSelector(state => state.auth.didTryAutoLogin);
    const userData = useSelector(state => state.auth.userData);

    let isAdmin = false;

    if(userData !== null){
        isAdmin = userData.isAdmin;
    }

    return (
    <NavigationContainer>
        {isAuth && <ShopNavigator admin ={isAdmin}/>}
        {!isAuth && didTryAL && <AuthNavigator/>}
        {!isAuth && !didTryAL && <StartUpScreen/>}
    </NavigationContainer>
    )
}

export default AppNavigator;