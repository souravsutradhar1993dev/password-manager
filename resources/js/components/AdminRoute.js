import React from 'react';
import {useSelector} from 'react-redux'
import {
    Route,
    Redirect,
    Component
  } from "react-router-dom";

const AdminRoute = ({component: Component, role, ...rest}) => {
    const baseRoute = localStorage.getItem("routeBase");
    return (
        <Route
          {...rest}
          render={(props) => role === 'admin' || role === 'super-admin'
            ? <Component {...props} />
            : <Redirect to={"/" + baseRoute} />}
        />
      )
}

export default AdminRoute