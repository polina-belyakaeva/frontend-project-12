import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Container, FloatingLabel, Row, Col, Card, Image, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { AuthContext } from '../context/authContext.js';
import axios from 'axios';
import { API_ROUTES } from '../utils/routes';
import { useNavigate, Link } from 'react-router-dom';
import { setToken, setUsername } from '../slices/authSlice.js';
import loginAvatar from '../assets/loginAvatar.jpeg';

const Login = () => {
    const { login } = useContext(AuthContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);

    const addToken = (token) => dispatch(setToken(token));
    const addUsername = (username) => dispatch(setUsername(username));

    const { t } = useTranslation();

    const handleInputChange = (e) => {
        setErrorMessage('');
        setIsInvalid(false);
        
        formik.handleChange(e);
    };
    
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: async (values) => {
            try {
                const { username, password } = values;
                console.log(values);
                console.log(username, 'username1');
                const response = await axios.post(API_ROUTES.login(), { username, password });
                if (response.data.token) {
                    const token = response.data.token;
                    const username = response.data.username;
                
                    localStorage.setItem('username', username);
                    localStorage.setItem('token', token);
                    addToken(token);
                    addUsername(username);
                    login();
                    setErrorMessage('');
                
                    navigate(ROUTES.home);
                } else {
                    setErrorMessage(t('form.errors.nickname'));
                    setIsInvalid(true);
                }
                
            } catch (error) {
                setErrorMessage(error.response?.data?.message || t('loginPage.error.serverError'));
                setIsInvalid(true);
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
                                <h1 className="text-center mb-4">{t('loginPage.login')}</h1>
                                <Form.Group className="mb-3" controlId="nickname">
                                    <FloatingLabel label={t('loginPage.nickname')}>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            value={formik.values.username}
                                            onChange={handleInputChange}
                                            placeholder={t('loginPage.nickname')}
                                            required
                                            isInvalid={formik.touched.username && isInvalid && errorMessage}
                                        />
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label={t('loginPage.password')}>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            onChange={handleInputChange}
                                            value={formik.values.password}
                                            placeholder={t('loginPage.password')}
                                            required
                                            isInvalid={formik.touched.password && isInvalid && errorMessage}
                                        />
                                        <Form.Control.Feedback type="invalid" tooltip>{ t('form.errors.wrongNicknameorPassword') }</Form.Control.Feedback>
                                    </FloatingLabel>
                                </Form.Group>
                                <Button type="submit" variant="outline-primary" className="w-100 mb-3">
                                    {t('loginPage.login')}
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
