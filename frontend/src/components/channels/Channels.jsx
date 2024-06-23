import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Col, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { setCurrentChannel, setModalChannel, setModalType } from '../../slices/uiSlice.js';
import { useGetChannelsQuery, channelsApi } from '../../api/channelsApi';
import NewModal from '../modal/index';
import 'react-toastify/dist/ReactToastify.css';
import { socket } from '../../socket';

const Channels = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const addCurrentChat = (channel) => dispatch(setCurrentChannel(channel));
    const setChannelModal = (channel) => dispatch(setModalChannel(channel));
    const setType = (type) => dispatch(setModalType(type));

    const { currentChannel } = useSelector((state) => state.ui);
    const { data: channels } = useGetChannelsQuery();

    useEffect(() => {
        const handleChannels = (newChannel) => {
            dispatch(
                channelsApi.util.updateQueryData(
                  'getChannels',
                  undefined,
                  (draftChannels) => { draftChannels.push(newChannel); },
                  
                ),
            );
        };
        const handleDeleteChannel = ({ id }) => {
            dispatch(
                channelsApi.util.updateQueryData(
                  'getChannels',
                  undefined,
                  (draftChannels) => draftChannels.filter((channel) => channel.id !== id),
                ),
              );
        }
        const handleRenameChannel = ({ id, name }) => {
            dispatch(
                channelsApi.util.updateQueryData(
                  'getChannels',
                  undefined,
                  (draftChannels) => {
                    const channelIndex = draftChannels.findIndex((channel) => channel.id === id);
                    draftChannels[channelIndex].name = name;
                  }
                ),
              );
        }
        socket.connect();
        socket.on('newChannel', handleChannels);
        socket.on('removeChannel', handleDeleteChannel);
        socket.on('renameChannel', handleRenameChannel);
          
        return () => {
            socket.off('newChannel');
            socket.off('removeChannel');
            socket.off('renameChannel');
        }
    }, [dispatch]);
    
    const handleCurrentChat = (channel) => {
        addCurrentChat(channel);
    };

    const { modalType } = useSelector((state) => state.ui);
    const setModalClick = (channel, type) => {
        const {id, name} = channel;
        const newModal = {id, name};
        const payload = {type};
        setChannelModal(newModal);
        setType(payload);
    };

    const addModalType = (type) => {
        const payload = {type};
        setType(payload);
    }
    
    return (
        <Col className='col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex'>
            <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
                <b>{t('channels.channels')}</b>
                <Button type='button' variant="outline" className='p-0 text-primary btn btn-group-vertical' data-bs-toggle="modal" data-bs-target="#channelModal" onClick={() => addModalType('addChannel')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                    </svg>
                    <span className='visually-hidden'>{t('channels.addChannel')}</span>
                </Button>
            </div>
            <Navbar id="channels-box" className='flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block'>
                {channels?.map((channel) => (
                    <Nav.Item key={channel.id} className='w-100'>
                        {channel.removable ? (
                            <Dropdown as={ButtonGroup} className='w-100 d-flex'>
                                <Button 
                                    className={`w-100 rounded-0 text-start text-truncate btn ${currentChannel.id === channel.id ? 'btn-secondary' : 'btn-light'}`}
                                    onClick={() => handleCurrentChat(channel)}
                                    name={channel.name}>
                                    <span># </span>
                                    {channel.name}
                                </Button>
                                <Dropdown.Toggle split className={`flex-grow-0 ${currentChannel.id === channel.id ? 'btn-secondary' : 'btn-light'}`}>
                                    <span className="visually-hidden">{t('channels.menu')}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setModalClick(channel, 'deleteChannel')}>{t('channels.delete')}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setModalClick(channel, 'editChannel')}>{t('channels.edit')}</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Button 
                                type="button"
                                className={`w-100 rounded-0 text-start text-truncate btn ${currentChannel.id === channel.id ? 'btn-secondary' : 'btn-light'}`}
                                onClick={() => handleCurrentChat(channel)}
                                name={channel.name}
                                >
                                <span># </span>
                                {channel.name}
                            </Button>
                        )}
                    </Nav.Item>
                ))}
            </Navbar>
            <NewModal type={modalType} />
        </Col>
    )
};

export default Channels;