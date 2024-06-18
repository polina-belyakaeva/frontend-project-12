import React from 'react';
import { useDispatch } from 'react-redux';
import { Container, FloatingLabel, Row, Col, Card, Image, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { useCreateNewUserMutation } from '../api/userApi';
import { ROUTES } from '../utils/routes';
import { useNavigate } from 'react-router-dom';
import { setToken, setUsername } from '../slices/authSlice.js';
import signupAvatar from '../assets/signupAvatar.jpg';

const Signup = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [createNewUser] = useCreateNewUserMutation();

    const addToken = (token) => dispatch(setToken(token));
    const addUsername = (username) => dispatch(setUsername(username));

    const signupSchema = yup.object().shape({
        username: yup
        .string()
        .trim()
        .required(t('form.errors.required'))
        .min(3, t('form.errors.min'))
        .max(20, t('form.errors.max')),
        password: yup
        .string()
        .min(6, t('form.errors.minPassword'))
        .required(t('form.errors.required')),
        passwordConfirm: yup
        .string()
        .oneOf([yup.ref('password'), null], t('form.errors.samePasswords'))
        .required(t('form.errors.required')),
    });

    const handleSubmit = async ({ username, password }, { setSubmitting, setErrors, setFieldTouched }) => {
        try {
            const response = await createNewUser({ username, password })
            if (response.error?.status === 409) {
                setErrors({ username: t('form.errors.usernameTaken') });
                setFieldTouched('username', true, false);
            } else if (response.data?.token) {
                const token = response.data.token;
                const username = response.data.username;

                localStorage.setItem('username', username);
                localStorage.setItem('token', token);
                addToken(token);
                addUsername(username);

                navigate(ROUTES.home);
            } else {
                console.log('Signup error');
            }
        } catch (error) {
            console.log('Error in catch:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container fluid className='h-100'>
            <Row className="h-100 d-flex justify-content-center align-content-center">
                <Col xs="12" md="8" xxl="6" >
                    <Card className="shadow-sm">
                        <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                            <Col xs="12" md="6" className="d-flex align-items-center justify-content-center">
                                <Image src={signupAvatar} alt={t('signupPage.imgAlt')} className="rounded-circle" />
                            </Col>
                            <Formik
                                initialValues={{ username: '', password: '', passwordConfirm: ''}}
                                onSubmit={handleSubmit}
                                validationSchema={signupSchema}
                            >
                             {({ handleSubmit, handleChange, values, touched, isSubmitting, errors }) => (
                                <Form
                                className='w-50'
                                onSubmit={handleSubmit}
                            >
                                 <h1 className="text-center mb-4">{t('signupPage.signupTitle')}</h1>
                                 <Form.Group className="mb-3" controlId="username">
                                    <FloatingLabel label={t('signupPage.username')}>
                                        <Form.Control
                                                type="text"
                                                name="username"
                                                value={values.username}
                                                onChange={handleChange}
                                                placeholder={t('signupPage.username')}
                                                autoComplete="off"
                                                required
                                                autoFocus
                                                isInvalid={touched.username && errors.username}
                                            />
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.username}</Form.Control.Feedback>
                                    </FloatingLabel>
                                 </Form.Group>
                                 <Form.Group className="mb-4" controlId="password">
                                    <FloatingLabel label={t('signupPage.password')}>
                                        <Form.Control
                                                type="password"
                                                name="password"
                                                onChange={handleChange}
                                                value={values.password}
                                                placeholder={t('signupPage.password')}
                                                autoComplete="off"
                                                required
                                                isInvalid={touched.password && errors.password}
                                            />
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.password}</Form.Control.Feedback>
                                    </FloatingLabel>
                                 </Form.Group>
                                 <Form.Group className="mb-4" controlId="passwordConfirm">
                                    <FloatingLabel label={t('signupPage.confirmPassword')}>
                                        <Form.Control
                                                type="password"
                                                name="passwordConfirm"
                                                onChange={handleChange}
                                                value={values.passwordConfirm}
                                                placeholder={t('signupPage.passwordConfirm')}
                                                autoComplete="off"
                                                required
                                                isInvalid={touched.passwordConfirm && errors.passwordConfirm}
                                            />
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.passwordConfirm}</Form.Control.Feedback>
                                    </FloatingLabel>
                                 </Form.Group>
                                 <Button 
                                    type="submit"
                                    variant="outline-primary"
                                    className="w-100 mb-3"
                                    disabled={isSubmitting}
                                    >
                                    {t('signupPage.signup')}
                                </Button>
                            </Form>)}
                            </Formik>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
};

export default Signup;