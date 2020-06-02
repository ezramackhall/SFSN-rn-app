import React, {useReducer, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';

import Colors from '../../constants/Colors';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

const inputReducer = (state, action) => {
    switch(action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid
            }
        case INPUT_BLUR:
            return {
                ...state,
                touched: true
            }
        default: 
            return state;
    }
};

const Input = props => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue ? props.initialValue: '',
        isValid: props.inititalyValid,
        touched: false
    });

    const {onInputChange, id} = props;

    useEffect(() => {
        if(inputState.touched){
            onInputChange(id, inputState.value, inputState.isValid);
        }
    }, [inputState, onInputChange, id]);

    const textChangeHandler = text => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
        isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
        isValid = false;
        }
        if(props.postalCode && !postalCodeRegex.test(text.toLowerCase())){
        isValid = false;
        }
        if (props.min != null && +text < props.min) {
        isValid = false;
        }
        if (props.max != null && +text > props.max) {
        isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
        isValid = false;
        }
        dispatch({type: INPUT_CHANGE, value: text, isValid: isValid})
        dispatch({type:INPUT_BLUR})
    };

    const lostFocusHandler = () => {
        dispatch({type:INPUT_BLUR});
    };

    return (
        <View style = {styles.inputContainer}>
        <Text style = {styles.label}>{props.label}</Text>
        <TextInput 
            {...props}
            style = {styles.input} 
            value={inputState.value} 
            onChangeText={textChangeHandler}
            onBlur={lostFocusHandler}
        />
        {!inputState.isValid && <Text style={styles.validText}>{props.errorText}</Text>}
    </View>
    )

};

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%'
    },
    label: {
        fontSize: 18,
        marginVertical: 8,
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    validText:{
        color: Colors.primary
    }
});

export default Input