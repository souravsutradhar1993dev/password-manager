const iState = {
    category_data: []
}
const editCategoryReducer = (state = iState, action) => {
    switch(action.type) {
        case "SET_CATEGORY_DATA":
            return {
                ...state,
                category_data: action.payload
            }
        break;
        default:
            return state;
    }
   
}

export default editCategoryReducer;