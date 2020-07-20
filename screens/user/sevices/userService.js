import User from '../../../models/user';

export const getUsers = async () => {
    const clientUrl = 'https://rn-complete-guide-eh.firebaseio.com/users/clients.json';
    const nannyUrl = 'https://rn-complete-guide-eh.firebaseio.com/users/nannys.json';
    
    const clients = await fetchUsers(clientUrl, false);
    const nannies = await fetchUsers(nannyUrl, true);

    const users = [];

    users.push(...clients);
    users.push(...nannies);

    return users;
};

const fetchUsers = async (url, nanny) => {
    const loadedUsers = [];
    try{
        const response = await fetch(url);

        if(!response.ok){
            throw new Error('Something went wrong!');
        }
        const resData = await response.json();

        for(const key in resData){
            let currentUser = resData[key];
            loadedUsers.push(
                new User(
                    key, 
                    currentUser.email,
                    currentUser.firstName, 
                    currentUser.lastName,
                    currentUser.address,
                    currentUser.postalCode,
                    currentUser.country,
                    currentUser.province,
                    currentUser.city,
                    nanny,
                    currentUser.isAdmin
                )
            );
        }
    }catch (error){
        console.log(error);
        throw new Error(error)
    }
    return loadedUsers;
};