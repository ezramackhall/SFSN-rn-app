import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const FETCH_ORDERS = 'FETCH_ORDERS';

export const fetchOrders = () => {
    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/orders/${userId}.json`);

            if(!response.ok){
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            const loadedOrders = [];

            for(const key in resData){
                let currentOrder = resData[key];
                loadedOrders.push(
                    new Order(
                        key, 
                        currentOrder.cartItems,
                        currentOrder.totalAmount,
                        currentOrder.date
                    )
                );
            }

            dispatch({
                type: FETCH_ORDERS,
                orders: loadedOrders
            })
        } catch (error){
            console.log(err);
            throw error;
        }
    };
};

export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const date = new Date().toLocaleDateString('en-EN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date
            })
        });

        const resData = await response.json();

        const id = resData.name;

        if(!response.ok){
            console.log(resData);
            throw new Error('Something went wrong');
        }

        dispatch({
            type: ADD_ORDER, 
            orderData: {id: id, items: cartItems, amount: totalAmount, date: date}
        })
    };
};