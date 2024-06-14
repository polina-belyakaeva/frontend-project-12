import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMessagesQuery, messagesApi } from '../../api/messagesApi';
import { socket } from '../../socket';

const Messages = () => {
  const dispatch = useDispatch();
  const { data = [], refetch } = useGetMessagesQuery();

  useEffect(() => {
      const handleMessages = (newMessage) => {
        dispatch(
          messagesApi.util.updateQueryData('getMessages', undefined, (draftMessages) => {
            draftMessages.push(newMessage)
          }),
        );
      };
      socket.connect();
      socket.on('newMessage', handleMessages);

      return () => socket.off('newMessage');
    }, [dispatch, refetch]);

    const { currentChannel } = useSelector((state) => state.ui);
    const filteredMessages = data.filter((message) => message.channelId === currentChannel.id);

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