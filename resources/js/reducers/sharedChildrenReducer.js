const iState = {
    categories: [],
    passwords: []
}
const sharedChildrenReducer = (state = iState, action) => {
    switch(action.type) {
        case "SHARED_CHILDREN_DATA":
            return {
                ...state,
                categories: action.payload.categories,
                passwords: action.payload.passwords,
                name: action.payload.category_name,
                id: action.payload.category_id,
                permission_type: action.payload.category_permission
            }
        break;
        default:
            return state;
    }
   
}

export default sharedChildrenReducer;