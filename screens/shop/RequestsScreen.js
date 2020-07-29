import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import { useSelector, useDispatch} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/ui/HeaderButton';
import RequestItem from '../../components/shop/RequestItem';
import * as RequestActions from '../../store/actions/childminding';
import Colors from '../../constants/Colors';

const RequestsScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const requests = useSelector(state => state.childminding.requests);
    const isNanny = useSelector(state => state.auth.userData.isNanny);
    const dispatch = useDispatch();

    const loadRequests = useCallback (async () => {
        setIsRefreshing(true);
        try {
            await dispatch(RequestActions.fetchRequests());
        } catch (error){
            console.log(error);
        }
        setIsRefreshing(false);
    }, [dispatch, isLoading]);

    useEffect (() => {
        const unsubscribe = props.navigation.addListener(
            'focus', 
            loadRequests
        );

        return () => {
            unsubscribe();
        };
    },[loadRequests]);

    useEffect( () => {
        setIsLoading(true);
        loadRequests();
        setIsLoading(false);
    }, [dispatch, loadRequests]);

    useEffect(()=> {
        if(!isNanny){
            props.navigation.setOptions({
                headerRight: () => (
                    <HeaderButtons HeaderButtonComponent={HeaderButton}>
                        <Item 
                            title='Cart' 
                            iconName='ios-add' 
                            onPress={() => {
                                props.navigation.navigate('ChildminderRequest');
                            }}
                        />
                    </HeaderButtons>
                    )
            });
        }
    },[isNanny]);

    const deleteRequestHandler = async (requestId) => {
        try{
            await dispatch(RequestActions.deleteRequest(requestId));
        } catch (error) {
            console.log(error);
        }
    };

    const acceptRequestHandler = async (requestId) => {
        try{
            await dispatch(
                RequestActions.requestToScheduledEvent(
                    requests.filter(
                        request => request.id === requestId
                    ).pop()
                )
            );
        }catch (error) {
            console.log(error);
        }
    };

    if(requests.length === 0){
        return(
            <View style={styles.centered}>
                <Text>The current user has no requests to display</Text>
            </View>
        )
    }

    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary}/>
            </View>
        )
    }

    return (
        <FlatList 
            data={requests} 
            onRefresh ={loadRequests}
            refreshing={isRefreshing}
            keyExtractor={item => item.id} 
            renderItem = {itemData=> (
                <View>
                    <RequestItem 
                        user={itemData.item.user}
                        submitDate={itemData.item.requestDate} 
                        startDate={itemData.item.startDate}
                        endDate={itemData.item.endDate}
                        requestId={itemData.item.id}
                        itemData = {itemData.item}
                        isNanny={isNanny}
                        deleteRequest={deleteRequestHandler}
                        acceptRequest={acceptRequestHandler}
                        />
                </View>
            )
            }
        />
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }

});

export const screenOptions = navData => {
    return {
        headerTitle: 'Current Reuqests',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Cart' 
                    iconName='ios-menu' 
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
            )
    };
}

export default RequestsScreen;