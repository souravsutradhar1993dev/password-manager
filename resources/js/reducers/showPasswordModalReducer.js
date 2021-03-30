const iState = {
    showPasswordModal: false
}
const showPasswordModalReducer = (state = iState, action) => {
    switch(action.type) {
        case "GET_SHOW_PASSWORD_MODAL":
            return {
                ...state,
                showPasswordModal: action.payload
            }
        break;
        default:
            return state;
    }
   
}

export default showPasswordModalReducer;