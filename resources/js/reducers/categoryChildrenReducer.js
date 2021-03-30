const iState = {
    data: ''
}
const categoryChildrenReducer = (state = iState, action) => {
    switch(action.type) {
        case "SET_CATEGORY_CHILDREN":
            return {
                ...state,
                data: action.payload
            }
        break;
        default:
            return state;
    }
   
}

export default categoryChildrenReducer;