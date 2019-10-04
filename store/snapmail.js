import qs from "qs";

export const state = () => ({
  snapmails: [],
  snapmailById: [],
  snapmailEditId: null,
  snapmailDialog: false,
  snapmailDialogType: 'create',
})

export const mutations = {
  setSnapmailDialog(state, payload) {
    state.snapmailDialog = payload;
  },
  setSnapmailDialogType(state, payload) {
    state.snapmailDialogType = payload;
  },
  setSnapmails(state, payload) {
    state.snapmails = payload;
  },
  setSnapmailEditId(state, payload) {
    state.snapmailEditId = payload;
  },
  setSnapmailById(state, payload) {
    state.snapmailById = payload;
  },
}

export const actions = {
  async createSnapmail({}, payload) {
    try {
      await this.$axios.$post(`${process.env.API_URL}/snapmails`, payload);
    } catch (err) {
      console.log(err)
    }
  },

  async getSnapmails({ commit }) {
    try {
      const data = await this.$axios.$get(`${process.env.API_URL}/snapmails`);
      commit("setSnapmails", data.snapmails);
    } catch (err) {
      console.log(err);
    }
  },

  async getSnapmailById({ commit }, id) {
    try {
      const data = await this.$axios.$get(`${process.env.API_URL}/snapmails/${id}`);
      commit("setSnapmailById", data.snapmails);
    } catch (err) {
      console.log(err);
    }
  },

  async destroySnapmail({ dispatch }, id) {
    try {
      await this.$axios.$delete(`${process.env.API_URL}/snapmails/${id}`);
      dispatch('getSnapmails');
    }catch(error) {
      console.log(error);
    }
  },

  async updateSnapmail({}, payload) {
    try {
      await this.$axios.$patch(`${process.env.API_URL}/snapmails/${payload.id}`, payload.data);
    }
    catch(error) {
      console.error(error);
    }
  },

  async updatePauseStatus({}, payload) {
    try {
      await this.$axios.$patch(`${process.env.API_URL}/snapmails/${payload.id}`, { 'is_paused': !payload.is_paused });
    }
    catch(error) {
      console.error(error);
    }
  },
}

export const getters = {
  getSnapmailDialog(state) {
    return state.snapmailDialog;
  },
  getSnapmailDialogType(state) {
    return state.snapmailDialogType;
  },
  getSnapmails(state) {
    return state.snapmails;
  },
  getSnapmailEditId(state) {
    return state.snapmailEditId;
  },
  getSnapmailById(state) {
    return state.snapmailById;
  },
}