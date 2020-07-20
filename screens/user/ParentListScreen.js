import React, {useCallback, useEffect} from 'react';
import {StyleSheet, View, Button, FlatList, Alert, Text, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/ui/HeaderButton';
import Colors from '../../constants/Colors';
import * as parentActions from '../../store/actions/parents';


const ParentListScreen = props => {
    const parents = useSelector(state => state.parents.parents);
    const dispatch = useDispatch();

    const loadParents = useCallback (async () => {
        try {
            await dispatch(parentActions.fetchParents());
        } catch (error){
            console.log(err);
        }
    }, [dispatch]);

    const parentSelectHandler = parent => {
        props.navigation.navigate('ParentInfo', {
            parent: parent,
            parentName: parent.firstName + ' ' + parent.lastName
        })
    };

    useEffect(() => {
        loadParents().then(()=> {
        });
    }, [dispatch, loadParents]);

    if(!parents){
        return (
            <View style={styles.screen}>
                <Text>No Parents In The System</Text>
            </View>
        )
    }

    return (
        <View style={styles.screen}>
        <FlatList 
            data={parents} 
            keyExtractor={item => item.id} 
            renderItem={itemData => (
                <View style = {styles.nannyContainer}>
                    <TouchableOpacity onPress={() => {parentSelectHandler(itemData.item)}}>
                        <View style={styles.nameContainer}>
                            <Text>First Name: </Text>
                            <Text style={styles.outputText}>{itemData.item.firstName}</Text>
                        </View>
                        <View style={styles.nameContainer}>
                            <Text>Last Name: </Text>
                            <Text style={styles.outputText}>{itemData.item.lastName}</Text>
                        </View>
                        </TouchableOpacity>
                </View>
            )} />
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        justifyContent: 'center',
    },
    nannyContainer: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 20,
        padding: 10,
    },
    nameContainer: {
        flexDirection: 'row',
    },
    outputText: {
        color: '#888'
    }
});

export const screenOptions = navData => {
    return {
        headerTitle: "Admin",
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Menu' 
                    iconName='ios-menu' 
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        )
    }
}

export default ParentListScreen;