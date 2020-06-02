import React from 'react';
import {Platform, SafeAreaView, Button, View} from 'react-native';
import { Ionicons} from '@expo/vector-icons'
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer'
import {useDispatch} from 'react-redux'

import ProductsOverviewScreen, {screenOptions as productOverviewScreenOptions} from '../screens/shop/ProductsOverviewScreen';
import ProductDetailsScreen, {screenOptions as productDetailScreenOptions} from '../screens/shop/ProductDetailScreen';
import CartScreen, {screenOptions as cartScreenOptions} from '../screens/shop/CartScreen';
import OrdersScreen, {screenOptions as ordersScreenOptions} from '../screens/shop/OrdersScreen';
import UserProductsScreen, {screenOptions as userProductsScreenOptions} from '../screens/user/UserProductsScreen';
import EditProductsScreen, {screenOptions as editProductsScreenOptions} from "../screens/user/EditProductsScreen";
import AuthScreen, {screenOptions as authScreenOptions} from '../screens/user/AuthSceen';
import UserInfoScreen, {screenOptions as userInfoProductsScreenOptions} from '../screens/user/UserInfoScreen';
import StartUpScreen from '../screens/user/StartUpScreen';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

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
        name="UserProducts"
        component={UserProductsScreen}
        options={userProductsScreenOptions}
      />
      <AdminStackNavigator.Screen
        name="EditProduct"
        component={EditProductsScreen}
        options={editProductsScreenOptions}
      />
    </AdminStackNavigator.Navigator>
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
}

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = props => {
    const isAdmin = props.admin;
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
            name="Products" 
            component={ProductsNavigator}
            options={{
                drawerIcon: props => 
                    <Ionicons
                        name='ios-cart'
                        size={23}
                        color={props.color}
                    />  
            }}
        />
        <ShopDrawerNavigator.Screen 
            name="Orders" 
            component={OrdersNavigator}
            options={{
                drawerIcon: props=> 
                    <Ionicons
                        name='ios-list'
                        size={23}
                        color={props.color}
                    />  
            }}
        />
        {isAdmin && <ShopDrawerNavigator.Screen 
            name="Admin" 
            component={AdminNavigator} 
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
    </ShopDrawerNavigator.Navigator>)
};

// const ProductsNavigator = createStackNavigator({
//     ProductsOverview: ProductsOverviewScreen,
//     ProductDetail: ProductDetailsScreen,
//     Cart: CartScreen
// }, {
//     navigationOptions: {
//         drawerIcon: drawerConfig => 
//             <Ionicons
//                 name='ios-cart'
//                 size={23}
//                 color={drawerConfig.tintColor}
//             />  
//     },
//     defaultNavigationOptions: defaultNavOptions
//     }
// );

// const OrdersNavigator = createStackNavigator({
//     Orders: OrdersScreen
// },{
//     navigationOptions: {
//         drawerIcon: drawerConfig => 
//             <Ionicons
//                 name='ios-list'
//                 size={23}
//                 color={drawerConfig.tintColor}
//             />  
//     },
//     defaultNavigationOptions: defaultNavOptions
// });

// const UserNavigator = createStackNavigator({
//     UserProducts: UserProductsScreen,
//     EditProduct: EditProductsScreen
// },{
//     navigationOptions: {
//         drawerIcon: drawerConfig => 
//             <Ionicons
//                 name='ios-briefcase'
//                 size={23}
//                 color={drawerConfig.tintColor}
//             />  
//     },
//     defaultNavigationOptions: defaultNavOptions
// });

// const UserDataNavigator = createStackNavigator({
//     User : UserInfoScreen
// },{
//     navigationOptions: {
//         drawerIcon: drawerConfig => 
//             <Ionicons
//                 name='ios-man'
//                 size={23}
//                 color={drawerConfig.tintColor}
//             />  
//     },
//     defaultNavigationOptions: defaultNavOptions
// });

// const ShopNavigator = createDrawerNavigator ({
//     Products: ProductsNavigator,
//     Orders: OrdersNavigator,
//     Admin: UserNavigator,
//     User: UserDataNavigator
// },{
//     contentOptions: {
//         activeTintColor: Colors.primary
//     },
//     contentComponent: props => {
//         const dispatch = useDispatch();
//         return (
//             <View style={{flex:1, paddingTop: 20}}>
//                 <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
//                     <DrawerItems {...props}/>
//                     <Button 
//                         title="Logout" 
//                         color={Colors.primary} 
//                         onPress={()=>{
//                             dispatch(authActions.logout());
//                         }}
//                     />
//                 </SafeAreaView>
//             </View>
//         )
//     }
// });

// const AuthNavigator = createStackNavigator({
//     Auth: AuthScreen
// });

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

// const MainNavigator = createSwitchNavigator({
//     Start: StartUpScreen,
//     Auth: AuthNavigator,
//     Shop: ShopNavigator
// })

// export default createAppContainer(MainNavigator)