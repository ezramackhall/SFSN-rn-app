import React, {useState, useCallback, useReducer} from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    Button, 
    ScrollView , 
    Alert, 
    KeyboardAvoidingView, 
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import {useDispatch} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import Input from '../../components/ui/Input';
import {trimTime, convertDate, trimDate} from '../../store/actions/helpers/dateHandler';
import * as nannyBookingActions from '../../store/actions/nannyBooking';

import Colors from '../../constants/Colors';

const FORM_UPDATE = 'UPDATE';

const initialValues = {
    inputValues: {
        children: '',
        description: ''
    },
    inputValidities: {
        children: false,
        description: false
    },
    formIsValid: false
};

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

const CreateNannyBookingScreen = props => {
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [formState, dispatchFormState] = useReducer(formReducer, initialValues);

    const dispatch = useDispatch();
  
    const onChangeStart = (event, selectedDate) => {
      const currentDate = selectedDate || startTime;
      setStartTime(currentDate);
    };

    const onChangeEnd = (event, selectedDate) => {
        const currentDate = selectedDate || endTime;
        setEndTime(currentDate);
    };

    const requestSubmitHandler = async () => {
        if(!formState.formIsValid){
            Alert.alert('Wrong Input', 'Please Check The Errors In The Form', [
                {text: 'Okay'}
            ]);
            return;
        }
        try {
            const dateString = (new Date(parseInt(props.route.params.currentDate))).toISOString();
            await dispatch(
                nannyBookingActions.createNannyBooking(
                    trimTime(convertDate(dateString)),
                    props.route.params.nannyId,
                    props.route.params.parentId,
                    trimDate(convertDate(startTime)),
                    trimDate(convertDate(endTime)),
                    formState.inputValues.children,
                    formState.inputValues.description
                )
            );
            Alert.alert('Request Submited', 'Your Request Has Been Submited', [
                {
                    text: 'Okay',
                    onPress: () => {
                        props.navigation.navigate('NannyBooking');
                    }
                }
            ]);    
        } catch (error){
            console.log(error);
        }
    };

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);
  
    return (
            <KeyboardAwareScrollView>
                <View>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style ={styles.inner}>
                            <View style={styles.requestDetails}>
                                <View>
                                <Input
                                    id='children'
                                    label='Number Of Children'
                                    errorText='Please Enter A Valid Number'
                                    keyboardType='decimal-pad'
                                    onInputChange={inputChangeHandler}
                                    required
                                />
                                <Input
                                    id = 'description'
                                    label='Descrption'
                                    errorText='Please Enter A Description'
                                    autoCapitalize = 'sentences'
                                    autoCorrect
                                    multiline
                                    numberOfLines={5}
                                    onInputChange={inputChangeHandler}
                                    initialValue=''
                                    required
                                />
                                </View>
                            </View>
                            <View style={styles.clockContainer}>
                                <View style={styles.clockText}>
                                    <Text>Start Time</Text>
                                </View>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    timeZoneOffsetInMinutes={-300}
                                    value={startTime}
                                    mode='time'
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChangeStart}
                                />
                                <View style={styles.clockText}>
                                    <Text>End Time</Text>
                                </View>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    timeZoneOffsetInMinutes={-300}
                                    value={endTime}
                                    mode='time'
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChangeEnd}
                                />
                            </View>
                            <View>
                                <Button 
                                    title='Submit Request' 
                                    color = {Colors.primary}
                                    onPress={requestSubmitHandler}
                                />
                            </View>
                    </View>
                </TouchableWithoutFeedback >
            </View>
        </KeyboardAwareScrollView>
    );
};

export const screenOptions = navData=> {
    return{
        headerTitle: 'Nanny Request',
    };
};

const styles = StyleSheet.create({
    clockText: {
        alignItems:'center'
    },
    requestDetails: {
        marginHorizontal: 20
    },
    container: {
        flex: 1, 
        flexDirection: 'column',
        justifyContent: 'center'
    },
    inner: {
        padding: 0,
        flex: 1,
        justifyContent: "space-around"
      },
      clockContainer:{
          marginVertical: 20
      }
});

export default CreateNannyBookingScreen;