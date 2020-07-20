import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {useSelector} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import HeaderButton from '../../components/ui/HeaderButton';
import {convertDate, trimTime} from '../../store/actions/helpers/dateHandler';
import {createTimeSheetEvent} from './sevices/timeSheetService';
import {getBookedChildminderEvents, getBookedNannyEvents} from './sevices/timeSheetService';
import TimeSheetEntry from '../../components/shop/TimeSheetEntry';
import Colors from '../../constants/Colors';

const TimeSheetEntryScreen = props => {
    const [dateStart, setDateStart] = useState(new Date());
    const [dateEnd, setDateEnd] = useState(new Date());
    const [isChildminder, setIsChildminder] = useState(true);
    const [currentEventSelected, setCurrentEventSelected] = useState(null);
    const [applicableBookings, setApplicableBookings] = useState([]);
    const currentUser = useSelector(state=> state.auth.userData);
    const token = useSelector(state=> state.auth.token);

    const onChangeStart = (event, selectedDate) => {
        const currentDate = selectedDate || dateStart;
        setDateStart(currentDate);
    };

    const onChangeEnd = (event, selectedDate) => {
        const currentDate = selectedDate || dateEnd;
        setDateEnd(currentDate);
    };

    useEffect( () => {
        eventTypeHandler(true);
    },[])

    const eventTypeHandler = async (childminder) => {
        const result = await getEvents(childminder);
        setApplicableBookings(result);
    }

    const getEvents = async (childminder) => {
        setIsChildminder(childminder);
        let events;
        if(childminder === true) {
            events = await getBookedChildminderEvents(currentUser.id);
        } else {
            events = await getBookedNannyEvents(currentUser.id);
        }
        return events
    }

    const bookingPickedHandler = async (item) => {
        refreshList();
        setCurrentEventSelected(item.id);
        item.selected = true;
    }

    const refreshList = () => {
        applicableBookings.forEach(element => {
            element.selected = false;
        });
    }

    const requestSubmitHandler = async () => {
        await createTimeSheetEvent(currentUser.id, dateStart, dateEnd, token, currentEventSelected, isChildminder);
        Alert.alert('Time Sheet Entry Submitted', 'Your Shift Times Have Been Submitted', [{
            text: 'Okay',
            onPress: () => {
                props.navigation.goBack();
            }
        }])

    };

    return(
    <ScrollView>
        <View>
            <View style = {styles.dateText}>
                <Text>Current Date: {trimTime(convertDate(new Date()))}</Text>
            </View>
            <View style={styles.switchContainer}>
                <View 
                    style={isChildminder ? 
                        {backgroundColor: Colors.primary} : 
                        {backgroundColor: 'white'}
                    }
                >
                    <Button 
                        color={isChildminder ? 'white' : Colors.primary} 
                        title="Childminding" onPress={()=> {eventTypeHandler(true)}}
                    />
                </View>
                <View 
                    style={isChildminder ? 
                        {backgroundColor: 'white'} : 
                        {backgroundColor: Colors.primary}
                    }
                >
                    <Button 
                        color={isChildminder ?  Colors.primary : 'white'} 
                        title="Nanny Contract" onPress={()=> {eventTypeHandler(false)}}
                    />
                </View>
            </View>
            <View>
                {applicableBookings.map((item) => (
                    <TouchableOpacity key={`${item.id}`} onPress= {()=> {bookingPickedHandler(item)}  }>
                    <View style = {!item.selected ? styles.card : styles.cardSelected}>
                    <TimeSheetEntry 
                        item={item}
                        startTime={item.startTime} 
                        endTime={item.endTime}
                        selected={item.selected}
                    />
                    </View>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.clockContainer}>
                <View style={styles.clockText}>
                    <Text>Start Time</Text>
                </View>
                <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={-300}
                    value={dateStart}
                    mode='datetime'
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
                    value={dateEnd}
                    mode='datetime'
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
    </ScrollView>
    )
}

export const screenOptions = navData => {
    return {
        headerTitle: 'Clock In/Out',
    };
};

const styles = StyleSheet.create({
    clockContainer:{
        marginVertical: 20
    },
    clockText: {
        alignItems:'center'
    },
    dateText: {
        marginVertical: 10,
        alignItems: 'center'
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card:{
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        alignItems: 'center'
    }, 
    cardSelected:{
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: '#888',
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        alignItems: 'center'
    }
});

export default TimeSheetEntryScreen;