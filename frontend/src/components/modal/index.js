import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setModalType, setCurrentChannel } from '../../slices/uiSlice';
import { AddNewChannel, RemoveChannel, RenameChannel } from './ModalChannel';

const modals = {
  addChannel: AddNewChannel,
  deleteChannel: RemoveChannel,
  editChannel: RenameChannel,
};

const NewModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const addCurrentChannel = ({ id, name }) => dispatch(setCurrentChannel({ id, name }));
  const setType = (type) => dispatch(setModalType(type));
  const { modalType, modalChannelId } = useSelector((state) => state.ui);
  const Modal = modals[modalType];

  return modalType ? (
    <Modal
      modalType={modalType}
      modalChannelId={modalChannelId}
      setType={setType}
      addCurrentChannel={addCurrentChannel}
      dispatch={dispatch}
      t={t}
    />
  ) : null;
};

export default NewModal;
