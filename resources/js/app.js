/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
import ReactDOM from 'react-dom';
import Index from './components/Index';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer';
import categoryReducer from './reducers/categoryReducer';
import menucategoryReducer from './reducers/menucategoryReducer';
import showPasswordModalReducer from './reducers/showPasswordModalReducer';
import showCategoryModalReducer from './reducers/showCategoryModalReducer';
import showUserModalReducer from './reducers/showUserModalReducer';
import showProfileModalReducer from './reducers/showProfileModalReducer';
import showExportModalReducer from './reducers/showExportModalReducer';
import allUserReducer from './reducers/allUserReducer';
import editPasswordReducer from './reducers/editPasswordReducer';
import editCategoryReducer from './reducers/editCategoryReducer';
import categoryChildrenReducer from './reducers/categoryChildrenReducer';
import sharedReducer from './reducers/sharedReducer';
import sharedPasswordReducer from './reducers/sharedPasswordReducer';
import sharedCategoryReducer from './reducers/sharedCategoryReducer';
import sharedChildrenReducer from './reducers/sharedChildrenReducer';
import {BrowserRouter as Router} from "react-router-dom";
import history from './history'

var rootReducer = combineReducers({
    user: userReducer,
    category: categoryReducer,
    menucategory: menucategoryReducer,
    showPasswordModal: showPasswordModalReducer,
    showCategoryModal: showCategoryModalReducer,
    showUserModal: showUserModalReducer,
    allUser: allUserReducer,
    showProfileModal: showProfileModalReducer,
    editCategory: editCategoryReducer,
    editPassword: editPasswordReducer,
    categoryChildren: categoryChildrenReducer,
    shared: sharedReducer,
    sharedPassword: sharedPasswordReducer,
    sharedCategory: sharedCategoryReducer,
    sharedChildren: sharedChildrenReducer,
    showExportModal: showExportModalReducer,
})
const store = createStore(rootReducer, applyMiddleware(thunk));

if (document.getElementById('app')) {
    ReactDOM.render(<Router history={history}><Provider store={store}><Index /></Provider></Router>, document.getElementById('app'));
}
