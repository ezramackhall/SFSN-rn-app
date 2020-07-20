import User from '../../models/user';

export const FETCH_PARENTS = 'FETCH_PARENTS';

export const fetchParents = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch('https://rn-complete-guide-eh.firebaseio.com/users/clients.json');

            if(!response.ok){
                throw new Error('Something went wrong!');
            }
            const resData = await response.json();
            const loadedParents = [];

            for(const key in resData){
                let currentParent = resData[key];
                loadedParents.push(
                    new User(
                        key, 
                        currentParent.email,
                        currentParent.firstName, 
                        currentParent.lastName,
                        currentParent.address,
                        currentParent.postalCode,
                        currentParent.country,
                        currentParent.province,
                        currentParent.city,
                        false,
                        currentParent.isAdmin,
                    )
                );
            }
            dispatch({
                type: FETCH_PARENTS,
                parents: loadedParents
            });
        } catch (error){
            console.log(err);
            throw error;
        }
    };
}