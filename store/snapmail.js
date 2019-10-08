import qs from "qs";

export const state = () => ({
  snapmails: [],
  currentSnapmail: [],
  snapmailId: null,
  snapmailDialog: false,
  snapmailDialogType: 'create',
  notification: {
    text: '',
    color: '',
    snackbar: false,
  },
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
  setSnapmailId(state, payload) {
    state.snapmailId = payload;
  },
  setSnapmailCurrentId(state, payload) {
    state.currentSnapmail = payload;
  },
  setNotification(state, payload) {
    state.notification = payload;
  },
}

export const actions = {
  async createSnapmail({commit}, payload) {
    try {
      await this.$axios.$post(`${process.env.API_URL}snapmails`, payload);
      commit('setNotification', { text: 'Snapmail created successfully', color: 'success', snackbar: true });
    } catch (err) {
      console.log(err)
    }
  },

  async getSnapmails({ commit }) {
    try {
      const data = await this.$axios.$get(`${process.env.API_URL}snapmails`);
      commit("setSnapmails", data.snapmails);
    } catch (err) {
      console.log(err);
    }
  },

  async getCurrentSnapmail({ commit }, id) {
    try {
      const data = await this.$axios.$get(`${process.env.API_URL}snapmails/${id}`);
      commit("setSnapmailCurrentId", data.snapmails);
    } catch (err) {
      console.log(err);
    }
  },

  async destroySnapmail({ dispatch }, id) {
    try {
      await this.$axios.$delete(`${process.env.API_URL}snapmails/${id}`);
      dispatch('getSnapmails');
    }catch(error) {
      console.log(error);
    }
  },

  async updateSnapmail({commit}, payload) {
    try {
      await this.$axios.$patch(`${process.env.API_URL}snapmails/${payload.id}`, payload.data);
      commit('setNotification', { text: 'Snapmail updated successfully', color: 'success', snackbar: true });

    }
    catch(error) {
      console.error(error);
    }
  },

  async updatePauseStatus({}, payload) {
    try {
      await this.$axios.$patch(`${process.env.API_URL}snapmails/${payload.id}`, { 'is_paused': !payload.is_paused });
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
  getSnapmailId(state) {
    return state.snapmailId;
  },
  getCurrentSnapmail(state) {
    return state.currentSnapmail;
  },
  getNotification(state) {
    return state.notification;
  },
}