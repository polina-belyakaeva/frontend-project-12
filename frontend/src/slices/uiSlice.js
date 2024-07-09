import { createSlice } from '@reduxjs/toolkit';

export const defaultChannel = { id: '1', name: 'general', removable: false };

const initialState = {
  channelsList: [],
  currentChannel: defaultChannel,
  scrollType: '',
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
    setScrollType(state, action) {
      const { type } = action.payload;
      state.scrollType = type;
    },
  },
});

// prettier-ignore
export const {
  setChannels,
  setCurrentChannel,
  setScrollType,
} = uiSlice.actions;
export default uiSlice.reducer;
