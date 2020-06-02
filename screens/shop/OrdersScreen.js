import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import { useSelector, useDispatch} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/ui/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as OrderActions from '../../store/actions/order';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    const loadOrders = useCallback (async () => {
        setIsLoading(true);
        try {
            await dispatch(OrderActions.fetchOrders());
        } catch (error){
            console.log(error);
        }
        setIsLoading(false);
    }, [dispatch]);

    useEffect(() => {
        loadOrders();
    }, [dispatch, loadOrders]);

    if(orders.length === 0){
        return(
            <View style={styles.centered}>
                <Text>The current user has no orders to display</Text>
            </View>
        )
    }

    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large'/>
            </View>
        )
    }

    return (
        <FlatList 
            data={orders} 
            keyExtractor={item => item.id} 
            renderItem = {itemData=> 
                <OrderItem 
                    amount={itemData.item.totalAmount} 
                    date = {itemData.item.date}
                    items = {itemData.item.items}
                />
            }
        />
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },

});

export const screenOptions = navData => {
    return {
        headerTitle: 'Your Orders',
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

export default OrdersScreen;