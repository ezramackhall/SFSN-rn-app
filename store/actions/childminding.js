import ChildmindRequest from '../../models/childminderRequest';
import ChildmindBooking from '../../models/childminderBooking';
import {getUserData} from './auth';

export const ADD_REQUEST = 'ADD_REQUEST';
export const FETCH_REQUESTS = 'FETCH_REQUESTS';
export const DELETE_REQUEST = 'DELETE_REQUEST';
export const FETCH_BOOKINGS = 'FETCH_BOOKINGS';
export const FETCH_BOOKINGS_PAID = 'FETCH_BOOKINGS_PAID';

export const fetchRequests = () => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
        const isNanny = getState().auth.userData.isNanny;
        const isAdmin = getState().auth.isAdmin;
        try {
            const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/childminding/requests.json`);

            if(!response.ok){
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            const loadedRequests = [];



            for(const key in resData){
                let currentRequest = resData[key];
                let currentUser = await getUserData(currentRequest.userId, false);
                loadedRequests.push(
                    new ChildmindRequest(
                        key, 
                        currentUser,
                        convertDate(currentRequest.currentDate),
                        convertDate(currentRequest.startTime),
                        convertDate(currentRequest.endTime),
                        currentRequest.numberOfChildren,
                        currentRequest.specialInfo,
                        currentRequest.pets,
                        currentRequest.description,
                        currentRequest.isPaid
                    )
                );
            }

            dispatch({
                type: FETCH_REQUESTS,
                requests: getRequests(loadedRequests, userId, isAdmin, isNanny)
            })
        } catch (error){
            console.log(err);
            throw error;
        }
    };
};

export const fetchBookings = () => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
        const isAdmin = getState().auth.isAdmin;
        try {
            const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/childminding/booked.json`);

            if(!response.ok){
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            const paidBookings = [];
            const unpaidBookings = [];

            for(const key in resData){
                let currentBooking = resData[key];
                let currentParent = await getUserData(currentBooking.userId, false);
                let currentNanny = await getUserData(currentBooking.nannyId, true);
                let bookingToPush = new ChildmindBooking(
                    key, 
                    currentParent,
                    currentNanny,
                    currentBooking.requestDate,
                    currentBooking.startDate,
                    currentBooking.endDate,
                    currentBooking.numberOfChildren,
                    currentBooking.description,
                    currentBooking.acceptedDate,
                    currentBooking.isPaid
                );
                if(!currentBooking.isPaid){
                    unpaidBookings.push(bookingToPush);
                }else {
                    paidBookings.push(bookingToPush);
                }
            }

            dispatch({
                type: FETCH_BOOKINGS,
                bookings: getBookings(unpaidBookings, userId, isAdmin)
            })
            dispatch({
                type: FETCH_BOOKINGS_PAID,
                bookingsPaid: getBookings(paidBookings, userId, isAdmin)
            })
        } catch (error){
            console.log(error);
            throw error;
        }
    };
};

export const createRequest = (startTime, endTime, numberOfChildren, specialInfo, pets, description) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const currentDate = new Date().toISOString();
        const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/childminding/requests.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                userId,
                currentDate,
                startTime,
                endTime,
                numberOfChildren,
                description,
                specialInfo,
                pets,
                isPaid: false
            })
        });

        const resData = await response.json();

        if(!response.ok){
            console.log(resData);
            throw new Error('Something went wrong!');
        }

        const requestUser = await getUserData(userId, false);

        const newRequst = new ChildmindRequest(
            resData.name, 
            requestUser,
            convertDate(currentDate),
            convertDate(startTime),
            convertDate(endTime),
            numberOfChildren,
            specialInfo,
            pets,
            description
        )

        dispatch({
            type: ADD_REQUEST, 
            request: newRequst
        });
    };

};

export const createEventRequest = (startTime, endTime, numberOfChildren, description, address) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const currentDate = new Date().toISOString();
        const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/eventchildminding/.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                userId,
                currentDate,
                startTime,
                endTime,
                numberOfChildren,
                description,
                address
            })
        });

        const resData = await response.json();

        if(!response.ok){
            console.log(resData);
            throw new Error('Something went wrong!');
        }
    };
};

export const deleteRequest = requestId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(
            `https://rn-complete-guide-eh.firebaseio.com/childminding/requests/${requestId}.json?auth=${token}`, 
            {
                method: 'DELETE',
        });
        if(!response.ok){
            console.log(response);
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();

        dispatch({type: DELETE_REQUEST, rid: requestId});
    };
}

export const requestToScheduledEvent = request => {
    return async (dispatch, getState) => {
        const nannyId = getState().auth.userId;
        const token = getState().auth.token;
        const currentDate = convertDate(new Date().toISOString());
        try{
            await dispatch(deleteRequest(request.id));
            const {requestDate, startDate, endDate, numberOfChildren, description, user} = request;
            const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/childminding/booked.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    acceptedDate: currentDate,
                    requestDate,
                    startDate,
                    endDate,
                    numberOfChildren,
                    description,
                    userId: user.id,
                    nannyId,
                    isPaid: false
                })
            });

            const resData = await response.json();

            if(!response.ok){
                console.log(resData);
                throw new Error('Something went wrong!');
            }
        }catch (error){
            console.log(error);
        }
    }
}

export const convertDate = (dateToConvert) => { 
    const convertedDate = new Date(dateToConvert).toLocaleDateString('en-EN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    return convertedDate;
}

const getRequests = (loadedRequests, userId, isAdmin, isNanny) => {
    let userRequests = loadedRequests;
    if(!isAdmin && !isNanny){
        userRequests = loadedRequests.filter(request => request.user.id === userId);
    }
    return userRequests;
}

const getBookings = (loadedBookings, userId, isAdmin) => {
    let userBookings = loadedBookings;
    if(!isAdmin){
        userBookings = loadedBookings.filter(booking => (booking.parent.id === userId || booking.nanny.id === userId));
    }
    return userBookings;
}