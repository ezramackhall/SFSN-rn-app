import React, {useState, useCallback, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import {View, Text, StyleSheet, Button, ActivityIndicator, Alert} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import Colors from '../../constants/Colors';
import NannyInfo from '../../components/shop/NannyInfo';
import * as contractActions from '../../store/actions/contract';

const ParentInfoScreen = props => {
    const currentParent = props.route.params.parent;
    const [nannyPicker, setNannyPick] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const nannies = useSelector(state=> state.nannies.nannies);
    const contract = useSelector(state=> state.contracts.contract);

    const nannyData = [];
    const dispatch = useDispatch();

    const loadContract = useCallback (async () => {
        setIsLoading(true);
        try {
            await dispatch(contractActions.getContract(currentParent));
        } catch (error){
            console.log(error);
        }
        setIsLoading(false);
    }, [dispatch]);

    useEffect(() => {
        loadContract().then(()=> {
        });
    }, [dispatch, loadContract]);

    nannies.forEach(nanny => {
        nannyData.push({
            label: nanny.firstName,
            value: nanny.id
        })
    });

    const addNannyContractHandler = () => {
        if(nannyPicker !== ''){
            if(!contract){
                Alert.alert('Are you sure?', 'Do you really want to add this nanny?', [
                    {text: 'No', style: 'destructive'},
                    {
                        text: 'Yes', 
                        style: 'cancel', 
                        onPress: () => {
                            dispatch(contractActions.createContract(currentParent.id, nannyPicker));
                            props.navigation.navigate('AvailableParents');
                        }}

                ])
            }else{
                Alert.alert('Are you sure?', 'Do you really want to change the nanny?', [
                    {text: 'No', style: 'destructive'},
                    {
                        text: 'Yes', 
                        style: 'cancel', 
                        onPress: () => {
                            dispatch(contractActions.updateContract(contract.id, nannyPicker, currentParent));
                        }}

                ])
            }
        }
    }

    const placeholder = {
        label: 'Select a value...',
        value: null,
        color: '#9EA0A4',
      };

    
    if(isLoading){
        return (<View>
            <ActivityIndicator color={Colors.primary} size='large'/>
        </View>
        )
    }

    return (
        <View style={styles.screen}>
            <View style={styles.card}>
                <View style={styles.box}>
                    <View style={styles.titleLine}>
                        <Text>User Info</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>First Name: </Text>
                            <Text style={styles.outputText}>{currentParent.firstName}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>Last Name: </Text>
                            <Text style={styles.outputText}>{currentParent.lastName}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>Email: </Text>
                            <Text style={styles.outputText}>{currentParent.email}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>Address: </Text>
                            <Text style={styles.outputText}>{currentParent.address}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>Postal Code: </Text>
                            <Text style={styles.outputText}>{currentParent.postalCode.toUpperCase()}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>City: </Text>
                            <Text style={styles.outputText}>{currentParent.city}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>Povince: </Text>
                            <Text style={styles.outputText}>{currentParent.province}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>Country: </Text>
                            <Text style={styles.outputText}>{currentParent.country}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.card}>
                {contract && 
                <View>
                    <View style={styles.nannyTitle}>
                        <Text >Manage Nanny Contract</Text>
                    </View>
                        <NannyInfo
                            nanny={contract.nanny}/>
                </View>
                }
            {!contract ? <Text style={{marginVertical:10}}>Pick A Nanny For Fulltime Service</Text>:
                <Text style={{marginVertical:10}}>Change Nanny</Text>}
                <RNPickerSelect
                                placeholder={placeholder}
                                items={nannyData}
                                onValueChange={nanny => {
                                    setNannyPick(nanny);
                                }}
                                InputAccessoryView={() => null}
                                style={pickerSelectStyles}
                                value={nannyPicker}
                />
                <Button 
                    title="Add Nanny" 
                    onPress={addNannyContractHandler}
                    color={Colors.primary}
                />
            </View> 
        </View>
    )
}
export const screenOptions = navData => {
    return {
        headerTitle: navData.route.params.parentName,
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginHorizontal: 20
    },
    card: {
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
    box:{
        borderColor: '#ccc',
        borderWidth: 1,
        marginVertical: 10
    },
    titleLine: {
        borderColor: '#ccc',
        borderBottomWidth: 1,
        alignItems: 'center',
        marginBottom: 5
    },
    nameContainer: {
        flexDirection: 'row'
    },
    outputText: {
        color: '#888'
    },
    nannyTitle:{
        alignItems: 'center'
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default ParentInfoScreen;