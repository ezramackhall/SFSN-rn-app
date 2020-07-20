import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

const NannyBooking = props =>{
    return (
    <View>
            <View style = {styles.card}> 
                <Text>{props.item.id}</Text>
                <Text>{props.item.startDate}</Text>
                <Text>{props.item.endDate}</Text>
                <Text>{props.item.bookingDetails.children}</Text>
                <Text>{props.item.bookingDetails.description}</Text>
                {!props.item.accepted &&
                props.isNanny && 
                <Button title= "Accpet Request" onPress={() => {
                    props.acceptEvent(props.item.id)}}
                />}
            </View>
    </View>
    )
};

const styles = StyleSheet.create({
    card: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        alignItems: 'center'
    }
});

export default NannyBooking;