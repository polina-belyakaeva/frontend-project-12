import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { ROUTES } from '../utils/routes';
import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

const Header = () => {
    return (
        <Navbar expand="lg" className="shadow-sm navbar-light bg-white">
            <Container>
            <Navbar.Brand as={Link} to={ROUTES.home}>Hexlet Chat</Navbar.Brand>
            </Container>
        </Navbar>
    )
};

export default Header;