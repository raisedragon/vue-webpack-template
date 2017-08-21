/**
 * Created by willchen on 2017/3/20.
 */

const Index = resolve => require(['../page/statistics/Index.vue'], resolve),          //我的工作台

      NetTopData = resolve => require(['../page/statistics/Index.vue'], resolve),  //发布数据统计
      Dashboard = resolve => require(['../page/dashboard/Index.vue'], resolve),

      CheckUserAuth = resolve => require(['../page/auth/Index.vue'], resolve),        //查询用户权限
      Auth = resolve => require(['../page/auth/Detail.vue'], resolve),        //用户权限管理

      Character = resolve => require(['../page/character/Index.vue'], resolve),        //用户角色管理
      CharacterDetail = resolve => require(['../page/character/Detail.vue'], resolve),        //新增，修改角色

      ConfigTree = resolve => require(['../page/configTree/Index.vue'], resolve),        //配置树

      MenuTree = resolve => require(['../page/menu/Index.vue'], resolve),        //菜单树

      PingConfig = resolve => require(['page/pingConfig/Index.vue'], resolve),

      NetworkMonitor = resolve => require(['page/networkMonitor/Index.vue'], resolve),

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
    
    {
        path: '/netTopData',
        component: NetTopData,
        name: 'netTopData'
    },
    {
        path: '/dashboard',
        component: Dashboard,
        name: 'dashboard'
    },





    /*系统管理*/
    {
        path: '/auth',
        component: CheckUserAuth,
        name: 'checkUserAuth'
    },
    {
        path: '/auth/detail/:id?',
        component: Auth,
        name: 'auth'
    },

    /*角色管理*/
    {
        path: '/character',
        component: Character,
        name: 'character'
    },
    /*新增，修改角色*/
    {
        path: '/character/detail/:id?',
        component: CharacterDetail,
        name: 'characterDetail'
    },
    /*配置树*/
    {
        path: '/config',
        component: ConfigTree,
        name: 'configTree'
    },

    /*菜单树*/
    {
        path: '/menu',
        component: MenuTree,
        name: 'menuTree',
    },
    
    /*PingConfig-ui*/
    {
        path: '/pingConfig',
        component: PingConfig,
        name: 'pingConfig'
    },

    /*PingConfig-ui*/
    {
        path: '/networkMonitor',
        component: NetworkMonitor,
        alias: '/',
        name: 'networkMonitor'
    },

    //404
    {
        path: '/notFound',
        component: NotFound,
        name: 'notFound'
    }
]
