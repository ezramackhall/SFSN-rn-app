export const createNannyBooking = (date, nannyId, parentId, startTime, endTime, children, description) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const timeCreated = new Date();
        const accepted = false;
        const startDate = date + ',' + startTime;
        const endDate = date + ',' + endTime;
        const bookingDetails = {
            children,
            description
        }
        const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/nannyBookings.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                nannyId,
                parentId,
                timeCreated,
                accepted,
                startDate,
                endDate,
                bookingDetails
            })
        });

        const resData = await response.json();

            if(!response.ok){
                console.log(resData);
                throw new Error('Something went wrong!');
            }
    };
};

export const bookDayOff = (date, nannyId) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/nannyAvailability/.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                nannyId,
                date
            })
        });

        const resData = await response.json();

            if(!response.ok){
                console.log(resData);
                throw new Error('Something went wrong!');
            }
    };
};

