const iState = {
    user: []
}
const userListReducer = (state = iState, action) => {
    switch(action.type) {
        case "GET_USER_LIST":
            return {
                ...state,
                user: action.payload
            }
        break;
        default:
            return state;
    }
}

export default userListReducer;