import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery } from '../../api/messagesApi';

const Messages = () => {
  const { data = [] } = useGetMessagesQuery();
  const [shouldScrollDown, setShouldScrollDown] = useState(true);
  const messagesBoxRef = useRef(null);

  const { currentChannel } = useSelector((state) => state.ui);
  const filteredMessages = data.filter(
    (message) => message.channelId === currentChannel.id,
  );

  useEffect(() => {
    const messagesBox = messagesBoxRef.current;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = messagesBox;
      const isScrollingUp = scrollTop < scrollHeight - clientHeight;
      if (isScrollingUp) {
        setShouldScrollDown(false);
      } else {
        setShouldScrollDown(true);
      }
    };

    messagesBox.addEventListener('scroll', handleScroll);

    if (messagesBox && shouldScrollDown) {
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    return () => {
      messagesBox.removeEventListener('scroll', handleScroll);
    };
  }, [filteredMessages.length, shouldScrollDown]);

  return (
    <div
      id="messages-box"
      className="chat-messages overflow-auto px-5"
      ref={messagesBoxRef}
    >
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
