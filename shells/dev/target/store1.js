import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: 'store1',
    random: 0
  },
  mutations: {
    UPDATE_RANDOM(state, val) {
      state.random = val
    }
  },
  actions: {
    randomize({ commit }) {
      const random = Math.random()
      commit('UPDATE_RANDOM', random)
    }
  }
})
