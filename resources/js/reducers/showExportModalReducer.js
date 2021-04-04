const iState = {
    showExportModal: false
}
const showExportModalReducer = (state = iState, action) => {
    switch(action.type) {
        case "GET_SHOW_EXPORT_MODAL":
            return {
                ...state,
                showExportModal: action.payload
            }
        break;
        default:
            return state;
    }
   
}

export default showExportModalReducer;