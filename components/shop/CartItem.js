import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons'

const CartItem = props => {
    return (
        <View style={styles.card}>
            <View style={styles.itemData}>
                <Text style={styles.textMain}>{props.quantity}: </Text><Text style={styles.textMain}>{props.title}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.textMain}>{props.amount}</Text>
                {props.deletable && <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
                    <Ionicons 
                        name='ios-trash'
                        size={23}
                        color='red'
                    />
                </TouchableOpacity>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: "space-between",
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
    deleteButton: {
        marginLeft: 20,
    }

});

export default CartItem;