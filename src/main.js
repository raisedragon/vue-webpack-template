import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";



import 'style/common/common.scss'


Vue.use(VueRouter);

import 'element-ui/lib/theme-default/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI);




/*绑定http*/
import Axios from './axios/index';
Vue.prototype.$http = Axios;

import routes from './routes/index'
import store from './store/index'

console.log('env', process.env.NODE_ENV  );











const router = new VueRouter({
    // mode: 'history',
    base: __dirname,
    routes,
});


new Vue({
    store,
    router,
    el: '#app',

    render: h => h(App)
});

