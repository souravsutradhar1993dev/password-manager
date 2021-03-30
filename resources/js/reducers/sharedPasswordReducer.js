const iState = {
    shared_password_data: []
}
const sharedPasswordReducer = (state = iState, action) => {
    switch(action.type) {
        case "SHARED_PASSWORD_DATA":
            return {
                ...state,
                shared_password_data: action.payload
            }
        break;
        default:
            return state;
    }
   
}

export default sharedPasswordReducer;