/**
 * Created by willchen on 2017/8/21.
 */
import Axios from '../axios/index'

export default {
    state: {
        user:null,
        bizLineList: [],  //业务线
    },
    getters: {
        hasBizLineList: state => state.bizLineList.length > 0,
    },

    /* 状态变更 使用mutation*/
    mutations: {
        setBizLine (state,payload) {
            state.bizLineList = payload.data;
        }

    },

    /*ajax 请求使用action*/
    actions: {

        getBizLine ({commit,getters }) {
            /* 已缓存bizLine ，无需重复请求 */
            if (getters.hasBizLineList) {
                return false;
            }

            Axios.post('/regedit/getChildrenByPath',{
                path: '/root/publish_constant/biz_line',
            }).then( ({data})=>{
                commit('setBizLine',{
                    data
                })
            });


        },




    }
}