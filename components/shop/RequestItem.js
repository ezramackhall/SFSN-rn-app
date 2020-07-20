import React, {useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

import UserItem from './UserItem';
import Colors from '../../constants/Colors';

const RequestItem = props => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <View style = {styles.item}>
            <View style={styles.requestTitle}>
                <Text>Childminder Request</Text>
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
                {!props.isNanny ? <Button 
                    color={Colors.primary}
                    title="Delete" 
                    onPress={() => {props.deleteRequest(props.requestId)}}
                /> : <Button
                    color={Colors.primary}
                    title="Accept Request"
                    onPress={() => {props.acceptRequest(props.requestId)}}
                />
                }
            </View>
            {showDetails && (
                <View style= {styles.orderItems}>
                    <UserItem user={props.user} title="Requested By"/>
                    <Text>Date of request: {props.submitDate}</Text>
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
    }
});

export default RequestItem;