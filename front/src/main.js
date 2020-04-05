// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import ajax from '../utils/ajax.js'


import mavonEditor from 'mavon-editor';
Vue.use(mavonEditor);

//在main.js文件中将md5引入，可以全局使用的

import crypto from "crypto";
Vue.prototype.$md5 = crypto.createHash("md5");


Vue.use(ElementUI);
Vue.prototype.$http = axios;

// 原生 ajax , 挂载在 Vue 原型链上
Vue.prototype.$ajax = ajax;


Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
})
