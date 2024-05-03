import React from 'react';
import { Container, FloatingLabel, Row, Col, Card, Image, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import loginAvatar from '../assets/loginAvatar.jpeg';

const Login = () => {
  return (
    <Container fluid className='h-100'>
        <Row className="h-100 justify-content-center align-content-center">
            <Col xs="12" md="8" xxl="6" className="align-items-center">
                <Card className="shadow-sm">
                    <Card.Body className="row p-5" >
                        <Col xs="12" md="6" className="d-flex align-items-center justify-content-center">
                            <Image src={loginAvatar} alt="Тота на вершине горы" className="rounded-circle" />
                        </Col>
                            <Formik
                                initialValues={{
                                    nickname: '',
                                    password: '',
                                }}
                                onSubmit={(values) => {
                                    console.log(values, 'submit');
                                }}
                            >
                                {({ errors, touches }) => (
                                    <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                                        <h1 className="text-center mb-4">Войти</h1>
                                        <Form.Group className="mb-3 align-self-center">
                                            <FloatingLabel
                                            controlId="floatingInput"
                                            label="Ваш ник">
                                              <Form.Control type="text" name="nickname" placeholder="Ваш ник"></Form.Control>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <Form.Group className="mb-3 align-self-center">
                                        <FloatingLabel
                                            controlId="floatingInput"
                                            label="Пароль">
                                            <Form.Control type="text" name="password" placeholder="Пароль"></Form.Control>
                                        </FloatingLabel>
                                        </Form.Group>
                                        <Button type="submit" variant="outline-primary" className="w-100 mb-3">Войти</Button>
                                    </Form>
                                )}
                        </Formik>
                    </Card.Body>
                    <Card.Footer className='p-4'>
                        <div className='text-center'>
                            <span>Нет аккаунта? </span>
                            <a href="#">Регистрация</a>
                        </div>
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
    </Container>
  );
};

export default Login;
