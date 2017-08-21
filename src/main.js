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
// var test = typeof wFlag ;





/*Vue filter*/

Vue.filter("dateFormat",value=>{
    let dateReg = /^[\d]*-[\d]*-/;
    if (!value){
        return '';
    }

    if (dateReg.test(value)) {
        return value.slice(0,16);
    }

    let d = new Date(value);
    let formatNum = (num)=>{
        return parseInt(num) > 9 ? num : '0' + num;
    };

    return` ${d.getFullYear()}-${formatNum(d.getMonth()+1)}-${formatNum(d.getDate())} ${formatNum(d.getHours())}:${formatNum(d.getMinutes())}`;

});











const router = new VueRouter({
    // mode: 'history',
    base: __dirname,
    routes,
});

router.beforeEach((to, from, next) => {



    let menuList = store.state.menuList.concat('/notFound','/test');

    let firstPath = '/' + to.path.split('/')[1];

    if (menuList.length === 2 ) {
        next();
    } else {
        if (  menuList.includes(firstPath) ) {
            next();
        } else {

            next({name:"notFound"});
        }
    }




    // setTimeout( ()=>{
    //
    // }, 0);

})

new Vue({
    store,
    router,
    el: '#app',

    render: h => h(App)
});



/*router.beforeEach((to, from, next) => {
 // alert(sessionStorage.getItem('accessToken'))
 // console.log(to);  // to.fullPath
 // console.log(from)

 if ( false ) { //未登录

 /!*passport.oa不允许端口号*!/

 /!*next({
 path: 'http://oa.fenqile.com',
 // query: { redirect: to.fullPath }
 })*!/
 } else {
 next()
 }
 })*/
