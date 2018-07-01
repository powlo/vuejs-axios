/* global localStorage */

import Vue from 'vue'
import Vuex from 'vuex'
import axiosAuth from './axios-auth'
import axios from 'axios'
import settings from './settings'

import router from './router'

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
    },
    CLEAR_USER (state) {
      state.idToken = null;
      state.userId = null;
    }
  },
  actions: {
    setSignoutTimer({commit}, expirationTime) {
      setTimeout(() => {
        console.log('timed out')
        commit('CLEAR_USER')
      }, expirationTime * 1000);
    },
    signUp ({commit, dispatch}, authData) {
      console.log('signing up')
        axiosAuth.post(`/signupNewUser?key=${settings.api_key}`, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        })
          .then(res => {
            const now = new Date();
            const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000);
            commit('AUTH_USER', {idToken: res.data.idToken, userId: res.data.localId});
            localStorage.setItem('token', res.data.idToken);
            localStorage.setItem('expires', expirationDate);
            localStorage.setItem('id', res.data.localId);
            dispatch('storeUser', authData);
          })
          .catch(error => console.log(error));
    },
    signIn ({commit, dispatch}, authData) {
      console.log('signing in');
      
      axiosAuth.post(`/verifyPassword?key=${settings.api_key}`, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          const now = new Date();
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000);
          commit('AUTH_USER', {idToken: res.data.idToken, userId: res.data.localId});
          localStorage.setItem('token', res.data.idToken);
          localStorage.setItem('expires', expirationDate);
          localStorage.setItem('id', res.data.localId);        

          commit('AUTH_USER', {idToken: res.data.idToken, userId: res.data.localId});
          dispatch('setSignoutTimer', res.data.expiresIn);
        })
        .catch(error => console.log(error));
    },
    tryAutoLogin ({commit}) {
      console.log('trying to autologin')
      const token = localStorage.getItem('token');
      const expiresIn = localStorage.getItem('expires');
      const id = localStorage.getItem('id');
      if (!token) return;
      const now = new Date();
      console.log('all ok');
      if (expiresIn < now) return;
      commit('AUTH_USER', {idToken: token, userId: id});
      router.replace('/dashboard');
    },
    signOut ({commit}) {
      commit('CLEAR_USER');
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('expires');
      router.replace('/signin');
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