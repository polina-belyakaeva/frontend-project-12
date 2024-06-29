import React, { useContext } from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../utils/routes';
import { AuthContext } from '../context/authContext.js';
import { fullLogout } from '../slices/authSlice.js';

const Header = () => {
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navbarRoute = token ? ROUTES.home : ROUTES.login;

  const handleLogout = () => {
    dispatch(fullLogout());
    logout();
  };

  return (
    <Navbar expand="lg" className="shadow-sm navbar-light bg-white">
      <Container>
        <Navbar.Brand as={Link} to={navbarRoute}>
          {t('header.title')}
        </Navbar.Brand>
        {token ? (
          <Button
            type="button"
            className="btn btn-primary"
            onClick={handleLogout}
          >
            {t('header.logout')}
          </Button>
        ) : null}
      </Container>
    </Navbar>
  );
};

export default Header;
