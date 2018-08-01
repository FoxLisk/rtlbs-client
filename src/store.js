import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState()
  ],
  state: {
    jwt: null,
    user: null,
    darkMode: false
  },
  mutations: {
    setToken (state, jwt) {
      state.jwt = jwt
    },
    setUser (state, user) {
      state.user = user
    },
    setDarkMode (state, darkMode) {
      state.darkMode = darkMode
    }
  },
  actions: {
    setToken ({commit}, jwt) {
      commit('setToken', jwt)
    },
    setUser ({commit}, user) {
      commit('setUser', user)
    },
    setDarkMode ({commit}, darkMode) {
      commit('setDarkMode', darkMode)
    }
  }
})
