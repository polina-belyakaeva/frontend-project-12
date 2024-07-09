import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import {
  useAddChannelMutation,
  useGetChannelsQuery,
} from '../../api/channelsApi';
import 'react-toastify/dist/ReactToastify.css';

const AddNewChannel = ({
  modalType,
  setType,
  setScroll,
  setActiveModal,
  addCurrentChannel,
  t,
  getValidationSchema,
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
          setScroll({ type: 'bottom' });

          setActiveModal({ isActive: false });
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
            setActiveModal({ isActive: false });
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
                  setActiveModal({ isActive: false });
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

export default AddNewChannel;
