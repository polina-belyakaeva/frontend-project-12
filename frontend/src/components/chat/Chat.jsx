import React from 'react';
import { Col } from 'react-bootstrap';
import ChatHeader from './ChatHeader.jsx';
import Messages from '../messages/Messages.jsx';
import MessageForm from '../messages/MessageForm.jsx';

const Chat = () => {
    return (
        <Col className='p-0 h-100'>
            <div className='d-flex flex-column h-100'>
            <ChatHeader />
            <Messages />
            <MessageForm />
            </div>
        </Col>
    )
};

export default Chat;