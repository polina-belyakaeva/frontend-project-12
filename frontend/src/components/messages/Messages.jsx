import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { API_ROUTES } from '../../utils/routes.js';
import { setMessages } from '../../slices/messagesSlice.js';
import axios from 'axios';

const Messages = () => {
const { t } = useTranslation();
const dispatch = useDispatch();
const addMessages = (messages) => dispatch(setMessages(messages));
const { token } = useSelector((state) => state.auth);

const getMessages = async () => {
    const url = API_ROUTES.channels();
    console.log(url, 'url');
    await axios.get(API_ROUTES.messages(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data, 'response messages');
        addMessages(response.data);
      })
      .catch((e) => {
        console.log('Get messages Error : ', e);
      });
    };

    useEffect(() => {
        getMessages();
    }, [token]);

    const { messages } = useSelector((state) => state.messages);
    const { currentChannel } = useSelector((state) => state.channels);
    console.log(messages, 'messages state');
    console.log(currentChannel, 'currentChannel');
    const filteredMessages = messages.filter((message) => message.channelId === currentChannel.id);
    console.log(filteredMessages, 'filteredMessages');

    return (
        <div id='messages-box' className="chat-messages overflow-auto px-5 ">
            {filteredMessages.map((message) => (
                <div key={message.id} className="text-break mb-2">
                <b>{ message.username }</b>
                <span>: </span>   
                { message.body }
            </div>
            ))}
        </div>
    )
};

export default Messages;