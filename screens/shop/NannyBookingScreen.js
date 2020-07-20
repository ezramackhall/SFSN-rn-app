import React, {useState, useCallback, useEffect} from 'react';
import { StyleSheet, View, Text, Button, FlatList, ScrollView, ActivityIndicator, Alert } from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CalendarPicker from 'react-native-calendar-picker';
import Carousel from 'react-native-snap-carousel';
import {useDispatch, useSelector} from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import HeaderButton from '../../components/ui/HeaderButton';
import {getContractByNanny, getContract} from '../../store/actions/contract';
import {convertDate, trimTime, trimDate} from '../../store/actions/helpers/dateHandler';
import {fetchNannies} from '../../store/actions/nannies';
import {fetchParents} from '../../store/actions/parents';
import {loadPendingEvents, loadAcceptedEvents, acceptEvent, isNannyAvailable, getMonthlyNannyAvailability} from './services/dateLoader';
import NannyBooking from '../../components/shop/NannyBooking';
import * as nannyBookingActions from '../../store/actions/nannyBooking';
import Colors from '../../constants/Colors';


const NannyBookingScreen = props => {
    const [currentDate, setCurrentDate] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const currentUser = useSelector(state=> state.auth.userData);
    const token = useSelector(state=> state.auth.token);
    const contract = useSelector(state => state.contracts.contract);
    const [pendingEvents, setPendingEvents] = useState(null)
    const [acceptedEvents, setAcceptedEvents] = useState(null)
    const [activeIndex, setActiveIndex] = useState(0);
    const [customDatesStyles, setCustomDates] = useState([]);

    const carouselItems = [{
        page: 'page1'
    }, 
    {
        page: 'page2'
    }]

    const loadContract = useCallback (async () => {
        try {
            if(currentUser.isNanny){
                await dispatch(fetchParents());
                await dispatch(getContractByNanny(currentUser));
            }else{
                await dispatch(fetchNannies());
                await dispatch(getContract(currentUser));
            }
        } catch (error){
            console.log(error);
        }
    }, [dispatch]);

    const loadEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const pendingEvents = await loadPendingEvents(currentUser);
            setPendingEvents(pendingEvents);
            const acceptedEvents = await loadAcceptedEvents(currentUser);
            setAcceptedEvents(acceptedEvents);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }, [dispatch, isLoading])

    useEffect( () => {
        loadContract();
        loadEvents();
        dateChangeHandler(new Date());
        const unsubscribe = props.navigation.addListener('focus', () => {
            loadEvents();
            setActiveIndex(0);
        });
        return unsubscribe;
    }, [dispatch]);

    useEffect(() => {
        if(contract){
            setMonthlySchedule();
        }
    }, [contract])

    const setMonthlySchedule = async () => {
        const scheduleStyle = [];
        const availabilitySchedule = await getMonthlyNannyAvailability(contract.nanny.id, new Date(currentDate).getMonth());
        availabilitySchedule.forEach(function(dateBooked){
            scheduleStyle.push({
                date: dateBooked, 
                style : {backgroundColor: 'red'}, 
                textStyle: {color: 'black'}, 
                containerStyle: []
            });
        })

        setCustomDates(scheduleStyle);
    }


    const dateChangeHandler = async (date) => {
        setCurrentDate(date);
    };

    const submitRequestHandler = async() => {
        const date = (new Date(currentDate)).getTime();
        const available = await isNannyAvailable(contract.nanny.id, currentDate);
        if(available){
            props.navigation.navigate('CreateNannyBooking', {
                currentDate: `${date}`,
                parentId: contract.parent.id,
                nannyId: contract.nanny.id,
            });
        }else {
            Alert.alert('Day Unavailable', 'The Nanny Has Booked Off The Requested Day', [
                {
                    text: 'Okay'
                }
            ])
        }
    }

    const submitDayOffRequest = () => {
        console.log(currentDate);
        Alert.alert('Book Off Day', `Are You Sure You Want To Book Off ${trimTime(convertDate(currentDate))}`, [
            {
                text: 'Yes',
                style: 'destructive',
                onPress: () => {
                    dispatch(nannyBookingActions.bookDayOff(trimTime(convertDate(currentDate)), currentUser.id));
                }
            },
            {
                text: 'No',
            }
        ]); 
    }

    const acceptRequestHandler = async(requestId) => {
        await acceptEvent(requestId, token);
        loadEvents();
        setActiveIndex(0);
    }

    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator color={Colors.primary} size='large'/>
            </View>
        )
    }

    const _renderItem = ({item,index}) => {
        if(item.page === 'page1'){
            return (
            <View style={styles.carouselContainer}>
                <View style={styles.title}>             
                            <Text>Accepted Requests</Text>
                </View>
                {(acceptedEvents && acceptedEvents.length > 0) && 
                    <View>
                        {acceptedEvents.map((item) => (
                                <NannyBooking
                                    item={item}
                                    key={item.id}
                                />
                            ))}
                    </View>
                }
            </View>
            )
        }else{
            return (
                <View style={styles.carouselContainer}>
                    <View style= {styles.title}>
                        <Text>Pending Requests</Text>
                    </View>
                    {(pendingEvents && pendingEvents.length > 0) &&
                        <View>
                            {pendingEvents.map((item)=> (
                                    <NannyBooking
                                        item={item}
                                        acceptEvent={acceptRequestHandler}
                                        isNanny={currentUser.isNanny}
                                        key={item.id} 
                                    />
                            ))}
                        </View>
                    }
                </View>
            )
        }
    }

    return (
        <ScrollView>
            <View style = {styles.screen}>
            { !contract ? 
                <View style={styles.noContract}>
                    <Text>Current User Has No Contract Set With A Nanny</Text>
                </View>  
                :
                <View>
                    <View style={styles.title}>
                        <Text>Requests</Text>
                    </View>
                    <CalendarPicker
                        customDatesStyles= {customDatesStyles}
                        selectedDayColor={Colors.primary}
                        onDateChange={date => {
                            dateChangeHandler(date);
                        }}
                    />
                    {
                        !currentUser.isNanny ? 
                            <Button title ="Go To Request Screen" onPress={submitRequestHandler}/> 
                        :
                            <Button title = "Book Off Day" onPress={submitDayOffRequest}/>
                    }
                    <View style = {styles.card}></View>
                    <View>
                        { activeIndex == 0 ?
                            <View style = {styles.switch}>
                                <Ionicons
                                    name='ios-radio-button-on'
                                    size={15}
                                    color='#888'
                                />
                                <Ionicons
                                    name='ios-radio-button-off'
                                    size={15}
                                    color='#ccc'
                                /> 
                            </View>
                        :
                            <View style = {styles.switch}>
                                <Ionicons
                                name='ios-radio-button-off'
                                size={15}
                                color='#ccc'
                                /> 
                                <Ionicons
                                    name='ios-radio-button-on'
                                    size={15}
                                    color='#888'
                                />  
                            </View>
                        }
                    </View>
                    <View style = {styles.carousel}>
                        <Carousel
                            layout={"default"}
                            data={carouselItems}
                            sliderWidth={400}
                            itemWidth={400}
                            renderItem={_renderItem}
                            onSnapToItem = { index => setActiveIndex(index) } 
                        />
                    </View>
                </View>
            }
            </View>
        </ScrollView>
    )
};

export const screenOptions = navData => {
    return {
        headerTitle: 'Nanny Booking Screen',
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
    screen:{
        flex: 1,
        marginBottom: 50
    },
    card: {
        borderTopColor: '#888',
        borderTopWidth: 1,
        marginTop: 5,
        marginLeft: '5%',
        width: '90%'
    },
    noContract: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        alignItems: "center",
        margin: 10
    },
    carousel: {
        alignItems: "center",
        width: '100%'
    },
    centered: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    switch: {
        width: '100%',
        flexDirection:'row',
        justifyContent: 'center',
        marginTop: 10
    },
    carouselContainer: {
        minHeight: 300
    }
});

export default NannyBookingScreen;