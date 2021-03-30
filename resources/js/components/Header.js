import React from 'react';
import {useDispatch} from 'react-redux';

const Header = () => {
    const logout = async () => {
        const baseUrl = await localStorage.getItem("baseUrl");
        const csrfToken = await localStorage.getItem("csrfToken");
        const apiToken = await localStorage.getItem("authToken");

        const data = await fetch(baseUrl + '/logout', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
              'X-CSRF-TOKEN': csrfToken
            },
        })

        await localStorage.setItem("csrfToken", "");  
        await localStorage.setItem("authToken", ""); 
        dispatch({ type: 'GET_USER', payload: []})      
      
        location.reload();
        
    }

    const dispatch = useDispatch()

    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            {/* Left navbar links */}
            <ul className="navbar-nav">
            <li className="nav-item">
                <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
            </li>
            </ul>
            <ul className="navbar-nav ml-auto">
            <li className="nav-item d-none d-sm-inline-block">
               <a onClick={() => dispatch({type: "GET_SHOW_PROFILE_MODAL", payload: true})} className="nav-link">My Profile</a>
            </li>
            <li className="nav-item d-none d-sm-inline-block">
                <a href="#." className="nav-link" onClick={logout}>Logout</a>
            </li>
           </ul>
        </nav>
    )
}

export default Header;