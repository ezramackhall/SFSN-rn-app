import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const UserItem = props => {
    return (
        <View style={styles.card}>
            <View style={styles.titleTextContainer}>
                <Text style={styles.titleText}>{props.title}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.textMain}>{props.user.firstName} </Text><Text style={styles.textMain}>{props.user.lastName}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.textMain}>{props.user.address}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.textMain}>{props.user.postalCode}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.textMain}>{props.user.city}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.textMain}>{props.user.province}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.textMain}>{props.user.country}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'column',
        marginHorizontal: 20,
    },
    itemData: {
        flexDirection:"row",
        alignItems: 'center',
    },
    textMain:{
        color: '#888',
        fontSize: 16
    },
    titleTextContainer:{
        alignItems: 'center'
    },
    titleText:{
        fontSize: 18
    }

});

export default UserItem;