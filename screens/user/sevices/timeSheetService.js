import firebase from 'firebase';
import TimeSheetEvent from '../../../models/timeSheetEvent';

export const createTimeSheetEvent = async (nannyId, startTime, endTime, token, eventId, isChildminding) => {
    try{
        const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/timeSheets/${nannyId}.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    nannyId,
                    startTime,
                    endTime,
                    eventId,
                    isChildminding
                })
        });

        const resData = await response.json();

        if(!response.ok){
            console.log(resData);
            throw new Error('Something went wrong!');
        }
    }catch (error){
        console.log(error);
        throw new Error(error);
    }
};

export const getNannyTimeSheet = async (nannyId) => {
    const db = firebase.database();
    const timeSheets = db.ref().child('timeSheets');
    const result = timeSheets.child(`${nannyId}`)
    const snap = await result.once('value');
    const value = snap.val();
    const timeSheet = [];

    for(const key in value){
        timeSheet.push(value[key]);
    }

    return timeSheet
}

export const getBookedChildminderEvents = async (nannyId) => {
    const db = firebase.database();
    const bookings = db.ref().child('childminding/booked');
    const result = bookings
        .orderByChild('nannyId')
        .equalTo(nannyId);
    const snap = await result.once('value');
    const value = snap.val();
    const bookedResults = [];
    for(const key in value){
        const event = new TimeSheetEvent(key, value[key].startDate, value[key].endDate, false)
        bookedResults.push(event);
    }
    return bookedResults;
}

export const getBookedNannyEvents = async (nannyId) => {
    const db = firebase.database();
    const bookings = db.ref().child('nannyBookings');
    const result = bookings
        .orderByChild('nannyId')
        .equalTo(nannyId);
    const snap = await result.once('value');
    const value = snap.val();
    const bookedResults = []; 
    for(const key in value){
        if(value[key].accepted === true){
            const event = new TimeSheetEvent(key, value[key].startDate, value[key].endDate, false)
            bookedResults.push(event);
        }
    }
    return bookedResults;
}