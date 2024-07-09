import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import {
  useEditChannelMutation,
  useGetChannelsQuery,
} from '../../api/channelsApi';
import 'react-toastify/dist/ReactToastify.css';

const RenameChannel = ({
  modalType,
  modalChannelId,
  setType,
  setActiveModal,
  t,
  getValidationSchema,
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
  const { modalChannelName } = useSelector((state) => state.modal);
  const channelNames = channels
    .filter(({ name }) => name !== modalChannelName)
    .map(({ name }) => name);
  const validationSchema = getValidationSchema(channelNames, t);

  return (
    <Formik
      initialValues={{ newChannelName: modalChannelName }}
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
            setActiveModal({ isActive: false });
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
            setActiveModal({ isActive: false });
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
                      setActiveModal({ isActive: false });
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

export default RenameChannel;
