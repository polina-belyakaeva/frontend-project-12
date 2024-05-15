import React, { useContext } from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import { ROUTES } from '../utils/routes';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext.js';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const authContext = useContext(AuthContext);
    const { t } = useTranslation();

    const { logout } = useContext(AuthContext);

    return (
        <Navbar expand="lg" className="shadow-sm navbar-light bg-white">
            <Container>
            <Navbar.Brand as={Link} to={ROUTES.home}>Hexlet Chat</Navbar.Brand>
            {authContext.isAuthenticated ? (
            <Button type="button" className="btn btn-primary" onClick={logout}>{t('header.logout')}</Button>
            ):(null)}
            </Container>
        </Navbar>
    )
};

export default Header;