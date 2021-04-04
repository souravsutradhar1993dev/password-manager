import React from 'react';
import Breadcumb from './Breadcumb';
import {
    useHistory
  } from "react-router-dom";
const NotFound = (props) => {
    const history = useHistory();
    const baseRoute = localStorage.getItem("routeBase");
    return (
        <div className="content-wrapper">
            <Breadcumb getcat={props.getcat} title="404 Error" id="" addButton="password" pageType="not_found" />
                <section className="content">
                    <div className="error-page">
                        <h2 className="headline text-warning"> 404</h2>
                        <div className="error-content">
                        <h3><i className="fas fa-exclamation-triangle text-warning" /> Oops! Page not found.</h3>
                        <p>
                            We could not find the page you were looking for.
                            Meanwhile, you may <a href="#." onClick={() => history.push("/" + baseRoute)}>return to dashboard</a>.
                        </p>
                        </div>
                        {/* /.error-content */}
                    </div>
                    {/* /.error-page */}
                    </section>

        </div>
    )
}

export default NotFound