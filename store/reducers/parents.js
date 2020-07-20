import { FETCH_PARENTS } from '../actions/parents';

const initialState = {
    parents: []
}

export default (state = initialState, action) => {
    switch(action.type){
        case FETCH_PARENTS: 
            return{
                parents: action.parents
            }
    };
    return state;
};