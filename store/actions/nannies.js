import User from '../../models/user';

export const FETCH_NANNYS = 'FETCH_NANNYS';

export const fetchNannies = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch('https://rn-complete-guide-eh.firebaseio.com/users/nannys.json');

            if(!response.ok){
                throw new Error('Something went wrong!');
            }
            const resData = await response.json();
            const loadedNannies = [];

            for(const key in resData){
                let currentNanny = resData[key];
                loadedNannies.push(
                    new User(
                        key, 
                        currentNanny.email,
                        currentNanny.firstName, 
                        currentNanny.lastName,
                        currentNanny.address,
                        currentNanny.postalCode,
                        currentNanny.country,
                        currentNanny.province,
                        currentNanny.city,
                        true,
                        false
                    )
                );
            }
            dispatch({
                type: FETCH_NANNYS,
                nannies: loadedNannies
            });
        } catch (error){
            console.log(err);
            throw error;
        }
    };
}