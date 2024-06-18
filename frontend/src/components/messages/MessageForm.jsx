import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { API_ROUTES } from '../../utils/routes.js';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';

const MessageForm = () => {
    const { t } = useTranslation();
    const { token, username } = useSelector((state) => state.auth);
    const { currentChannel } = useSelector((state) => state.ui);
    const channelId = currentChannel.id;

    const handleSubmit = async (values) => {
        const newMessage = { body: values.message, channelId, username: values.username };
        try {
            await axios.post(API_ROUTES.messages(), newMessage, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }).then(() => {
                formik.resetForm();
            });
        } catch (error) {
            if (error.message === 'Network Error') {
                console.log(t('form.errors.network'));
            } else {
                console.log('Sending message error: ', error.message);
            }
        }
    };

    const formik = useFormik({
        initialValues: {
            message: '',
            channelId, 
            username,
        },
        onSubmit: values => {
            handleSubmit(values);
        },
    });

    return (
        <div className='mt-auto px-5 py-3'>
        <Form noValidate className='py-1 border rounded-2' onSubmit={formik.handleSubmit}>
            <InputGroup hasValidation>
                <Form.Control
                name="message"
                placeholder={t('chat.typeMessage')}
                aria-label = "Новое сообщение"
                className='border-0 p-0 ps-2 form-control'
                required
                onChange={formik.handleChange}
                value={formik.values.message}
                />
                <Button type="submit" variant="outline" className='btn btn-group-vertical' disabled={!formik.values.message}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path>
                </svg>
                <span className='visually-hidden'>Отправить</span>
                </Button>
            </InputGroup>
        </Form>
    </div>
    )
};

export default MessageForm;