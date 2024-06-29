import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { Button, Modal, Form } from 'react-bootstrap';
import { useAddChannelMutation, useRemoveChannelMutation, useEditChannelMutation } from '../../api/channelsApi';
import { useRemoveMessageMutation } from '../../api/messagesApi';
import { useGetChannelsQuery } from '../../api/channelsApi';
import { defaultChannel } from '../../slices/uiSlice';
import { useFormik } from 'formik';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import filter from 'leo-profanity';

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
            const cleanName = filter.clean(newChannelName)
            const body = { name: cleanName };
            const { data: { id, name } } = await addChannel(body);
            
            toast.success(t("notification.channelIsCreated"));

            formik.resetForm();
            addCurrentChannel({ id, name });
        } catch (error) {
            toast.error(t("notification.networkErrorToast"));
            console.log('Adding channel error: ', error);
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
                    aria-label={t('channels.modal.modalClose')}
                />
            </Modal.Header>
            <Modal.Body className="mb-0 pb-0">
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group className="mb-2">
                    <Form.Label className="visually-hidden" htmlFor="channelName">{t("channels.modal.channelName")}</Form.Label>
                        <Form.Control
                            type="text"
                            name='newChannelName'
                            id='channelName'
                            aria-label={t("channels.modal.channelName")}
                            placeholder=""
                            autoFocus
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={(formik.errors.newChannelName && formik.touched.newChannelName) || !!formik.status}
                            value={formik.values.newChannelName}
                            disabled={formik.isSubmitting}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.newChannelName}
                        </Form.Control.Feedback>
                        <Modal.Footer className='border-0 d-flex justify-content-end'>
                            <Button
                                className='me-2'
                                variant="secondary"
                                onClick={handleClose}
                                aria-label={t("channels.modal.modalCancel")}
                                >
                                {t('channels.modal.modalCancel')}
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={formik.isSubmitting}
                                aria-label={t('channels.modal.modalSend')}
                                >
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
    const [removeChannel,  { isLoading: isRemovingChannel }] = useRemoveChannelMutation();

    const [removeMessage, { isLoading: isRemovingMessage }] = useRemoveMessageMutation();

    const handleRemoveChannel = async (modalChannelId) => {
       try {
        setType('');

        const reponseChannel = await removeChannel(modalChannelId);
        const reponseMessage = await removeMessage(modalChannelId);

        if (reponseChannel.error?.status === 'FETCH_ERROR' || reponseMessage.error?.status === 'FETCH_ERROR') {
            toast.error(t("notification.networkErrorToast"));
        } else {
            addCurrentChannel(defaultChannel);
            toast.success(t("notification.channelIsDeleted"));
        }
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
                    aria-label={t('channels.modal.modalClose')}
                />
            </Modal.Header>
            <Modal.Body className="mb-0 pb-0">
                <p className="lead">{t('channels.modal.sure')}</p>
                <Modal.Footer className='border-0 d-flex justify-content-end'>
                    <Button
                        className='me-2'
                        variant="secondary"
                        onClick={handleClose}
                        aria-label={t('channels.modal.modalCancel')}
                    >
                        {t('channels.modal.modalCancel')}
                    </Button>
                    <Button
                        variant="danger"
                        type="submit"
                        onClick={() => handleRemoveChannel(modalChannelId)}
                        disabled={isRemovingChannel || isRemovingMessage}
                        aria-label={t('channels.modal.deleteChannel')}
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
    t,
}) => {
    const [editChannel, { isLoading }] = useEditChannelMutation();

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
            const cleanName = filter.clean(newChannelName);
            const body = { id: modalChannelId, name: cleanName };
            const response = await editChannel(body);
            
            if (response.error?.status === 'FETCH_ERROR') {
                toast.error(t("notification.networkErrorToast"));
            } else {
                toast.success(t("notification.channelIsRenamed"));
                formik.resetForm();
            }
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
                    aria-label={t('channels.modal.modalClose')}
                />
            </Modal.Header>
            <Modal.Body className="mb-0 pb-0">
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group className="mb-2">
                        <Form.Label className="visually-hidden" htmlFor="newMessage">{t('channels.modal.channelManagment')}</Form.Label>
                        <Form.Control
                            type="text"
                            name='newChannelName'
                            id='newMessage'
                            aria-label={t('channels.modal.channelManagment')}
                            ref={inputRef}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={(formik.errors.newChannelName && formik.touched.newChannelName) || !!formik.status}
                            value={formik.values.newChannelName}
                            disabled={formik.isSubmitting}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.newChannelName}
                        </Form.Control.Feedback>
                        <Modal.Footer className='border-0 d-flex justify-content-end'>
                            <Button
                                className='me-2'
                                variant="secondary"
                                onClick={handleClose}
                                aria-label={t('channels.modal.modalCancel')}
                                disabled={isLoading}
                                >
                                {t('channels.modal.modalCancel')}
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={formik.isSubmitting}
                                aria-label={t('channels.modal.modalSend')}
                                >
                                {t('channels.modal.modalSend')}
                            </Button>
                        </Modal.Footer>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    )
};
