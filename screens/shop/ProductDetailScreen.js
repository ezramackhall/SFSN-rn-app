import React from 'react';
import {
    Text, 
    View, 
    Image, 
    Button, 
    StyleSheet,
    ScrollView
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Colors from '../..//constants/Colors'
import * as cartActions from '../../store/actions/cart';

const ProductDetailsScreen = props => {

const productId = props.route.params.productId;
const selectedProduct = useSelector(state=> 
    state.products.availableProducts.find(prod => prod.id === productId)
);
const dispatch = useDispatch();

    return (
        <ScrollView>
            <View>
                <Image style = {styles.image} source = {{uri: selectedProduct.imageUrl}}/>
                <View style = {styles.actions}>
                    <Button 
                        style = {styles.button} 
                        color = {Colors.primary} 
                        title="Add To Cart" 
                        onPress={() => {dispatch(cartActions.addToCart(selectedProduct))}}
                    />
                </View>
                <Text style = {styles.price}>{selectedProduct.price.toFixed(2)}</Text>
                <Text style = {styles.description}>{selectedProduct.description}</Text>
            </View>
        </ScrollView>
    )
};

export const screenOptions = navData => {
    return {
        headerTitle: navData.route.params.productTitle
    };
}

const styles = StyleSheet.create({
    image: {
        height: 300,
        width: '100%'
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
    }, 
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20 
    },
    button: {
        paddingVertical: 10
    },
    actions: {
        marginVertical: 10,
        alignItems: 'center'
    }
});

export default ProductDetailsScreen;