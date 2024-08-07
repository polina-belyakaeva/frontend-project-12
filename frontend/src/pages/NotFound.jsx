import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/routes';
import notFound from '../assets/notFound.png';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Container
      fluid
      className="h-100 d-flex justify-content-center align-items-center"
    >
      <Card className="shadow-sm w-75" style={{ maxWidth: '600px' }}>
        <Card.Body className="d-flex flex-column align-items-center p-5">
          <Image
            src={notFound}
            alt={t('notFoundPage.notFoundAlt')}
            className="img-fluid mb-4"
            style={{ maxHeight: '300px', width: 'auto' }}
          />
          <Card.Text className="h4 text-muted text-center mb-3">
            {t('notFoundPage.notFound')}
          </Card.Text>
          <Card.Text className="text-muted text-center">
            {t('notFoundPage.redirectToSignup')}
&nbsp;
            <Link to={ROUTES.home}>{t('notFoundPage.mainPage')}</Link>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NotFound;
