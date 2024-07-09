import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalChannelId: '',
  modalChannelName: '',
  modalType: '',
  modalIsActive: 'false',
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  /* eslint-disable no-param-reassign */
  reducers: {
    setModalChannel(state, action) {
      const { id, name } = action.payload;

      state.modalChannelId = id;
      state.modalChannelName = name;
    },
    setModalType(state, action) {
      const { type } = action.payload;
      state.modalType = type;
    },
    setModalActive(state, action) {
      const { isActive } = action.payload;
      state.modalIsActive = isActive;
    },
  },
});

export const { setModalChannel, setModalType, setModalActive } = modalSlice.actions;
export default modalSlice.reducer;
