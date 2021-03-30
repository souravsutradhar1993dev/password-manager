const iState = {
    menucategory: []
}
const menucategoryReducer = (state = iState, action) => {
    switch(action.type) {
        case "GET_MENU_CATEGORIES":
            return {
                ...state,
                menucategory: action.payload
            }
        break;
        default:
            return state;
    }
   
}

export default menucategoryReducer;