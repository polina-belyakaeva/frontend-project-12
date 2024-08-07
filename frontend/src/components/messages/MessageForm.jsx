import React, { useRef, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import FilterContext from '../../context/filterContext';
import { useAddMessageMutation } from '../../api/messagesApi';
import 'react-toastify/dist/ReactToastify.css';

const MessageForm = () => {
  const { t } = useTranslation();
  const filter = useContext(FilterContext);
  const { username } = useSelector((state) => state.auth);
  const { currentChannel } = useSelector((state) => state.ui);
  const modalIsActive = useSelector((state) => state.modal.modalIsActive);
  const channelId = currentChannel.id;
  const [addMessage] = useAddMessageMutation();
  const inputRef = useRef(null);

  useEffect(() => {
    if (modalIsActive === false) {
      inputRef.current?.focus();
    }
  }, [channelId, modalIsActive]);

  const handleFormSubmit = async (values, { resetForm }) => {
    const { message } = values;
    const cleanMessage = filter.clean(message);
    const newMessage = { body: cleanMessage, channelId, username };
    try {
      const response = await addMessage(newMessage);
      if (response.error?.status === 'FETCH_ERROR') {
        toast.error(t('notification.networkErrorToast'));
      } else {
        resetForm();
        inputRef.current?.focus();
      }
    } catch (error) {
      toast.error(t('notification.networkErrorToast'));
      console.error('Sending message error: ', error);
    }
  };

  return (
    <div className="mt-auto px-5 py-3">
      <Formik
        initialValues={{ message: '', channelId, username }}
        onSubmit={handleFormSubmit}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          isSubmitting,
        }) => (
          <Form
            noValidate
            className="py-1 border rounded-2"
            onSubmit={handleSubmit}
          >
            <InputGroup hasValidation>
              <Form.Label className="visually-hidden" htmlFor="newMessage">
                {t('messages.newMessage')}
              </Form.Label>
              <Form.Control
                type="text"
                name="message"
                id="newMessage"
                ref={inputRef}
                placeholder={t('chat.typeMessage')}
                aria-label={t('messages.newMessage')}
                className="border-0 p-0 ps-2 form-control"
                required
                onChange={handleChange}
                value={values.message}
              />
              <Button
                type="submit"
                variant="outline"
                className="btn btn-group-vertical"
                disabled={!values.message.trim() || isSubmitting}
                aria-label={t('messages.sendMessage')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
                  />
                </svg>
              </Button>
            </InputGroup>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MessageForm;
