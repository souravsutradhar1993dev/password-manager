const iState = {
    showCategoryModal: false
}
const showCategoryModalReducer = (state = iState, action) => {
    switch(action.type) {
        case "GET_SHOW_CATEGORY_MODAL":
            return {
                ...state,
                showCategoryModal: action.payload
            }
        break;
        default:
            return state;
    }
   
}

export default showCategoryModalReducer;