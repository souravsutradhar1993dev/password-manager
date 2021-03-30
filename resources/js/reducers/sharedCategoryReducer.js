const iState = {
    shared_category_data: []
}
const sharedCategoryReducer = (state = iState, action) => {
    switch(action.type) {
        case "SHARED_CATEGORY_DATA":
            return {
                ...state,
                shared_category_data: action.payload
            }
        break;
        default:
            return state;
    }
   
}

export default sharedCategoryReducer;