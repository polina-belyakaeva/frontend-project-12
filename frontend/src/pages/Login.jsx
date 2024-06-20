import React, { useRef, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Container, FloatingLabel, Row, Col, Card, Image, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { AuthContext } from '../context/authContext.js';
import { useLoginUserMutation } from '../api/userApi';
import { Link } from 'react-router-dom';
import { setToken, setUsername } from '../slices/authSlice.js';
import loginAvatar from '../assets/loginAvatar.jpeg';

const Login = () => {
    const { login } = useContext(AuthContext);
    const dispatch = useDispatch();
    const [loginUser] = useLoginUserMutation();
    const inputRef = useRef(null);

    const addToken = (token) => dispatch(setToken(token));
    const addUsername = (username) => dispatch(setUsername(username));

    const { t } = useTranslation();

    const handleSubmit = async ({ username, password }, { setSubmitting, setErrors, setFieldTouched }) => {
        try { 
            const response = await loginUser({ username, password });

            if (response.error?.status === 401) {
                console.log('401');
                setErrors({ 
                    username: t('form.errors.wrongNicknameorPassword'),
                    password: t('form.errors.wrongNicknameorPassword')
                });
                setFieldTouched('username', true, false);
                setFieldTouched('password', true, false);
                inputRef.current?.focus();
                inputRef.current?.select();
            } else if (response.data?.token) {
                const token = response.data.token;
                const username = response.data.username;
            
                localStorage.setItem('username', username);
                localStorage.setItem('token', token);
                addToken(token);
                addUsername(username);
                login();
                setErrors('');
            }} catch (error) {
                console.log(error, 'error auth');
            if (!error.isAxiosError) {
                console.log(t('form.errors.unknown'));
                return;
            } else {
                console.log(t('form.errors.network'));
            }
            } finally {
            setSubmitting(false);
        }
    }

    return (
        <Container fluid className='h-100'>
            <Row className="h-100 justify-content-center align-content-center">
                <Col xs="12" md="8" xxl="6" className="align-items-center">
                    <Card className="shadow-sm">
                        <Card.Body className="row p-5" >
                            <Col xs="12" md="6" className="d-flex align-items-center justify-content-center">
                                <Image src={loginAvatar} alt={t('loginPage.imgAlt')} className="rounded-circle" />
                            </Col>
                            <Formik
                            initialValues={{ username: '', password: '', }}
                            onSubmit={handleSubmit}
                            >
                                {({ handleSubmit, handleChange, values, touched, isSubmitting, errors }) => (
                                    <Form 
                                    className="col-12 col-md-6 mt-3 mt-md-0" 
                                    onSubmit={handleSubmit}
                                    >
                                    <h1 className="text-center mb-4">{t('loginPage.login')}</h1>
                                    <Form.Group className="mb-3" controlId="username">
                                        <FloatingLabel label={t('loginPage.nickname')}>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                ref={inputRef}
                                                value={values.username}
                                                onChange={handleChange}
                                                placeholder={t('loginPage.nickname')}
                                                required
                                                autoFocus={true}
                                                isInvalid={touched.username && errors.username}
                                            />
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="password">
                                        <FloatingLabel label={t('loginPage.password')}>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                onChange={handleChange}
                                                value={values.password}
                                                placeholder={t('loginPage.password')}
                                                required
                                                isInvalid={touched.password && errors.password}
                                            />
                                            <Form.Control.Feedback type="invalid" tooltip>{errors.password}</Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Button 
                                        type="submit"
                                        variant="outline-primary"
                                        className="w-100 mb-3"
                                        disabled={isSubmitting}
                                    >
                                        {t('loginPage.login')}
                                    </Button>
                                </Form>
                                )}
                            </Formik>
                        </Card.Body>
                        <Card.Footer className='p-4'>
                            <Card.Text className='d-flex justify-content-center align-content-center'>
                                {t('loginPage.footer.isAccountExist')}&nbsp;
                                <Link to="/signup">{t('loginPage.footer.signup')}</Link>
                            </Card.Text>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
