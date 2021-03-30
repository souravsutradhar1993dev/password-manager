const iState = {
    user: []
}
const userReducer = (state = iState, action) => {
    switch(action.type) {
        case "GET_USER":
            return {
                ...state,
                user: action.payload
            }
        break;
        default:
            return state;
    }
   
}

export default userReducer;