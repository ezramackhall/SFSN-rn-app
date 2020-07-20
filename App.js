import React from 'react';
import { StyleSheet, Vibration, Platform, View, Text, SafeAreaView } from 'react-native';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as firebase from 'firebase';

import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import ordersReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';
import childmindingReducer from './store/reducers/childminding';
import nanniesReducer from './store/reducers/nannies';
import parentsReducer from './store/reducers/parents';
import contractReducer from './store/reducers/contract';
import AppNavigator from './navigation/AppNavigator';
import { render } from 'react-dom';

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer,
  childminding: childmindingReducer,
  nannies: nanniesReducer,
  parents: parentsReducer,
  contracts: contractReducer
});

const firebaseConfig = {
  apiKey: "AIzaSyADYFVRfgEMckmIYzWnq6Sg8mrkBiWpCEs",
  authDomain: "rn-complete-guide-eh.firebaseapp.com",
  databaseURL: "https://rn-complete-guide-eh.firebaseio.com",
  projectId: "rn-complete-guide-eh",
  storageBucket: "rn-complete-guide-eh.appspot.com",
  messagingSenderId: "399080340497",
  appId: "1:399080340497:web:84b9e56aa73dc61f9045b0",
  measurementId: "G-02NN70V7Z8"
};
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


export default class App extends React.Component{
    state = {
      expoPushToken: '',
      notification: null,
    };
    registerForPushNotificationsAsync = async () => {
      if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = await Notifications.getExpoPushTokenAsync();
        this.setState({ expoPushToken: token });
      }
      else {
        alert('Must use physical device for Push Notifications');
      }
      if (Platform.OS === 'android') {
        Notifications.createChannelAndroidAsync('default', {
          name: 'default',
          sound: true,
          priority: 'max',
          vibrate: [0, 250, 250, 250],
        });
      }
    };
    componentDidMount = () => {
      this.registerForPushNotificationsAsync();
      // Handle notifications that are received or selected while the app
      // is open. If the app was closed and then opened by tapping the
      // notification (rather than just tapping the app icon to open it),
      // this function will fire on the next tick after the app starts
      // with the notification data.
      this._notificationSubscription = Notifications.addListener(this._handleNotification);
    };
    componentWillUnmount =() =>{
      this._notificationSubscription.remove();
    }
    _handleNotification = notification => {
      Vibration.vibrate();
      this.setState({ notification: notification });
    };
    // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
    sendPushNotification = async () => {
      const message = {
        to: this.state.expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { data: 'goes here' },
        _displayInForeground: true,
      };
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    };
  render(){
    return (<Provider store={store}>
      <AppNavigator token={this.state.expoPushToken}/>
    </Provider>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
