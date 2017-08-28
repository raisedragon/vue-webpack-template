/**
 * Created by willchen on 2017/3/20.
 */

const Index = resolve => require(['../page/index/Index.vue'], resolve),          //首页



      /*404*/
      NotFound = resolve => require(['../page/NotFound.vue'], resolve);


export default  [
    /*工作台*/
    // {
    //     path: '/workspace',
    //     component: Index,
    //     alias: '/',
    //     name: 'workspace'
    // },
    


    //404
    {
        path: '/notFound',
        component: NotFound,
        name: 'notFound'
    }
]
