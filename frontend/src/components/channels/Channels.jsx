import React, { useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Col,
  Nav,
  Dropdown,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  setCurrentChannel,
  setScrollType,
} from '../../slices/uiSlice';
import {
  setModalChannel,
  setModalType,
  setModalActive,
} from '../../slices/modalSlice';
import { useGetChannelsQuery } from '../../api/channelsApi';
import NewModal from '../modal/index';
import 'react-toastify/dist/ReactToastify.css';

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const addCurrentChat = (channel) => dispatch(setCurrentChannel(channel));
  const setChannelModal = (channel) => dispatch(setModalChannel(channel));
  const setType = (type) => dispatch(setModalType(type));
  const setActiveModal = (isActive) => dispatch(setModalActive(isActive));
  const setScroll = useCallback((type) => dispatch(setScrollType(type)), [dispatch]);

  const { currentChannel, scrollType } = useSelector((state) => state.ui);
  const { data: channels } = useGetChannelsQuery();
  const handleCurrentChat = (channel) => {
    addCurrentChat(channel);
  };

  const scrollTopRef = useRef(null);
  const scrollBottomRef = useRef(null);

  useEffect(() => {
    setScroll({ type: '' });
    if (scrollType === 'bottom') {
      setTimeout(() => {
        scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (scrollType === 'top') {
      scrollTopRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [scrollType, scrollBottomRef, scrollTopRef, setScroll]);

  const { modalType } = useSelector((state) => state.modal);
  const setModalClick = (channel, type) => {
    const { id, name } = channel;
    const newModal = { id, name };
    const payload = { type };
    setChannelModal(newModal);
    setType(payload);
    setActiveModal({ isActive: true });
  };

  const addModalType = (type) => {
    const payload = { type };
    setType(payload);
    setActiveModal({ isActive: true });
  };

  return (
    <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('channels.channels')}</b>
        <Button
          type="button"
          variant="outline"
          className="p-0 text-primary btn btn-group-vertical"
          data-bs-toggle="modal"
          data-bs-target="#channelModal"
          onClick={() => addModalType('addChannel')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
          <span className="visually-hidden">{t('channels.addChannel')}</span>
        </Button>
      </div>
      <Nav
        id="channels-box"
        className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
        ref={scrollTopRef}
      >
        {channels?.map((channel) => (
          <Nav.Item key={channel.id} className="w-100">
            {channel.removable ? (
              <Dropdown
                as={ButtonGroup}
                className="w-100 d-flex"
              >
                <Button
                  className="w-100 rounded-0 text-start text-truncate"
                  variant={`${
                    currentChannel.id === channel.id ? 'secondary' : 'btn-light'
                  }`}
                  onClick={() => handleCurrentChat(channel)}
                  type="button"
                  role="button"
                  aria-label={channel.name}
                >
                  <span># </span>
                  {channel.name}
                </Button>
                <Dropdown.Toggle
                  split
                  className="flex-grow-0"
                  variant={`${
                    currentChannel.id === channel.id ? 'secondary' : 'btn-light'
                  }`}
                >
                  <span className="visually-hidden">
                    {t('channels.modal.channelManagment')}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => setModalClick(channel, 'deleteChannel')}
                  >
                    {t('channels.delete')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setModalClick(channel, 'editChannel')}
                  >
                    {t('channels.edit')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                type="button"
                role="button"
                className={`w-100 rounded-0 text-start text-truncate btn ${
                  currentChannel.id === channel.id
                    ? 'btn-secondary'
                    : 'btn-light'
                }`}
                onClick={() => handleCurrentChat(channel)}
                aria-label={channel.name}
              >
                <span># </span>
                {channel.name}
              </Button>
            )}
          </Nav.Item>
        ))}
        <div ref={scrollBottomRef} />
      </Nav>
      <NewModal
        type={modalType}
      />
    </Col>
  );
};

export default Channels;
