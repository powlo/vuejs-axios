import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import axios from 'axios'

axios.defaults.baseURL = 'https://vuejs-axios-b8203.firebaseio.com';
axios.defaults.headers.common['Authorization'] = 'token';
axios.defaults.headers.get['Accepts'] = 'application/json';

axios.interceptors.request.use(config => {
  return config;
});

axios.interceptors.response.use(res => {
  return res;
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
