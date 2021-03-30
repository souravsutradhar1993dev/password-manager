import React from 'react';
import {useSelector} from 'react-redux'
import {
    Route,
    Redirect,
    Component
  } from "react-router-dom";

const NonAdminRoute = ({component: Component, role, ...rest}) => {
            
    const baseRoute = localStorage.getItem("routeBase")
    return (
        <Route
          {...rest}
          render={(props) => role == 'employee'
            ? <Component {...props} />
            : <Redirect to={"/" + baseRoute } />}
        />
      )
}

export default NonAdminRoute