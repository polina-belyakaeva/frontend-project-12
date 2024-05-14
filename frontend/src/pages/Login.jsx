import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Container, FloatingLabel, Row, Col, Card, Image, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { AuthContext } from '../context/authContext.js';
import axios from 'axios';
import { ROUTES } from '../utils/routes';
import { useNavigate, Link } from 'react-router-dom';
import { setToken, setUsername } from '../slices/authSlice.js';
import loginAvatar from '../assets/loginAvatar.jpeg';

const Login = () => {
    const { login } = useContext(AuthContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');

    const addToken = (token) => dispatch(setToken(token));
    const addUsername = (username) => dispatch(setUsername(username));

    const { t } = useTranslation();
    
    const formik = useFormik({
        initialValues: {
            nickname: '',
            password: '',
        },
        onSubmit: async (values) => {
            try {
                const { nickname, password } = values;
                console.log(values);
                const response = await axios.post('/api/v1/login', { nickname, password });
                if (response.data.token) {
                    const token = response.data.token;
                    const username = response.data.nickname;
                
                    localStorage.setItem('username', username);
                    localStorage.setItem('token', token);
                    addToken(token);
                    addUsername(username);
                    login();
                
                    navigate(ROUTES.home);
                } else {
                    setErrorMessage(t('form.errors.nickname'));
                }
                
            } catch (error) {
                setErrorMessage(error.response?.data?.message || t('loginPage.error.serverError'));
            }
        }
    });

    return (
        <Container fluid className='h-100'>
            <Row className="h-100 justify-content-center align-content-center">
                <Col xs="12" md="8" xxl="6" className="align-items-center">
                    <Card className="shadow-sm">
                        <Card.Body className="row p-5" >
                            <Col xs="12" md="6" className="d-flex align-items-center justify-content-center">
                                <Image src={loginAvatar} alt={t('loginPage.imgAlt')} className="rounded-circle" />
                            </Col>
                            <Form 
                                className="col-12 col-md-6 mt-3 mt-md-0" 
                                onSubmit={formik.handleSubmit}
                            >
                                <h1 className="text-center mb-4">{t('loginPage.title')}</h1>
                                {errorMessage && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <Form.Group className="mb-3" controlId="nickname">
                                    <FloatingLabel label={t('loginPage.labels.nickname')}>
                                        <Form.Control
                                            type="text"
                                            name="nickname"
                                            value={formik.values.nickname}
                                            onChange={formik.handleChange}
                                            placeholder={t('loginPage.placeholders.nickname')}
                                            required
                                            isInvalid={formik.errors.nickname && formik.touched.nickname}
                                        />
                                    </FloatingLabel>
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.nickname}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label={t('loginPage.labels.password')}>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            onChange={formik.handleChange}
                                            value={formik.values.password}
                                            placeholder={t('loginPage.placeholders.password')}
                                            required
                                            isInvalid={formik.errors.password && formik.touched.password}
                                        />
                                    </FloatingLabel>
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button type="submit" variant="outline-primary" className="w-100 mb-3">
                                    {t('loginPage.buttons.login')}
                                </Button>
                            </Form>
                        </Card.Body>
                        <Card.Footer className='p-4'>
                            <div className='text-center'>
                                {t('loginPage.footer.isAccountExist')}{' '}
                                <Link to="/signup">{t('loginPage.footer.signup')}</Link>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
