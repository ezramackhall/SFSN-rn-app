import { FETCH_NANNYS } from '../actions/nannies';
import { CREATE_NANNY } from '../actions/auth';

const initialState = {
    nannies: []
}

export default (state = initialState, action) => {
    switch(action.type){
        case FETCH_NANNYS: 
            return{
                nannies: action.nannies
            }
        case CREATE_NANNY: 
            return {
                nannies: state.nannies.concat(action.nanny)
            }
    };
    return state;
};