const iState = {
    categories: [],
    passwords: []
}
const sharedReducer = (state = iState, action) => {
    switch(action.type) {
        case "SHARED_DATA":
            return {
                ...state,
                categories: action.payload.categories,
                passwords: action.payload.passwords
            }
        break;
        default:
            return state;
    }
   
}

export default sharedReducer;