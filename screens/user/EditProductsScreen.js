import React, { useCallback, useEffect, useReducer, useState} from 'react';
import {View, Text, ScrollView,  TextInput, StyleSheet, Alert, KeyboardAvoidingView} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {useSelector, useDispatch} from 'react-redux';

import HeaderButton from '../../components/ui/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/ui/Input';
import { ActivityIndicator } from 'react-native-paper';
import Colors from '../../constants/Colors';

const FORM_UPDATE = 'UPDATE';

const formReducer = (state, action) => {
    if(action.type === FORM_UPDATE){
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        }; 
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        };
    } 
    return state;
};

const EditProductsScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const prodId = props.route.params ? props.route.params.productId : null;
    const editedProduct = useSelector(
        state => state.products.userProducts.find(prod => prod.id === prodId)
    );

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            title: editedProduct ? editedProduct.title : '',
            price: ''
        }, 
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false,
        },
        formIsValid: editedProduct ? true : false
     });

    const dispatch = useDispatch();

    useEffect(()=> {
        if(error) {
            Alert.alert('An Error Occured', error, [
                {text: 'Okay'}
            ]);
        }
    }, [error]);

    const submitHandler = useCallback(async () => {
        if(!formState.formIsValid){
            Alert.alert('Wrong Input', 'Please Check The Errors In The Form', [
                {text: 'Okay'}
            ]);
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            if(editedProduct){
                await dispatch(productsActions.updateProduct(
                    prodId, 
                    formState.inputValues.title, 
                    formState.inputValues.description, 
                    formState.inputValues.imageUrl
                ));
            }else {
                await dispatch(productsActions.createProduct(
                    formState.inputValues.title, 
                    formState.inputValues.description, 
                    formState.inputValues.imageUrl, 
                    +formState.inputValues.price
                ));
            }
            props.navigation.goBack();
        }
        catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, [
            dispatch, 
            prodId, 
            formState
        ]
    );

    useEffect(()=> {
        props.navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item 
                        title='Save' 
                        iconName='ios-save' 
                        onPress={submitHandler}
                    />
                </HeaderButtons>
                )
        });
    }, [submitHandler]);

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    if(isLoading){
        return (
            <View style = {styles.centered}>
                <ActivityIndicator size='large' color= {Colors.primary}/>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView 
            style = {{flex: 1}}
            behavior='padding'
            keyboardVerticalOffset={100}>
            <ScrollView>
                <View style = {styles.form}>
                    <Input
                        id='title'
                        label='Title'
                        errorText='Please Enter A Valid Title'
                        autoCapitalize = 'sentences'
                        autoCorrect
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        inititalyValid={!!editedProduct}
                        required
                    />
                    {editedProduct ? null : (
                        <Input
                            id='price'
                            label='Price'
                            errorText='Please Enter A Valid Price'
                            returnKeyType="next"
                            keyboardType='decimal-pad'
                            onInputChange={inputChangeHandler}
                            required
                        />
                    )}
                    <Input
                        id='imageUrl'
                        label='Image Url'
                        errorText='Please Enter A Valid Image Url'
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        inititalyValid={!!editedProduct}
                        required
                    />
                    <Input
                        id = 'description'
                        label='Descrption'
                        errorText='Please Enter A Description'
                        autoCapitalize = 'sentences'
                        autoCorrect
                        multiline
                        numberOfLines={3}
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        inititalyValid={!!editedProduct}
                        required
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
};

export const screenOptions = navData => {
    const routeParams = navData.route.params ? navData.route.params : {}
    return {
        headerTitle: routeParams.productId ? "Edit Product" : "Add Product"
    };
}

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default EditProductsScreen;