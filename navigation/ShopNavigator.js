import React from 'react';
import {Platform, SafeAreaView, Button, View} from 'react-native';
import { Ionicons} from '@expo/vector-icons'
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer'
import {useDispatch} from 'react-redux'

import ProductsOverviewScreen, {screenOptions as productOverviewScreenOptions} from '../screens/shop/ProductsOverviewScreen';
import ProductDetailsScreen, {screenOptions as productDetailScreenOptions} from '../screens/shop/ProductDetailScreen';
import CartScreen, {screenOptions as cartScreenOptions} from '../screens/shop/CartScreen';
import OrdersScreen, {screenOptions as ordersScreenOptions} from '../screens/shop/OrdersScreen';
import NannyListScreen, {screenOptions as nannyListScreenOptions} from '../screens/user/NannyListScreen';
import AuthScreen, {screenOptions as authScreenOptions} from '../screens/user/AuthSceen';
import UserInfoScreen, {screenOptions as userInfoProductsScreenOptions} from '../screens/user/UserInfoScreen';
import RequestsScreen, {screenOptions as requestsScreenOptions} from '../screens/shop/RequestsScreen';
import CreateNannyScreen, {screenOptions as createNannyScreenOptions} from '../screens/user/CreateNannyScreen';
import NannyInfoScreen, {screenOptions as nannyInfoScreenOptions} from '../screens/user/NannyInfoScreen';
import ParentInfoScreen, {screenOptions as parentInfoScreenOptions} from '../screens/user/ParentInfoScreen';
import BookingsScreen, {screenOptions as bookingsScreenOptions} from '../screens/shop/BookingsScreen';
import ParentListScreen, {screenOptions as parentListScreenOptions} from '../screens/user/ParentListScreen';
import NannyBookingScreen, {screenOptions as nannyBookingScreenOptions}from '../screens/shop/NannyBookingScreen';
import TimeSheetScreen, {screenOptions as timeSheetScreenOptions} from '../screens/user/TimeSheetScreen';
import BookingPaymentScreen from '../screens/shop/BookingPaymentScreen';
import MessagingSelectorScreen from '../screens/user/MessageSelection';
import MessagingScreen, {screenOptions as messagingScreenOptions} from '../screens/user/Messaging';
import TimeSheetEntryScreen, {screenOptions as timeSheetEntryScreenOptions} from '../screens/user/TimeSheetEntryScreen';
import CreateNannyBookingScreen, {screenOptions as createNannyBookingScreenOptions}from '../screens/shop/CreateNannyBookingScreen';
import StartUpScreen from '../screens/user/StartUpScreen';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import CreateChildminderRequestScreen, {screenOptions as childminderScreenOptions} from '../screens/shop/CreateChildminderRequestScreen';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android'  ? Colors.primary : ''
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

const ProductsStackNavigator = createStackNavigator();

export const ProductsNavigator = () => {
    return (
        <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
            <ProductsStackNavigator.Screen 
                name="ProductsOverview" 
                component={ProductsOverviewScreen}
                options ={productOverviewScreenOptions}
            />
            <ProductsStackNavigator.Screen 
                name="ProductDetail" 
                component={ProductDetailsScreen}
                options = {productDetailScreenOptions}
            />
            <ProductsStackNavigator.Screen 
                name="Cart" 
                component={CartScreen}
                options = {cartScreenOptions}
            />
        </ProductsStackNavigator.Navigator>
    )
};

const OrdersStackNavigator = createStackNavigator();

export const OrdersNavigator = () => {
    return <OrdersStackNavigator.Navigator screenOptions={defaultNavOptions}>
        <OrdersStackNavigator.Screen 
            name= "orders" 
            component={OrdersScreen}
            options={ordersScreenOptions}
        />
    </OrdersStackNavigator.Navigator>
};

const AdminStackNavigator = createStackNavigator();

export const AdminNavigator = () => {
    return (
      <AdminStackNavigator.Navigator screenOptions={defaultNavOptions}>
            <AdminStackNavigator.Screen
          name="AvailableNannies"
          component={NannyListScreen}
          options={nannyListScreenOptions}
          />
            <AdminStackNavigator.Screen
          name="NannyInfo"
          component={NannyInfoScreen}
          options={nannyInfoScreenOptions}
          />
            <AdminStackNavigator.Screen
          name="CreateNanny"
          component={CreateNannyScreen}
          options={createNannyScreenOptions}
          />
      </AdminStackNavigator.Navigator>
    );
};
  
const ParentsStackNavigator = createStackNavigator();

export const ParentNavigator = () => {
    return (
        <ParentsStackNavigator.Navigator screenOptions={defaultNavOptions}>
            <ParentsStackNavigator.Screen 
                name="AvailableParents"
                component={ParentListScreen}
                options={parentListScreenOptions}
            />
                <ParentsStackNavigator.Screen 
                name="ParentInfo"
                component={ParentInfoScreen}
                options={parentInfoScreenOptions}
            />
        </ParentsStackNavigator.Navigator>
    )
}

const AdminTabNavigator = createBottomTabNavigator();

export const BottomAdminNavigator = () => {
  return (
    <AdminTabNavigator.Navigator 
        initialRouteName="BottomAdminNav"
        tabBarOptions = {{
            activeTintColor: Colors.primary
        }}   
    >
        <AdminTabNavigator.Screen
        name="BottomAdminNav"
        component={AdminNavigator}
        options={{
            tabBarLabel: 'Nannies',
            tabBarIcon: ({color, size}) => (
                <Ionicons
                        name='ios-people'
                        size={23}
                        color={Colors.primary}
                    /> 
            ),
        }}
        />
        <AdminTabNavigator.Screen
        name="BottomAdminParentNav"
        component={ParentNavigator}
        options={{
            tabBarLabel: 'Parents',
            tabBarIcon: ({color, size}) => (
                <Ionicons
                        name='ios-contacts'
                        size={23}
                        color={Colors.primary}
                    /> 
            ),
        }}
        />
    </AdminTabNavigator.Navigator>
  );
};

const UserInfoStackNavigator = createStackNavigator();

const UserInfoNavigtor = () => {
    return (<UserInfoStackNavigator.Navigator>
        <UserInfoStackNavigator.Screen 
            name="User" 
            component={UserInfoScreen} 
            options={userInfoProductsScreenOptions}
        />
    </UserInfoStackNavigator.Navigator>
    )
};

const RequestsStackNavigator = createStackNavigator();

const RequestsNavigator = () => {
    return (<RequestsStackNavigator.Navigator screenOptions={defaultNavOptions}>
        <RequestsStackNavigator.Screen
            name="Resquests"
            component={RequestsScreen}
            options={requestsScreenOptions}
        />
        <RequestsStackNavigator.Screen
            name="ChildminderRequest"
            component={CreateChildminderRequestScreen}
            options={childminderScreenOptions}
        />
    </RequestsStackNavigator.Navigator>

    )
}

const MessagingStackNavigator = createStackNavigator();

const MessagingNavigator = () => {
    return (<MessagingStackNavigator.Navigator screenOptions={defaultNavOptions}>
        <MessagingStackNavigator.Screen
            name="MessagingSelector"
            component={MessagingSelectorScreen}
            options={messagingScreenOptions}
        />
        <MessagingStackNavigator.Screen
            name="Messaging"
            component={MessagingScreen}
        />
    </MessagingStackNavigator.Navigator>
    )
}

const BookingsStackNavigator = createStackNavigator();

const BookingsNavigator = () => {
    return (<BookingsStackNavigator.Navigator screenOptions={defaultNavOptions}>
        <BookingsStackNavigator.Screen
            name="Bookings"
            component={BookingsScreen}
            options={bookingsScreenOptions}
        />
        <BookingsStackNavigator.Screen
            name ="BookingPayment"
            component={BookingPaymentScreen}
        />
    </BookingsStackNavigator.Navigator>

    )
}

const NannyBookingsStackNavigator = createStackNavigator();

const NannyBookingNavigator = () => {
    return (<NannyBookingsStackNavigator.Navigator screenOptions={defaultNavOptions}>
        <NannyBookingsStackNavigator.Screen
            name="NannyBooking"
            component={NannyBookingScreen}
            options={nannyBookingScreenOptions}
        />
        <NannyBookingsStackNavigator.Screen
            name="CreateNannyBooking"
            component={CreateNannyBookingScreen}
            options={createNannyBookingScreenOptions}
        />
    </NannyBookingsStackNavigator.Navigator>
    )
}

const TimeSheetManagementStackNavigator = createStackNavigator();

const TimeSheetManagementNavigator = () => {
    return (
        <TimeSheetManagementStackNavigator.Navigator screenOptions={defaultNavOptions}>
            <TimeSheetManagementStackNavigator.Screen
                name="TimeSheetList"
                component={TimeSheetScreen}
                options={timeSheetScreenOptions}
            />
            <TimeSheetManagementStackNavigator.Screen
                name="TimeSheetEntry"
                component={TimeSheetEntryScreen}
                options={timeSheetEntryScreenOptions}
            />
        </TimeSheetManagementStackNavigator.Navigator>
    )
}

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = props => {
    const isAdmin = props.admin;
    const isNanny = props.nanny;
    const dispatch = useDispatch();
    return (<ShopDrawerNavigator.Navigator
        drawerContent={props => {
            return (
                <View style={{flex:1, paddingTop: 20}}>
                    <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                        <DrawerItemList {...props}/>
                        <Button 
                            title="Logout" 
                            color={Colors.primary} 
                            onPress={()=>{
                                dispatch(authActions.logout());
                            }}
                        />
                    </SafeAreaView>
                </View>
            )
        }} 
        drawerContentOptions={{
            activeTintColor: Colors.primary
        }}>
        <ShopDrawerNavigator.Screen 
            name="Requests" 
            component={RequestsNavigator}
            options={{
                drawerIcon: props => 
                    <Ionicons
                        name='ios-clipboard'
                        size={23}
                        color={props.color}
                    />  
            }}
        />
        <ShopDrawerNavigator.Screen 
            name="Bookings" 
            component={BookingsNavigator}
            options={{
                drawerIcon: props => 
                    <Ionicons
                        name='ios-document'
                        size={23}
                        color={props.color}
                    />  
            }}
        />
        <ShopDrawerNavigator.Screen 
            name="Nanny Bookings" 
            component={NannyBookingNavigator}
            options={{
                drawerIcon: props => 
                    <Ionicons
                        name='ios-calendar'
                        size={23}
                        color={props.color}
                    />  
            }}
        />
        {isNanny && <ShopDrawerNavigator.Screen 
            name="TimeSheet" 
            component={TimeSheetManagementNavigator} 
            options = {{
                drawerIcon: props => 
                    <Ionicons
                        name='ios-clock'
                        size={23}
                        color={props.color}
                    />  
            }}
        />}
        {isAdmin && <ShopDrawerNavigator.Screen 
            name="Admin" 
            component={BottomAdminNavigator} 
            options = {{
                drawerIcon: props => 
                    <Ionicons
                        name='ios-briefcase'
                        size={23}
                        color={props.color}
                    />  
            }}
        />}
        <ShopDrawerNavigator.Screen 
            name="User" 
            component={UserInfoNavigtor} 
            options = {{
                drawerIcon: props => 
                    <Ionicons
                        name='ios-man'
                        size={23}
                        color={props.color}
                    />  
            }}
        />
                <ShopDrawerNavigator.Screen 
            name="Messaging" 
            component={MessagingNavigator} 
            options = {{
                drawerIcon: props => 
                    <Ionicons
                        name='ios-mail'
                        size={23}
                        color={props.color}
                    />  
            }}
        />
    </ShopDrawerNavigator.Navigator>)
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
    return (<AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
        <AuthStackNavigator.Screen 
            name="Auth" 
            component={AuthScreen}
            options={authScreenOptions}
        />
    </AuthStackNavigator.Navigator>)
}
