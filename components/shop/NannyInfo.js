import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const NannyInfo = props => {
    return (
    <View>
        <View style={styles.center}>
            <Text>Nanny Info</Text>
        </View>
        <View style={styles.infoContainer}>
            <View style={styles.itemData}>
                <Text>Name: </Text>
                <Text style={styles.textMain}> {props.nanny.firstName} </Text>
                <Text style={styles.textMain}>{props.nanny.lastName}</Text>
            </View>
            <View style={styles.itemData}>
                <Text>Email: </Text>
                <Text style={styles.textMain}> {props.nanny.email} </Text>
            </View>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    infoContainer: {
        marginVertical: 10
    },
    itemData: {
        flexDirection:"row",
        alignItems: 'center',
    },
    textMain:{
        color: '#888',
        fontSize: 14
    },
    center: {
        alignItems: 'center',
        marginVertical: 10,
    }
});

export default NannyInfo