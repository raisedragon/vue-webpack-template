/**
 * Created by willchen on 2017/8/21.
 */
import Axios from '../axios/index'

export default {
    state: {
        user:null,
        bizLineList: [],  //业务线
        appFlagList: [],
        belongSysList: [],
        appTypeList: {},
        environmentList: [],  // [ {index:0, name:'dev', value: '开发'}, ... ]
        environmentMap:{},
        envMap: {},       // {dev:"开发",...}
        scriptList:[],

        userList:[],  //[willchen, tina , ...]
        roleList: [],
        rightList: [],

        menuList: [],

        phpconfDeployTemplate:{}

    },
    getters: {
        hasBizLineList: state => state.bizLineList.length > 0,
        hasAppFlagList: state => state.appFlagList.length > 0,
        hasBelongSysList: state => state.belongSysList.length > 0,
        hasEnvList: state => state.environmentList.length > 0,
        hasAppTypeList:state => JSON.stringify(state.appTypeList) != "{}",
        hasScriptList:  state => state.scriptList.length > 0,
        hasUserList: state => state.userList.length > 0,
        hasRoleList: state => state.roleList.length > 0,
        hasPhpconfDeployTemplate: state =>JSON.stringify(state.phpconfDeployTemplate) != "{}",
    },


    mutations: {
        setBizLine (state,payload) {
            state.bizLineList = payload.data;
        },
        setAppFlag (state,payload) {
            state.appFlagList = payload.data;
        },
        setBelongSys (state,payload) {
            state.belongSysList = payload.data;
        },
        setAppType(state, payload) {
            state.appTypeList = payload;
        },

        setPhpconfDeployTemplate(state, payload) {
            state.phpconfDeployTemplate = payload;
        },
        setEnv(state, payload) {
            let map = {};
            let map2 = {};
            payload.data.forEach(item => map[item.name] = item.value);
            payload.data.forEach(item => {
                map2[item.name] = item;
            });
            state.envMap = map;
            state.environmentMap = map2;
            state.environmentList = payload.data;
        },
        setScript(state, payload) {
            state.scriptList = payload.data;
        },

        setUser(state, payload) {
            state.userList = payload.data;
        },
        setRole(state, payload) {
            state.roleList = payload.data;
        },
        setRight(state, payload) {
            state.rightList = payload.data;
        },
        setMenuList(state, payload) {
            state.menuList = payload.data;
        }

    },
    actions: {

        getBizLine ({commit,state }) {
            Axios.post('/regedit/getChildrenByPath',{
                path: '/root/publish_constant/biz_line',
            }).then( ({data})=>{
                commit('setBizLine',{
                    data
                })
            });


        },
        getAppFlag ({commit, state}) {
            Axios.post('/regedit/getChildrenByPath', {
                path: '/root/publish_constant/app_manage/app_flag',
            }).then(({data}) => {
                commit('setAppFlag', {
                    data
                })
            });

        },
        getBelongSys ({commit, state}) {
            Axios.post('/regedit/getChildrenByPath', {
                path: '/root/publish_constant/belong_system',
            }).then(({data}) => {
                commit('setBelongSys', {
                    data
                })
            });
        },

        /*应用类型*/
        getAppType({commit, state}) {
            Axios.post('/regedit/getChildrenByPath',{
                path:'/root/publish_constant/app_manage/app_type'
            }).then(({data})=>{
                let newAppFormHide = {},
                    newAppDefaultVal = {};
                data.forEach(item => {
                    let obj = JSON.parse( item.value );
                    newAppFormHide[item.name] = obj.formHide;
                    newAppDefaultVal[item.name] = obj.default;
                });

                commit('setAppType', {
                    newAppFormHide,newAppDefaultVal
                })
            })
        },

        /*PHP配置文件模板*/
        getPhpconfDeployTemplate({commit, state}) {
            Axios.post('/regedit/getNodeByPath',{
                path:'/root/php_conf_publish/deploy_file_template'
            }).then(({data})=>{
                let phpconfDeployTemplate = JSON.parse( data.value );
                commit('setPhpconfDeployTemplate', phpconfDeployTemplate)
            })
        },

        /*所有环境*/
        getEnvList({commit, getters}) {
            let url = '/enums/getEnvs';
            if (getters.hasEnvList) {
                return false;
            }

            return Axios.post(url).then(({data})=>{
                commit('setEnv', {
                    data
                })
            })
        },


        getScriptList ({commit, state}) {
            Axios.post('/regedit/getChildrenByClzName', {
                clzName: 'ScriptType'
            }).then(({data}) => {
                commit('setScript', {
                    data
                })
            });
        },

        /*所有用户*/
        /*getUserList ({commit,state,getters}){

         if ( getters.hasUserList) {
         return false;
         }
         Axios.post('/user/getOAUserTotal').then(({data}) => {
         commit('setUser', {
         data: data.map(item => item.min)
         })
         });
         },*/
        getRoleList({commit,state}) {

            Axios.post('/role/list', {
                pageNum: 1,
                pageSize: 1000,
            }).then(({data})=>{
                commit('setRole', {
                    data: data.list.map(item => { return {value: item.id ,label: item.name  } })
                })

            })
        },
        getRightList({commit,state}) {
            const url = 'rights/getAllResource';
            Axios.post(url).then(({data})=>{
                commit('setRight',{
                    data
                })
            })
        }




    }
}