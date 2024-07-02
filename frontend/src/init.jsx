import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import filter from 'leo-profanity';
import i18next, { initI18n } from './init18n';
import App from './App';
import store from './slices/store/index.js';
import { messagesApi } from './api/messagesApi';
import { channelsApi } from './api/channelsApi';
import socket from './socket';
import FilterContext from './context/filterContext';
import { AuthProvider } from './context/authContext';

const Init = async () => {
  const rollbarConfig = {
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: process.env.ROLLBAR_ENVIRONMENT,
  };

  await initI18n();
  filter.loadDictionary('ru');
  filter.loadDictionary('en');

  const handleMessages = (newMessage) => {
    store.dispatch(
      messagesApi.util.updateQueryData(
        'getMessages',
        undefined,
        (draftMessages) => {
          draftMessages.push(newMessage);
        },
      ),
    );
  };

  const handleChannels = (newChannel) => {
    store.dispatch(
      channelsApi.util.updateQueryData(
        'getChannels',
        undefined,
        (draftChannels) => {
          draftChannels.push(newChannel);
        },
      ),
    );
  };
  const handleDeleteChannel = ({ id }) => {
    store.dispatch(
      channelsApi.util.updateQueryData(
        'getChannels',
        undefined,
        (draftChannels) => draftChannels.filter((channel) => channel.id !== id),
      ),
    );
  };
  const handleRenameChannel = ({ id, name }) => {
    store.dispatch(
      channelsApi.util.updateQueryData(
        'getChannels',
        undefined,
        (draftChannels) => {
          const channelIndex = draftChannels.findIndex(
            (channel) => channel.id === id,
          );
          const draft = draftChannels;
          draft[channelIndex].name = name;
        },
      ),
    );
  };

  socket.connect();
  socket.on('newMessage', handleMessages);
  socket.on('newChannel', handleChannels);
  socket.on('renameChannel', handleRenameChannel);
  socket.on('removeChannel', handleDeleteChannel);

  return (
    <BrowserRouter>
      <FilterContext.Provider value={filter}>
        <RollbarProvider config={rollbarConfig}>
          <ErrorBoundary>
            <Provider store={store}>
              <I18nextProvider i18n={i18next}>
                <AuthProvider>
                  <App />
                </AuthProvider>
              </I18nextProvider>
            </Provider>
          </ErrorBoundary>
        </RollbarProvider>
      </FilterContext.Provider>
    </BrowserRouter>
  );
};

export default Init;
