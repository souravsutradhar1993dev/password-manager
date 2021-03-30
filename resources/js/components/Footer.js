import React from 'react';

const Footer = () => {
    return (
        <footer className="main-footer">
            <strong>Copyright © {new Date().getFullYear()} <a href="https://www.b3net.com/">B3NET INC</a>.</strong>
            All rights reserved.
        </footer>
    )
}

export default Footer;