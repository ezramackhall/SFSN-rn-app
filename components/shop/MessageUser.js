import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageUser = props => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style = {styles.container}>
                <View style = {styles.content}>
                    <View style = {styles.name}>
                        <Text style={styles.nameText}>{props.firstName}</Text>
                        <Text style={styles.nameText}> {props.lastName}</Text>
                    </View>
                    <Ionicons name='ios-arrow-forward' size = {40} color = '#666'/>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    name: {
        flexDirection: 'row',

    },
    nameText: {
        fontSize: 16
    },
    container: {
        height: 50,
        width: '90%',
        marginHorizontal: '5%',
        borderRadius: 8,
        borderColor: '#aaa',
        borderBottomWidth: 1,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5
    }
});

export default MessageUser;