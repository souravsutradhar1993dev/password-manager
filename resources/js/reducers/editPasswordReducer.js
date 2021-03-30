const iState = {
    password_data: []
}
const editPasswordReducer = (state = iState, action) => {
    switch(action.type) {
        case "SET_PASSWORD_DATA":
            return {
                ...state,
                password_data: action.payload
            }
        break;
        default:
            return state;
    }
   
}

export default editPasswordReducer;