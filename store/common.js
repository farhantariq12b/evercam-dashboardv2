export const state = () => ({
  snapmailDialog: false,
  snapmailData: [],
})

export const mutations = {
  setSnapmailDialog(state, payload) {
    state.snapmailDialog = payload;
  },
  setSnapmailData(state, payload) {
    state.snapmailData.push(payload);
  },
}

export const actions = {
}

export const getters = {
  getSnapmailDialog(state) {
    return state.snapmailDialog;
  },
  getSnapmailData(state) {
    return state.snapmailData;
  },
}
