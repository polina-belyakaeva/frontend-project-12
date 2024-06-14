import React from 'react';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery } from '../../api/messagesApi';
import { useTranslation } from 'react-i18next';
import store from '../../slices/store/index'

const ChatHeader = () => {
    const { t } = useTranslation();
    const { currentChannel } = useSelector((state) => state.ui);
    const { data = [] } = useGetMessagesQuery();

    const channelsMessages = data.filter((message) => message.channelId === currentChannel.id);

    return (
        <div className='bg-light mb-4 p-3 shadow-sm small'>
            <p className='m-0'>
                <b># {currentChannel.name}</b>
            </p>
            <span className='text-muted'>{t('messages.key', { count: channelsMessages.length })}</span>
        </div>
    )
};

export default ChatHeader;