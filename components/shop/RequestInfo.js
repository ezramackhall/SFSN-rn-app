import React from 'react';
import {View, Text, StyleSheet } from 'react-native';

const RequestInfo = props => {
    return (
        <View>
            <View style={styles.title}>
                <Text style= {styles.titleText}>Childminding Request Details</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.infoText}>Number of children: {props.itemData.numberOfChildren}</Text>
                <Text style={styles.infoText}>Pets: {props.itemData.pets}</Text>
                <Text style={styles.infoText}>Special Needs/Allergies: {props.itemData.specialInfo}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        alignItems: 'center',
        padding: 5
    },
    titleText: {
        fontSize: 18
    },
    info: {
        paddingHorizontal: '10%'
    },
    infoText: {
        color: '#888',
        fontSize: 16
    }
});

export default RequestInfo;