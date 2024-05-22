import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { API_ROUTES } from '../../utils/routes.js';
import NewChannel from './NewChannel.jsx';
import { setChannels, setCurrentChannel } from '../../slices/channelsSlice.js';
import axios from 'axios';

const Channels = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const addCurrentChat = (channel) => dispatch(setCurrentChannel(channel));
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const addChannels = (channels) => dispatch(setChannels(channels));
        const getChannels = async () => {
            await axios.get(API_ROUTES.channels(), {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((response) => {
                console.log(response.data, 'response channels');
                addChannels(response.data);
              })
              .catch((e) => {
                console.log('Get channels Error: ', e);
              });
        };
        getChannels();
    }, [token, dispatch]);

    const { channelsList, currentChannel } = useSelector((state) => state.channels);
    console.log(channelsList, 'channels state');

    const handleCurrentChat = (e) => {
        addCurrentChat(e);
    };

    return (
    <Col className='col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex'>
        <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
            <b>{t('channels.channels')}</b>
            <NewChannel />
        </div>
        <Navbar id="channels-box" className='flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block'>
        {channelsList.map((channel) => (
            <Nav.Item key={channel.id} className='w-100'>
                <Button type="button" className={`w-100 rounded-0 text-start text-truncate btn ${currentChannel.id === channel.id ? 'btn-secondary' : 'btn-light'}`} onClick={() => handleCurrentChat(channel)}>
                    <span># </span>
                    {channel.name}
                </Button>
            </Nav.Item>
        ))}
        </Navbar>
    </Col>
    )
};

export default Channels;