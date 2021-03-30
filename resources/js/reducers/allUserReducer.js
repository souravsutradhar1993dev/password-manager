const iState = {
    user: []
}
const allUserReducer = (state = iState, action) => {
    switch(action.type) {
        case "GET_ALL_USER":
            return {
                ...state,
                user: action.payload
            }
        break;
        default:
            return state;
    }
}

export default allUserReducer;