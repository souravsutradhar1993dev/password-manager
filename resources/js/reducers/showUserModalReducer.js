const iState = {
    showUserModal: false
}
const showUserModalReducer = (state = iState, action) => {
    switch(action.type) {
        case "GET_SHOW_USER_MODAL":
            return {
                ...state,
                showUserModal: action.payload
            }
        break;
        default:
            return state;
    }
   
}

export default showUserModalReducer;