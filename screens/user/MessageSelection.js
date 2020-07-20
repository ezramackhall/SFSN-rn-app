import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, FlatList, StyleSheet} from'react-native'; 

import * as userService from './sevices/userService';
import MessageUser from '../../components/shop/MessageUser';


const MessageSelection = props => {
    const [users,setUsers] = useState([]);

    const getUsers = async () => {
        const getUsers = await userService.getUsers();
        setUsers(getUsers);
    }

    useEffect(() => {
        getUsers();
    }, []);

    const onPressHandler = (id) => {
        props.navigation.navigate('Messaging', {id});
    }

    return (
        <View>
            <View style={styles.topLine}></View>
                <FlatList
                    data={users} 
                    keyExtractor={item => item.id} 
                    renderItem={itemData => 
                        <MessageUser
                            firstName = {itemData.item.firstName}
                            lastName = {itemData.item.lastName}
                            onPress={() => onPressHandler(itemData.item.id)}
                        />
                    }
                />
        </View>
    )
}

const styles = StyleSheet.create({
    topLine:{
        marginTop: 20,
        width: '90%',
        marginHorizontal: '5%'
    }
});

export default MessageSelection;