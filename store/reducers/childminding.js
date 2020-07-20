import { ADD_REQUEST, FETCH_REQUESTS, DELETE_REQUEST, FETCH_BOOKINGS, FETCH_BOOKINGS_PAID } from "../actions/childminding";
import ChildMinderRequest from '../../models/childminderRequest';

const initialState = {
    requests: [],
    bookings: [],
    bookingsPaid: []
};

export default (state = initialState, action) => {
    switch(action.type){
        case FETCH_REQUESTS: 
            return{
                ...state,
                requests: action.requests
            }
        case FETCH_BOOKINGS:
            return{
                ...state,
                bookings: action.bookings
            }
        case FETCH_BOOKINGS_PAID:
            return{
                ...state,
                bookingsPaid: action.bookingsPaid
            }
        case ADD_REQUEST:
            return {
            ...state,
            requests: state.requests.concat(action.request)
            }
        case DELETE_REQUEST:
            return {
                ...state,
                requests: state.requests.filter(
                    request => request.id !== action.rid 
                )
            };
    };
    return state;
};