import React, {useEffect} from 'react';
import {AsyncStorage, View, ActivityIndicator, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';

import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const StartUpScreen = props => {
    const dispatch = useDispatch();

    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if(!userData){
                dispatch(authActions.setDidTryAl());
                return;
            }
            const transformedData = JSON.parse(userData);
            const {token, userId, expirationDate, isNanny} = transformedData;
            const expiryDate = new Date(expirationDate);

            if(expiryDate <= new Date() || !token || ! userId){
                dispatch(authActions.setDidTryAl());
                return;
            }

            const expirationTime = expiryDate.getTime() - new Date().getTime();

            //props.navigation.navigate('Shop');
            dispatch(authActions.authenticate(isNanny, userId, token, expirationTime));
        };
        tryLogin();
    }, [dispatch])

    

    return(
        <View style = {styles.centered}>
            <ActivityIndicator size='large' color = {Colors.primary}/>
        </View>
    )
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default StartUpScreen;