import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";



import 'style/common/common.scss'

/* 注册路由组件 */
Vue.use(VueRouter);

import 'element-ui/lib/theme-default/index.css'
import ElementUI from 'element-ui'
/* 注册 ElementUI 组件*/
Vue.use(ElementUI);




/*绑定http*/
import Axios from './axios/index';
Vue.prototype.$http = Axios;

import routes from './routes/index'
import store from './store/index'

/* 路由创建 */
const router = new VueRouter({
    // mode: 'history',
    base: __dirname,
    routes,
});

/* 创建应用 */
new Vue({
    store,
    router,
    el: '#app',

    render: h => h(App)
});

