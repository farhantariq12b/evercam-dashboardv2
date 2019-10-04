import qs from "qs";

export const state = () => ({
  snapmailDialog: false,
  snapmailDialogType: 'create',
  snapmailData: [],
  snapmailDataById: [],
  snapmailCardId: null,
})

export const mutations = {
  setSnapmailDialog(state, payload) {
    state.snapmailDialog = payload;
  },
  setSnapmailDialogType(state, payload) {
    state.snapmailDialogType = payload;
  },
  setSnapmailData(state, payload) {
    state.snapmailData = payload;
  },
  setSnapmailCardId(state, payload) {
    state.snapmailCardId = payload;
  },
  setSnapmailDataById(state, payload) {
    state.snapmailDataById = payload;
  },
  deleteSnapmail(state, id){
   let index = state.snapmailData.findIndex(snapmail => snapmail.id == id)
   state.snapmailData.splice(index, 1)

  }
}

export const actions = {
  async setSnapmailData({ commit }, payload) {
    try {
      const data = await this.$axios.$post(`${process.env.API_URL}snapmails`, payload);
    } catch (err) {
      console.log(err)
    }
  },

  async fetchSnapmailData({ commit }) {
    try {
      const data = await this.$axios.$get(`${process.env.API_URL}snapmails`);
      commit("setSnapmailData", data.snapmails);
    } catch (err) {
      console.log(err);
    }
  },

  async fetchSnapmailDataById({ commit }, id) {
    try {
      const data = await this.$axios.$get(`${process.env.API_URL}snapmails/${id}`);
      commit("setSnapmailDataById", data.snapmails);
    } catch (err) {
      console.log(err);
    }
  },

  async deleteSnapmail({commit, dispatch }, id) {
    try {
      const data = await this.$axios.$delete(`${process.env.API_URL}snapmails/${id}`);
      commit("deleteSnapmail", id);
      dispatch('fetchSnapmailData');
    }catch(error) {
      console.log(error);
    }
  },

  async updateSnapmailData({dispatch}, payload) {
    try {
      const data = await this.$axios.$patch(`${process.env.API_URL}snapmails/${payload.id}`, payload.data);
    }
    catch(error) {
      console.error(error);
    }
  },

  async updatePauseStatus({dispatch}, payload) {
    try {
      const data = await this.$axios.$patch(`${process.env.API_URL}snapmails/${payload.id}`, {'is_paused':!payload.is_paused});
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
  getSnapmailData(state) {
    return state.snapmailData;
  },
  getSnapmailCardId(state) {
    return state.snapmailCardId;
  },
  getSnapmailDataById(state) {
    return state.snapmailDataById;
  },
}
