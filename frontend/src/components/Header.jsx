import React, { useContext } from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import { ROUTES } from '../utils/routes';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext.js';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fullLogout } from '../slices/authSlice.js';

const Header = () => {
    const { t } = useTranslation();
    const { logout } = useContext(AuthContext);
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    const navbarRoute = token ? ROUTES.home : ROUTES.login;
    const navbarTitle = "Hexlet Chat";

    const handleLogout = () => {
        dispatch(fullLogout());
        logout();
    };

    return (
        <Navbar expand="lg" className="shadow-sm navbar-light bg-white">
            <Container>
            <Navbar.Brand as={Link} to={navbarRoute}>{navbarTitle}</Navbar.Brand>
            {token ? (
            <Button type="button" className="btn btn-primary" onClick={handleLogout}>{t('header.logout')}</Button>
            ):(null)}
            </Container>
        </Navbar>
    )
};

export default Header;