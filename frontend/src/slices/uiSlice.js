import { createSlice } from '@reduxjs/toolkit';

export const defaultChannel = { id: '1', name: 'general', removable: false };

const initialState = {
  channelsList: [],
  currentChannel: defaultChannel,
  modalChannelId: '',
  modalChannelName: '',
  modalType: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  /* eslint-disable no-param-reassign */
  reducers: {
    setChannels(state, action) {
      state.channelsList = action.payload;
    },
    setCurrentChannel(state, action) {
      state.currentChannel = action.payload;
    },
    setModalChannel(state, action) {
      const { id, name } = action.payload;

      state.modalChannelId = id;
      state.modalChannelName = name;
    },
    setModalType(state, action) {
      const { type } = action.payload;
      state.modalType = type;
    },
  },
});

// prettier-ignore
export const {
  setChannels,
  setCurrentChannel,
  setModalChannel,
  setModalType,
  setFocus,
} = uiSlice.actions;
export default uiSlice.reducer;
