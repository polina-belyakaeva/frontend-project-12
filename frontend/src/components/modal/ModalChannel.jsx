import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { Button, Modal, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import {
  useAddChannelMutation,
  useRemoveChannelMutation,
  useEditChannelMutation,
  useGetChannelsQuery,
} from '../../api/channelsApi';
import { useRemoveMessageMutation } from '../../api/messagesApi';
import { defaultChannel } from '../../slices/uiSlice';
import 'react-toastify/dist/ReactToastify.css';

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
  modalType, setType, addCurrentChannel, t,
}) => {
  const [addChannel] = useAddChannelMutation();

  const { data: channels = [] } = useGetChannelsQuery(undefined);
  const channelNames = channels?.map(({ name }) => name);
  const validationSchema = getValidationSchema(channelNames, t);

  return (
    <Formik
      initialValues={{ newChannelName: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          const cleanName = filter.clean(values.newChannelName);
          const { data: { id, name } } = await addChannel({ name: cleanName });
          toast.success(t('notification.channelIsCreated'));
          addCurrentChannel({ id, name });
          resetForm();
          setType('');
        } catch (error) {
          toast.error(t('notification.networkErrorToast'));
          console.error('Adding channel error: ', error);
        }
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        isSubmitting,
        resetForm,
      }) => (
        <Modal
          centered
          show={modalType === 'addChannel'}
          onHide={() => {
            resetForm();
            setType('');
          }}
          aria-labelledby="channel-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>{t('channels.modal.modalAddChannel')}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="channelName" className="visually-hidden">{t('channels.modal.channelName')}</Form.Label>
                <Form.Control
                  type="text"
                  name="newChannelName"
                  id="channelName"
                  value={values.newChannelName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.newChannelName && errors.newChannelName}
                  required
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  {errors.newChannelName}
                </Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  resetForm();
                  setType('');
                }}
              >
                {t('channels.modal.modalCancel')}
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {t('channels.modal.modalSend')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </Formik>
  );
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

  const handleRemoveChannel = async (id) => {
    try {
      setType('');

      const reponseChannel = await removeChannel(id);
      const reponseMessage = await removeMessage(id);

      if (
        reponseChannel.error?.status === 'FETCH_ERROR'
        || reponseMessage.error?.status === 'FETCH_ERROR'
      ) {
        toast.error(t('notification.networkErrorToast'));
      } else {
        addCurrentChannel(defaultChannel);
        toast.success(t('notification.channelIsDeleted'));
      }
    } catch (error) {
      console.error('Removing channel error: ', error);
    }
  };

  const handleClose = () => {
    setType('');
  };

  return (
    <Modal
      centered
      id="channelModal"
      tabIndex="-1"
      aria-labelledby="channel-modal"
      show={modalType === 'deleteChannel'}
      onHide={handleClose}
    >
      <Modal.Header>
        <Modal.Title>{t('channels.modal.deleteChannel')}</Modal.Title>
        <Button
          type="button"
          variant="close"
          onClick={handleClose}
          data-bs-dismiss="modal"
          aria-label={t('channels.modal.modalClose')}
        />
      </Modal.Header>
      <Modal.Body className="mb-0 pb-0">
        <p className="lead">{t('channels.modal.sure')}</p>
        <Modal.Footer className="border-0 d-flex justify-content-end">
          <Button
            className="me-2"
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
  );
};

export const RenameChannel = ({
  modalType, modalChannelId, setType, t,
}) => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (modalType === 'editChannel') {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [modalType]);

  const [editChannel, { isLoading }] = useEditChannelMutation();

  const { data: channels = [] } = useGetChannelsQuery(undefined);
  const { modalChannelName } = useSelector((state) => state.ui);
  const channelNames = channels
    .filter(({ name }) => name !== modalChannelName)
    .map(({ name }) => name);
  const validationSchema = getValidationSchema(channelNames, t);

  return (
    <Formik
      initialValues={{ newChannelName: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          setType('');
          const cleanName = filter.clean(values.newChannelName);
          const body = { id: modalChannelId, name: cleanName };
          const response = await editChannel(body);

          if (response.error?.status === 'FETCH_ERROR') {
            toast.error(t('notification.networkErrorToast'));
          } else {
            toast.success(t('notification.channelIsRenamed'));
            resetForm();
          }
        } catch (error) {
          console.error('Rename chanel error: ', error);
        }
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        isSubmitting,
        resetForm,
        status,
      }) => (
        <Modal
          centered
          id="channelModal"
          tabIndex="-1"
          aria-labelledby="channel-modal"
          show={modalType === 'editChannel'}
          onHide={() => {
            setType('');
            resetForm();
          }}
        >
          <Modal.Header>
            <Modal.Title>{t('channels.modal.editChannel')}</Modal.Title>
            <Button
              type="button"
              variant="close"
              onClick={() => {
                setType('');
                resetForm();
              }}
              data-bs-dismiss="modal"
              aria-label={t('channels.modal.modalClose')}
            />
          </Modal.Header>
          <Modal.Body className="mb-0 pb-0">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label className="visually-hidden" htmlFor="newName">
                  {t('channels.modal.channelName')}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="newChannelName"
                  id="newName"
                  aria-label={t('channels.modal.channelName')}
                  ref={inputRef}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={
                    (errors.newChannelName
                      && touched.newChannelName)
                    || !!status
                  }
                  value={values.newChannelName}
                  disabled={isSubmitting}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.newChannelName}
                </Form.Control.Feedback>
                <Modal.Footer className="border-0 d-flex justify-content-end">
                  <Button
                    className="me-2"
                    variant="secondary"
                    onClick={() => {
                      setType('');
                      resetForm();
                    }}
                    aria-label={t('channels.modal.modalCancel')}
                    disabled={isLoading}
                  >
                    {t('channels.modal.modalCancel')}
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    aria-label={t('channels.modal.modalSend')}
                  >
                    {t('channels.modal.modalSend')}
                  </Button>
                </Modal.Footer>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Formik>
  );
};
