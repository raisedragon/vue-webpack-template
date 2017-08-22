/**
 * Created by willchen on 2017/3/20.
 */

const Index = resolve => require(['../page/statistics/Index.vue'], resolve),          //我的工作台



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
