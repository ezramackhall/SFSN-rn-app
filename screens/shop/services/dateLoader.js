import Event from '../../../models/event';
import firebase from 'firebase';
import {convertDate, trimTime, trimDate} from '../../../store/actions/helpers/dateHandler';


export const loadPendingEvents = async (user) => {
    const loadedEvents = [];
    try {
        const db = firebase.database();
        const nannyBookings = db.ref().child('nannyBookings');
        let result = null;
        if(user.isNanny){
            result = nannyBookings
                .orderByChild('nannyId')
                .equalTo(user.id);
        }else{
            result = nannyBookings
                .orderByChild('parentId')
                .equalTo(user.id);
        }

        const snap = await result.once('value');
        const value = snap.val();

        for(const key in value){
            let currentEvent = value[key];
            if(!currentEvent.accepted){
                loadedEvents.push(
                    new Event(
                        key, 
                        currentEvent.parentId,
                        currentEvent.nannyId,
                        currentEvent.timeCreated,
                        currentEvent.startDate,
                        currentEvent.endDate,
                        currentEvent.bookingDetails,
                        currentEvent.accepted
                    )
                );
            }
        }
        return loadedEvents;
            
    } catch (error){
        console.log(error);
        throw error;
    }
};

export const loadAcceptedEvents = async (user) => {
    const loadedEvents = [];
    try {
        const db = firebase.database();
        const nannyBookings = db.ref().child('nannyBookings');
        let result = null;
        if(user.isNanny){
            result = nannyBookings
                .orderByChild('nannyId')
                .equalTo(user.id);
        }else{
            result = nannyBookings
                .orderByChild('parentId')
                .equalTo(user.id);
        }

        const snap = await result.once('value');
        const value = snap.val();

        for(const key in value){
            let currentEvent = value[key];
            if(currentEvent.accepted){
                loadedEvents.push(
                    new Event(
                        key, 
                        currentEvent.parentId,
                        currentEvent.nannyId,
                        currentEvent.timeCreated,
                        currentEvent.startDate,
                        currentEvent.endDate,
                        currentEvent.bookingDetails,
                        currentEvent.accepted
                    )
                );
            }
        }
        loadedEvents.sort(function(a,b){
            return  new Date(a.startDate) - new Date(b.startDate);
        });
        return loadedEvents;
            
    } catch (error){
        console.log(error);
        throw error;
    }
};

export const acceptEvent = async (requestId, token) => {
    try {
        const accepted = true;
        const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/nannyBookings/${requestId}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                accepted
            })
        });

        const resData = await response.json();

        if(!response.ok){
            throw new Error('Something went wrong!');
        }


    } catch (error){
        console.log(error);
        throw error;
    }
};

export const isNannyAvailable = async (nannyId, date) => {
    let isAvailable = true;
    try{
        const value = await fetchAvailability(nannyId);

        for(const key in value){
            if( (new Date(trimTime(convertDate(new Date(value[key].date)))) - 
            new Date (trimTime(convertDate(new Date(date))))) == 0 ){
                isAvailable = false;
            }
        }
        return isAvailable;
    }catch (error){
        console.log(error);
    }
}

export const getMonthlyNannyAvailability = async (nannyId, month) => {
    try{
        const value = await fetchAvailability(nannyId);
        const nannyAvailability = [];
        for(const key in value){
            if(new Date(value[key].date).getMonth() === month ){
                nannyAvailability.push(new Date(value[key].date));
            }
        }
        return nannyAvailability;
    }catch (error){
        console.log(error);
    }
}

const fetchAvailability = async (nannyId) => {
    const db = firebase.database();
    const nannyAvailability = db.ref().child('nannyAvailability');
    const result = nannyAvailability
            .orderByChild('nannyId')
            .equalTo(nannyId);
    const snap = await result.once('value');
    const value = snap.val();
    return value;
}