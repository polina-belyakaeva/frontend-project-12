import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  useRemoveChannelMutation,
} from '../../api/channelsApi';
import { useRemoveMessageMutation } from '../../api/messagesApi';
import { defaultChannel } from '../../slices/uiSlice';
import 'react-toastify/dist/ReactToastify.css';
import SocketContext from '../../context/socketContext';

const RemoveChannel = ({
  modalType,
  modalChannelId,
  setActiveModal,
  setType,
  setScroll,
  addCurrentChannel,
  t,
}) => {
  const socket = useContext(SocketContext);
  const [removeChannel, { isLoading: isRemovingChannel }] = useRemoveChannelMutation();
  const [removeMessage, { isLoading: isRemovingMessage }] = useRemoveMessageMutation();
  const { currentChannel } = useSelector((state) => state.ui);

  const handleRemoveChannel = async (id) => {
    try {
      setType('');
      const responseMessages = await removeMessage(id);
      if (responseMessages.error?.status === 'FETCH_ERROR') {
        toast.error(t('notification.networkErrorToast'));
        return;
      }

      const responseChannel = await removeChannel(id);
      setScroll({ type: '' });
      if (responseChannel.error?.status === 'FETCH_ERROR') {
        toast.error(t('notification.networkErrorToast'));
      } else {
        if (currentChannel.id === id) {
          addCurrentChannel((defaultChannel));
          setScroll({ type: 'top' });
        }
        toast.success(t('notification.channelIsDeleted'));

        socket.emit('removeChannel', { id });
      }
      setActiveModal({ isActive: false });
    } catch (error) {
      console.error('Removing channel error: ', error);
    }
  };

  const handleClose = () => {
    setType('');
    setActiveModal({ isActive: false });
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

export default RemoveChannel;
