import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { Button, Modal, Form } from 'react-bootstrap';
import { useAddChannelMutation, useRemoveChannelMutation, useEditChannelMutation } from '../../api/channelsApi';
import { useRemoveMessageMutation } from '../../api/messagesApi';
import { useGetChannelsQuery } from '../../api/channelsApi';
import { useFormik } from 'formik';

const getValidationSchema = (channelNames, t) => yup.object({
    newChannelName: yup
        .string()
        .trim()
        .required(t('form.errors.required'))
        .min(3, t('form.errors.min'))
        .max(20, t('form.errors.max'))
        .notOneOf(channelNames, t('form.errors.unique')),
});

export const AddNewChannel = ({
    modalType,
    setType,
    addCurrentChannel,
    t,
}) => {

    const [addChannel] = useAddChannelMutation();

    const { data: channels = [] } = useGetChannelsQuery(undefined);
    const channelNames = channels?.map(({ name }) => name);

    const addNewChannel = async (newChannelName) => {
        try {
            setType('');
            const body = { name: newChannelName };
            const { data: { id, name } } = await addChannel(body);
            formik.resetForm();
            addCurrentChannel({ id, name });
        } catch (error) {
            console.log('Adding new channel error: ', error);
        }
    };

    const formik = useFormik({
        initialValues: {
            newChannelName: '',
        },
        validationSchema: getValidationSchema(channelNames, t),
        onSubmit: ({ newChannelName }) => {
            addNewChannel(newChannelName);
        }
    });

    const handleClose = () => {
        setType('');
        formik.resetForm();
    };

    return (
        <Modal centered id="channelModal" tabIndex="-1" aria-labelledby="channel-modal" show={modalType === 'addChannel'} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>
                    {t('channels.modal.modalAddChannel')}
                </Modal.Title>
                <Button
                    type='button'
                    variant='close'
                    onClick={handleClose}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
            </Modal.Header>
            <Modal.Body className="mb-0 pb-0">
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group className="mb-2" controlId="form.ControlInput">
                        <Form.Control
                            type="text"
                            name='newChannelName'
                            placeholder=""
                            autoFocus
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={(formik.errors.newChannelName && formik.touched.newChannelName) || !!formik.status}
                            value={formik.values.newChannelName}
                            disabled={formik.isSubmitting}
                        />
                        <label className="visually-hidden" htmlFor="newChannelName">{t('channels.modal.modalAddChannel')}</label>
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.newChannelName}
                        </Form.Control.Feedback>
                        <Modal.Footer className='border-0 d-flex justify-content-end'>
                            <Button
                                className='me-2'
                                variant="secondary"
                                onClick={handleClose}>
                                {t('channels.modal.modalCancel')}
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={formik.isSubmitting}>
                                {t('channels.modal.modalSend')}
                            </Button>
                        </Modal.Footer>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    )
};

export const RemoveChannel = ({
    modalType,
    modalChannelId,
    setType,
    addCurrentChannel,
    t,
}) => {
    const [removeChannel, { isLoading: isRemovingChannel }] = useRemoveChannelMutation();

    const [removeMessage, { isLoading: isRemovingMessage }] = useRemoveMessageMutation();

    const handleRemoveChannel = async (modalChannelId) => {
       try {
        setType('');
        addCurrentChannel({ id: "1" });
        await removeChannel(modalChannelId);
        await removeMessage(modalChannelId);
       } catch (error) {
        console.log('Removing channel error: ', error);
    }
    };


    const handleClose = () => {
        setType('');
    };

    return (
        <Modal centered id="channelModal" tabIndex="-1" aria-labelledby="channel-modal" show={modalType === 'deleteChannel'} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>
                    {t('channels.modal.deleteChannel')}
                </Modal.Title>
                <Button
                    type='button'
                    variant='close'
                    onClick={handleClose}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
            </Modal.Header>
            <Modal.Body className="mb-0 pb-0">
                <p className="lead">{t('channels.modal.sure')}</p>
                <Modal.Footer className='border-0 d-flex justify-content-end'>
                    <Button
                        className='me-2'
                        variant="secondary"
                        onClick={handleClose}
                    >
                        {t('channels.modal.modalCancel')}
                    </Button>
                    <Button
                        variant="danger"
                        type="submit"
                        onClick={() => handleRemoveChannel(modalChannelId)}
                        disabled={isRemovingChannel || isRemovingMessage}
                    >
                        {t('channels.modal.deleteChannel')}
                    </Button>
                </Modal.Footer>
            </Modal.Body>
        </Modal>
    )
};

export const RenameChannel = ({
    modalType,
    modalChannelId,
    setType,
    addCurrentChannel,
    t,
}) => {
    const [editChannel] = useEditChannelMutation();

    const { data: channels = [] } = useGetChannelsQuery(undefined);
    const { modalChannelName } = useSelector((state) => state.ui);
    const channelNames = channels
    .filter(({ name }) => name !== modalChannelName)
    .map(({ name }) => name);
    
    const inputRef = useRef(null);

    useEffect(() => {
        if (modalType === 'editChannel') {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [modalType]);

    const renameChannel = async (newChannelName) => {
        try {
            setType('');
            const body = { id: modalChannelId, name: newChannelName };
            const { data: { id, name } } = await editChannel(body);
            formik.resetForm();
            addCurrentChannel({ id, name });
        } catch (error) {
            console.log('Rename chanel error: ', error);
        }
    };

    const formik = useFormik({
        initialValues: {
            newChannelName: modalChannelName,
        },
        validationSchema: getValidationSchema(channelNames, t),
        onSubmit: ({ newChannelName }) => {
            renameChannel(newChannelName);
        }
    });

    const handleClose = () => {
        setType('');
        formik.resetForm();
    };

    return (
        <Modal centered id="channelModal" tabIndex="-1" aria-labelledby="channel-modal" show={modalType === 'editChannel'} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>
                    {t('channels.modal.editChannel')}
                </Modal.Title>
                <Button
                    type='button'
                    variant='close'
                    onClick={handleClose}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
            </Modal.Header>
            <Modal.Body className="mb-0 pb-0">
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group className="mb-2" controlId="form.ControlInput">
                        <Form.Control
                            type="text"
                            name='newChannelName'
                            ref={inputRef}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={(formik.errors.newChannelName && formik.touched.newChannelName) || !!formik.status}
                            value={formik.values.newChannelName}
                            disabled={formik.isSubmitting}
                        />
                        <label className="visually-hidden" htmlFor="newChannelName">{t('channels.modal.modalAddChannel')}</label>
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.newChannelName}
                        </Form.Control.Feedback>
                        <Modal.Footer className='border-0 d-flex justify-content-end'>
                            <Button
                                className='me-2'
                                variant="secondary"
                                onClick={handleClose}>
                                {t('channels.modal.modalCancel')}
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={formik.isSubmitting}>
                                {t('channels.modal.modalSend')}
                            </Button>
                        </Modal.Footer>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    )
};
