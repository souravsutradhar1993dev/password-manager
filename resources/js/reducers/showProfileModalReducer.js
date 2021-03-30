const iState = {
    showProfileModal: false
}
const showProfileModalReducer = (state = iState, action) => {
    switch(action.type) {
        case "GET_SHOW_PROFILE_MODAL":
            return {
                ...state,
                showProfileModal: action.payload
            }
        break;
        default:
            return state;
    }
   
}

export default showProfileModalReducer;