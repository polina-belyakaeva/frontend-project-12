import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { setCurrentChannel, setScrollType } from '../../slices/uiSlice';
import { setModalType, setModalActive } from '../../slices/modalSlice';
import AddNewChannel from './AddNewChannel';
import RemoveChannel from './RemoveChannel';
import RenameChannel from './RenameChannel';

const modals = {
  addChannel: AddNewChannel,
  deleteChannel: RemoveChannel,
  editChannel: RenameChannel,
};

// prettier-ignore
const getValidationSchema = (channelNames, t) => yup.object({
  newChannelName: yup
    .string()
    .trim()
    .required(t('form.errors.required'))
    .min(3, t('form.errors.min'))
    .max(20, t('form.errors.max'))
    .notOneOf(channelNames, t('form.errors.unique')),
});

const NewModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const addCurrentChannel = ({ id, name }) => dispatch(setCurrentChannel({ id, name }));
  const setScroll = (type) => dispatch(setScrollType(type));
  const setType = (type) => dispatch(setModalType(type));
  const setActiveModal = (isActive) => dispatch(setModalActive(isActive));
  const { scrollType } = useSelector((state) => state.ui);
  const { modalType, modalChannelId } = useSelector((state) => state.modal);
  const Modal = modals[modalType];

  return modalType ? (
    <Modal
      modalType={modalType}
      modalChannelId={modalChannelId}
      setActiveModal={setActiveModal}
      setType={setType}
      setScroll={setScroll}
      scrollType={scrollType}
      getValidationSchema={getValidationSchema}
      addCurrentChannel={addCurrentChannel}
      dispatch={dispatch}
      t={t}
    />
  ) : null;
};

export default NewModal;
