import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Category from './Category';
import Dashboard from './Dashboard';
import User from './User';
import CategoryForm from './CategoryForm';
import PasswordForm from './PasswordForm';
import MyProfile from './MyProfile';
import Shared from './Shared';
import NotFound from './NotFound';
import AdminRoute from './AdminRoute';
import NonAdminRoute from './NonAdminRoute';
import AllCategory from './AllCategory';
import SharedChildren from './SharedChildren';
import ExportModal from './ExportModal'
import {getuser, getalluser, getmenucategories, editcategory, editpassword} from '../actions/action'
import {
    Switch,
    Route,
  } from "react-router-dom";

function Index(props) {
    const dispatch = useDispatch();
    const userName = useSelector((state) => {
        return state.user.user.name;
    })
    const [categoryList, setCategoryList] = useState([])
    const [userRole, setUserRole] = useState(localStorage.getItem("userRole"))
    
    const getCategory = async (id = '', type = 'category', editId = 0, dataType = 'normal') => {
        if(type == 'category') {
            //if(editId != '') {
                dispatch(editcategory(editId))
            //}
        }else if(type == 'password') {
            //if(editId != '') {
                dispatch(editpassword(editId))
            //}
        }
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");
        
        const data = await fetch(baseUrl + '/api/category?type=dropdown&id=' + id + '&data_type=' + dataType, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
            },
        })
        const resStatus = await data.status
        if(resStatus == 401) {
            window.location.href = baseUrl + '/login'
        }
        const categoryJson = await data.json() 
        setCategoryList(categoryJson.data)
        if(type == 'category') {
            dispatch({ type: 'GET_SHOW_CATEGORY_MODAL', payload: true})
        }else if(type == 'password') {
            dispatch({ type: 'GET_SHOW_PASSWORD_MODAL', payload: true})
        }else if(type == 'export') {
            dispatch({ type: 'GET_SHOW_EXPORT_MODAL', payload: true})
        }
    }

    const authCheck = async () => {
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");
        const data = await fetch(baseUrl + '/api/auth/check', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
            },
        })
        const authData = await data.json()
        const resStatus = await data.status
        if(resStatus == 401) {
            await localStorage.setItem("csrfToken", "");  
            await localStorage.setItem("authToken", ""); 
            dispatch({ type: 'GET_USER', payload: []})      
        
            window.location.href = baseUrl + '/login'
        }else {
            if(!authData.is_auth) {
                await localStorage.setItem("csrfToken", "");  
                await localStorage.setItem("authToken", ""); 
                dispatch({ type: 'GET_USER', payload: []})      
            
                location.reload();
            }
        }     
    }
    
    setTimeout(function(){ authCheck(); }, 10000);
    useEffect(() => {
        dispatch(getuser())
        dispatch(getalluser())
        dispatch(getmenucategories())
    }, [])
    const baseRoute = localStorage.getItem("routeBase");
    return (
        <>
            <div className="wrapper">
                <Header />
                <Sidebar getcat={getCategory} />
                <Switch>
                    <Route exact path={"/" + baseRoute } >
                        <Dashboard getcat={getCategory} />
                    </Route>
                    <Route exact path={"/" + baseRoute + "category/:id"} render={
                        () => <Category getcat={getCategory}/>
                    } >
                    </Route>
                    <Route exact path={"/"+baseRoute+"category"} render={
                        () => <AllCategory getcat={getCategory}/>
                    } >
                    </Route>
                    <AdminRoute role={userRole} exact path={"/"+baseRoute+"users"} component={(props) => <User getcat={getCategory} {...props} />} />
                    <NonAdminRoute role={userRole} exact path={"/"+baseRoute+"shared"} component={(props) => <Shared getcat={getCategory} {...props} />} />
                    <NonAdminRoute role={userRole} exact path={"/"+baseRoute+"shared/:id"} component={(props) => <SharedChildren getcat={getCategory} {...props} />} />
                    <Route>
                        <NotFound getcat={getCategory} />
                    </Route>
                </Switch>
                <Footer />
            </div>
            <CategoryForm categories={categoryList} />
            <PasswordForm categories={categoryList} />
            <ExportModal categories={categoryList} />
            <MyProfile />
        </>
    );
}

export default Index;
