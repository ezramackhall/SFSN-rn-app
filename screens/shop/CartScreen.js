import React, {useState} from 'react';
import { Text, FlatList, Button, View , StyleSheet, Alert} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Colors from '../../constants/Colors';

import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/order';
import { ActivityIndicator } from 'react-native-paper';

const CartScreen = props => {
    const [isLoading, setIsLoading] = useState(false);

    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        for (const key in state.cart.items){
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            })
        }
        return transformedCartItems.sort((a,b) => a.productId > b.productId ? 1 : -1);
    });

    const dispatch = useDispatch();

    const sendOrderHandler = async ()=>{
        setIsLoading(true);
        await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
        setIsLoading(false);
        Alert.alert('Order Submited', 'Your Order Has Been Submited', [
            {text: 'Okay'}
        ]);
    };

    if(isLoading){
        return(
            <View style={styles.centered}>
                <ActivityIndicator size='large' color = {Colors.primary}/>
            </View>
        )
    }

    return (
        <View style={styles.screen}>
            <View style = {styles.summary}>
                <Text style={styles.summaryText}>
                    Total: <Text style = {styles.totalText}> ${Math.abs(cartTotalAmount.toFixed(2))}</Text>
                </Text>
                <Button 
                    title="Order Now" 
                    disabled={cartItems.length === 0} 
                    onPress={sendOrderHandler}
                />
            </View>
            <View>
                <FlatList 
                    data={cartItems} 
                    keyExtractor={item => item.productId} 
                    renderItem={itemData=> 
                        <CartItem 
                            title={itemData.item.productTitle}
                            quantity={itemData.item.quantity}
                            amount={itemData.item.productPrice}
                            deletable
                            onRemove={()=>{
                                dispatch(cartActions.removeFromCart(itemData.item.productId));
                            }}
                        />
                    }
                />
            </View>
        </View>
    )
};

export const screenOptions = navData => {
    return {
    headerTitle: 'Cart'
    }
};

const styles = StyleSheet.create({
    screen:{
        margin: 20,
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding:10,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white',
    },
    summaryText: {
        fontSize:18,
    },
    totalText:{
        color: Colors.primary,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default CartScreen;
