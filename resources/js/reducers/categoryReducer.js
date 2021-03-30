const iState = {
    category_id: ''
}
const categoryReducer = (state = iState, action) => {
    switch(action.type) {
        case "SET_CATEGORY_ID":
            return {
                ...state,
                category_id: action.payload
            }
        break;
        default:
            return state;
    }
   
}

export default categoryReducer;