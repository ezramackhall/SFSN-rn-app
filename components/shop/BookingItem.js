import React, {useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

import UserItem from './UserItem';
import Colors from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';

const BookingItem = props => {
    const navigation = useNavigation();
    const [showDetails, setShowDetails] = useState(false);

    return (
        <View style = {styles.item}>
            <View style={styles.requestTitle}>
                <Text>Childminder Booking</Text>
            </View>
            <View style= {styles.summary}>
                <Text style = {styles.date}>Start Time: {props.startDate}</Text>
                <Text style = {styles.date}>Request End Time: {props.endDate}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button 
                    color ={Colors.primary}
                    title = {showDetails ? "Hide Details" : "Show Details"}
                    onPress={() => 
                        {
                            setShowDetails(prevState => !prevState)
                        }
                    }
                />
                <Button
                    color = {Colors.primary}
                    title = "Pay Booking Now"
                    onPress = {() => {
                        navigation.navigate("BookingPayment");
                    }}
                />
            </View>
            {showDetails && (
                <View style= {styles.orderItems}>
                    <UserItem user={props.parent} title="Parent Info"/>
                    <UserItem user={props.nanny} title="Nanny Info"/>
                    <Text>Date accepted: {props.submitDate}</Text>
                </View>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    item: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
    },
    amount: {
        fontSize: 16
    },
    date: {
        fontSize: 16,
        color: '#888'
    },
    orderItems: {
        width: '100%'
    },
    requestTitle:{
        alignItems: 'center'
    },
    buttonContainer: {
        alignItems:'center'
    }
});

export default BookingItem;

// {!props.isNanny ? <Button 
//     color={Colors.primary}
//     title="Delete" 
//     onPress={() => {props.deleteRequest(props.requestId)}}
// /> : <Button
//     color={Colors.primary}
//     title="Accept Request"
//     onPress={() => {props.acceptRequest(props.requestId)}}
// />
// }