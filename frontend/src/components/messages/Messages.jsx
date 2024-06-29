import React from 'react';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery } from '../../api/messagesApi';

const Messages = () => {
  const { data = [] } = useGetMessagesQuery();

  const { currentChannel } = useSelector((state) => state.ui);
  const filteredMessages = data.filter(
    (message) => message.channelId === currentChannel.id,
  );

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 ">
      {filteredMessages.map((message) => (
        <div key={message.id} className="text-break mb-2">
          <b>{message.username}</b>
          <span>: </span>
          {message.body}
        </div>
      ))}
    </div>
  );
};

export default Messages;
