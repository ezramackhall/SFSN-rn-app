import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/ui/HeaderButton';
import BookingItem from '../../components/shop/BookingItem';
import * as bookingActions from '../../store/actions/childminding';
import Colors from  '../../constants/Colors';

const BookingsScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const bookings = useSelector(state => state.childminding.bookings);
    const paidBookings = useSelector(state => state.childminding.bookingsPaid);
    const dispatch = useDispatch();

    const loadBookings = useCallback (async () => {
        setIsRefreshing(true);
        try {
            await dispatch(bookingActions.fetchBookings());
        } catch (error){
            console.log(error);
        }
        setIsRefreshing(false);
    }, [dispatch, isLoading]);

    useEffect (() => {
        const unsubscribe = props.navigation.addListener(
            'focus', 
            loadBookings
        );

        return () => {
            unsubscribe();
        };
    },[loadBookings]);

    useEffect(() => {
        setIsLoading(true);
        loadBookings();
        setIsLoading(false);
    }, [dispatch, loadBookings]);

    const bookingNavHandler = () => {
        props.navigation.navigate("BookingPayment");
    }

    if(isLoading){
        return (
            <View style={styles.centered}>
              <ActivityIndicator size='large' color={Colors.primary}/>
          </View>
        )
    }

    return (
        <View>
            <Text>Unpaid Bookings</Text>
            <FlatList 
                data={bookings} 
                onRefresh ={loadBookings}
                refreshing={isRefreshing}
                keyExtractor={item => item.id} 
                renderItem = {itemData=> (
                    <View>
                        <BookingItem 
                            parent={itemData.item.parent}
                            nanny={itemData.item.nanny}
                            submitDate={itemData.item.acceptedDate} 
                            startDate={itemData.item.startDate}
                            endDate={itemData.item.endDate}
                            requestId={itemData.item.id}
                            />
                    </View>
                )
                }
            />
            <Text>Paid Bookings</Text>
            <FlatList 
                data={paidBookings} 
                onRefresh ={loadBookings}
                refreshing={isRefreshing}
                keyExtractor={item => item.id} 
                renderItem = {itemData=> (
                    <View>
                        <BookingItem 
                            parent={itemData.item.parent}
                            nanny={itemData.item.nanny}
                            submitDate={itemData.item.acceptedDate} 
                            startDate={itemData.item.startDate}
                            endDate={itemData.item.endDate}
                            requestId={itemData.item.id}
                            />
                    </View>
                )
                }
            />
        </View>
    )
}

export const screenOptions = navData => {
    return {
        headerTitle: 'Current Bookings',
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

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default BookingsScreen;