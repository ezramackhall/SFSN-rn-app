import { GET_CONTRACT } from '../actions/contract';


const initialState = {
    contract: null
}

export default (state = initialState, action) => {
    switch(action.type){
        case GET_CONTRACT: 
            return{
                ...state,
                contract: action.contract
            }
    };
    return state;
};