import React from 'react';

class checkAuth extends React.Component {
    componentWillMount() {
        const baseRoute = localStorage.getItem("routeBase");
        window.location.href = '/' + baseRoute + 'login'
    }

    render() {
        return (
            <>
                <p></p>
            </>
        )
    }
}

export default checkAuth;