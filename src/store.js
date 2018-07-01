import Vue from 'vue'
import Vuex from 'vuex'
import axiosAuth from './axios-auth'
import axios from 'axios'
import settings from './settings'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: { email: null}
  },
  mutations: {
    AUTH_USER (state, userData) {
      console.log('auth_user')
      state.idToken = userData.idToken;
      state.userId = userData.userId;
    },
    STORE_USER (state, user) {
      state.user = user
    }
  },
  actions: {
    signUp ({commit, dispatch}, authData) {
      console.log('signing up')
        axiosAuth.post(`/signupNewUser?key=${settings.api_key}`, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        })
          .then(res => {
            commit('AUTH_USER', {idToken: res.data.idToken, userId: res.data.localId});
            dispatch('storeUser', authData)
          })
          .catch(error => console.log(error));
    },
    signIn ({commit}, authData) {
        console.log('signing in')
        axiosAuth.post(`/verifyPassword?key=${settings.api_key}`, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        })
          .then(res => {
            commit('AUTH_USER', {idToken: res.data.idToken, userId: res.data.localId});
          })
          .catch(error => console.log(error));
    },
    storeUser ({commit, state}, user) {
      if (!state.idToken) {
        return
      }
      axios.post('/users.json', user, {params: {auth: state.idToken}})
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
    fetchUser ({commit, state}) {
      if (!state.idToken) {
        return
      }
      axios.get('/users.json', {params: {auth: state.idToken}})
        .then(res => {
          const data = res.data;
          const users = [];
          for (let key in data){
            const user = data[key];
            user.id = key;
            users.push(user);
          }
          commit('STORE_USER', users[0])
        })
        .catch(err => console.log(err))
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    isAuthenticated (state) {
      return state.idToken !== null;
    }
  }
})