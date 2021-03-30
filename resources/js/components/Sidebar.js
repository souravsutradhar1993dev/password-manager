import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { 
    Link
  } from "react-router-dom";

function Sidebar(props) {
    const baseUrl = localStorage.getItem("baseUrl");
    const userName = useSelector((state) => {
        return state.user.user.name;
    })
    const userRole = useSelector((state) => {
        return state.user.user.role;
    })
    const currentCategoryId = useSelector((state) => {
        return state.category.category_id;
    })

    const allCategories = useSelector((state) => {
        return state.menucategory.menucategory;
    })

    const dispatch = useDispatch()
    const baseRoute = localStorage.getItem("routeBase");
    var menuHtml = ''
    const getMenu = (categories = allCategories) => {
        if(categories !== undefined) {
            menuHtml = categories.map((cat, ind) => {
                return <li className="nav-item" key={ind}>
                            <Link to={"/"+baseRoute+"category/" + cat.encrypt_id} className="nav-link">
                                <i className="material-icons button left nav-icon">{cat.category_icon}</i>
                                <p>
                                    {cat.label}
                                    {cat.children === undefined ? '' : <i className="right fas fa-angle-left" />}
                                </p>
                            </Link>
                            {cat.children === undefined ? '' : <ul className="nav nav-treeview">{getMenu(cat.children)}</ul>}
                            
                        </li>
            })
        }

        return menuHtml;
    }
    getMenu()

    return (
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
            {/* Brand Logo */}
            <Link to={"/" + baseRoute} className="brand-link">
            <img src={baseUrl + "/public/dist/img/b3net.jpg"} alt="B3net Inc" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
            <span className="brand-text font-weight-light">B3NET INC</span>
            </Link>
            {/* Sidebar */}
            <div className="sidebar">
                <div className="user-panel mt-3 pb-3 mb-3 d-flex"  onClick={() => dispatch({type: "GET_SHOW_PROFILE_MODAL", payload: true})}>
                    <div className="image">
                        <img src={"https://ui-avatars.com/api/?name=" + userName} className="img-circle elevation-2" alt="User Image" />
                    </div>
                    <div className="info">
                        <a href="#" className="d-block">{userName}</a>
                    </div>
                </div>

            <nav className="mt-2">
                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    {
                        userRole === 'employee' ?
                        <li className="nav-item">
                            <Link to={"/"+baseRoute+"shared/"} className="nav-link">
                            <i className="nav-icon fa fa-share-alt"></i>
                            <p>
                                Shared with me
                            </p>
                            </Link>
                        </li>
                        :
                        ""
                    }
                    {
                        userRole === 'admin' || userRole === 'super-admin' ?
                        <li className="nav-item">
                            <Link to={"/"+baseRoute+"users/"} className="nav-link">
                            <i className="nav-icon fas fa-th"></i>
                            <p>
                                All Users
                            </p>
                            </Link>
                        </li>
                        :
                        ""
                    }
                    
                    <li className="nav-item">
                        <a className="nav-link" onClick={() => props.getcat(currentCategoryId, 'category')}>
                        <i className="nav-icon fas fa-plus"></i>
                        <p>
                            Add Account
                        </p>
                        </a>
                    </li>
                    <li className="nav-header">ACCOUNTS</li>
                    <li className="nav-item">
                        <Link to={"/"+baseRoute+"category/"} className="nav-link">
                            <i className="nav-icon fas fa-th"></i>
                            <p>
                                All Accounts
                            </p>
                        </Link>
                        
                    </li>
                    {
                    menuHtml
                    }
                </ul>
            </nav>
            {/* /.sidebar-menu */}
            </div>
            {/* /.sidebar */}
        </aside>
    )
}

export default Sidebar;