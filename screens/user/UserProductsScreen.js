import React from 'react';
import {StyleSheet, View, Button, FlatList, Alert, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/ui/HeaderButton';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';


const UserProductsScreen = props => {
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

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

    if(userProducts.length === 0){
        return (
            <View style={styles.screen}>
                <Text>No Products Have Been Created By The Current User</Text>
            </View>
        )
    }

    return (
        <View>
        <FlatList 
            data={userProducts} 
            keyExtractor={item => item.id} 
            renderItem={itemData => (
                <ProductItem 
                    image = {itemData.item.imageUrl}
                    price = {itemData.item.price}
                    title = {itemData.item.title}
                    onSelect = {() => editProductHandler(itemData.item.id)}
                >
            <Button
                color={Colors.primary}
                title="Edit"
                onPress={() => {
                    editProductHandler(itemData.item.id)
                }}
            />
            <Button
                color={Colors.primary}
                title="Delete"
                onPress={() => deleteHandler(itemData.item.id)}
            />
                </ProductItem>
            )} />
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center'
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
                            navData.navigation.navigate('EditProduct');
                        }}
                    />
                </HeaderButtons>
                )
    }
}

export default UserProductsScreen;