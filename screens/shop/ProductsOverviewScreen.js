import React, {useEffect, useState, useCallback} from 'react';
import { FlatList, Button, ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import HeaderButton from '../../components/ui/HeaderButton';
import * as ProductsActions from '../../store/actions/products';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback (async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(ProductsActions.fetchProducts());
        } catch (error){
            setError(error.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect (() => {
        const unsubscribe = props.navigation.addListener(
            'focus', 
            loadProducts
        );

        return () => {
            unsubscribe();
        };
    },[loadProducts]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(()=> {
            setIsLoading(false);
        });
    }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', {
        productId: id,
        productTitle: title
      });
  } 

  if(error) {
      return (
        <View style = {styles.centered}>
            <Text>An error occured!</Text>
            <Button title="try again" onPress={loadProducts}/>
        </View>
      )
  }

  if(isLoading){
      return (
          <View style={styles.centered}>
              <ActivityIndicator size='large' color={Colors.primary}/>
          </View>
      )
  }

  if(!isLoading && products.length === 0){
      return (
          <View style = {styles.centered}>
              <Text>No Products Found. Start Adding Some</Text>
          </View>
      )
  }

  return (
    <FlatList
      data={products}
      onRefresh ={loadProducts}
      refreshing={isRefreshing}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {selectItemHandler(itemData.item.id, itemData.item.title)}}
        >
            <Button
                color={Colors.primary}
                title="View Details"
                onPress={() => {selectItemHandler(itemData.item.id, itemData.item.title)}}
            />
            <Button
                color={Colors.primary}
                title="To Cart"
                onPress={() => {
                     dispatch(cartActions.addToCart(itemData.item));
                }}
            />
        </ProductItem>
      )}
    />
  );
};

export const screenOptions = navData=> {
    return{
        headerTitle: 'All Products',
        headerRight: () =>(
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Cart' 
                    iconName='ios-cart' 
                    onPress={() => {
                        navData.navigation.navigate('Cart')
                    }}
                />
            </HeaderButtons>
        ),
        headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item 
                title='Cart' 
                iconName='ios-menu' 
                onPress={() => {
                    navData.navigation.toggleDrawer();
                }}
            />
        </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ProductsOverviewScreen;