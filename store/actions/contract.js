import Contract from "../../models/contract";

export const CREATE_CONTRACT='CREATE_CONTRACT';
export const GET_CONTRACT='GET_CONTRACT';

export const createContract = (parentId, nannyId) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/contracts.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                parentId,
                nannyId
            })
        });

        const resData = await response.json();


            if(!response.ok){
                console.log(resData);
                throw new Error('Something went wrong!');
            }
    };
};

export const updateContract = (id, nannyId, parent) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const parentId = parent.id;
        const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/contracts/${id}.json?auth=${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                parentId,
                nannyId
            })
        });

        const resData = await response.json();

        const contract = new Contract(
            id,
            parent,
            getNannyInfo(getState().nannies.nannies, nannyId)
        )

            if(!response.ok){
                console.log(resData);
                throw new Error('Something went wrong!');
            }
        dispatch({type:GET_CONTRACT, contract: contract});
    };
};

export const getContract = (parent) => {
    return async (dispatch, getState) => {
        const nannies = getState().nannies.nannies;
        const response = await fetch ('https://rn-complete-guide-eh.firebaseio.com/contracts.json');
            
        if(!response.ok){
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();

        let contract = null;
        for(const key in resData){
            let currentContract = resData[key];
            if (currentContract.parentId === parent.id){
                contract = new Contract(
                    key,
                    parent,
                    getNannyInfo(nannies, currentContract.nannyId)
                );
            }
        }

        dispatch({type:GET_CONTRACT, contract: contract});
    };
};

export const getContractByNanny = (nanny) => {
    return async (dispatch, getState) => {
        const parents = getState().parents.parents;
        const response = await fetch ('https://rn-complete-guide-eh.firebaseio.com/contracts.json');
            
        if(!response.ok){
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();

        let contract = null;
        for(const key in resData){
            let currentContract = resData[key];
            if (currentContract.nannyId === nanny.id){
                contract = new Contract(
                    key,
                    getParentInfo(parents, currentContract.parentId),
                    nanny,
                );
            }
        }
        dispatch({type:GET_CONTRACT, contract: contract});
    };
};

const getNannyInfo = (nannies ,nannyId) => {
    return nannies.filter(nanny=> nanny.id === nannyId).pop();
}

const getParentInfo = (parents ,parentId) => {
    return parents.filter(parent=> parent.id === parentId).pop();
}