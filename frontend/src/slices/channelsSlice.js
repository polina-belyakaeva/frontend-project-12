import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channelsList: [],
  currentChannel: { id: "1", name: "general", removable: false },
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setCurrentChannel(state, action) {
      state.currentChannel = action.payload;
    },
  },
});

export const { setChannels, setCurrentChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
