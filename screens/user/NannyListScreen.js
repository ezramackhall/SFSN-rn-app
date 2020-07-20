import React, {useCallback, useEffect} from 'react';
import {StyleSheet, View, Button, FlatList, Alert, Text, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/ui/HeaderButton';
import Colors from '../../constants/Colors';
import * as nannyActions from '../../store/actions/nannies';


const NannyListScreen = props => {
    const nannies = useSelector(state => state.nannies.nannies);
    const dispatch = useDispatch();

    const loadNannies = useCallback (async () => {
        try {
            await dispatch(nannyActions.fetchNannies());
        } catch (error){
            console.log(err);
        }
    }, [dispatch]);

    const editProductHandler = (id) => {
        props.navigation.navigate('EditProduct', {productId: id})
    };

    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this item', [
            {text: 'No', style: 'default'},
            {
                text: 'Yes', 
                style: 'destructive', 
                onPress: () => dispatch(productsActions.deleteProduct(id))}
        ])
    };

    const nannySelectHandler = nanny => {
        props.navigation.navigate('NannyInfo', {
            nanny: nanny,
            nannyName: nanny.firstName + ' ' + nanny.lastName
        })
    };

    useEffect(() => {
        loadNannies().then(()=> {
        });
    }, [dispatch, loadNannies]);

    if(!nannies){
        return (
            <View style={styles.screen}>
                <Text>No Products Have Been Created By The Current User</Text>
            </View>
        )
    }

    return (
        <View style={styles.screen}>
        <FlatList 
            data={nannies} 
            keyExtractor={item => item.id} 
            renderItem={itemData => (
                <View style = {styles.nannyContainer}>
                    <TouchableOpacity onPress={() => {nannySelectHandler(itemData.item)}}>
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
            ),
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item 
                        title='Cart' 
                        iconName='ios-add' 
                        onPress={() => {
                            navData.navigation.navigate('CreateNanny');
                        }}
                    />
                </HeaderButtons>
                )
    }
}

export default NannyListScreen;