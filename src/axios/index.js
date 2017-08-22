/**
 * Created by willchen on 2017/4/17.
 */

import qs from 'qs'
import Axios from 'axios'
import {Notification,MessageBox } from 'element-ui'
import config from './config'

const axios = Axios.create(config);

// 支持post提交
axios.interceptors.request.use( (config)=>{


    let config_data = config.data;
    if(config.dataType==="json") return config;
    if(config_data ){
        config.data = qs.stringify(config_data);
    }


    return config;
},(err)=>{


    Notification.error({
        title: '错误',
        duration: 2000,
        message: `提交错误！`
    });

    return Promise.reject(err);
});


/*响应头拦截处理数据*/
axios.interceptors.response.use( (res) => {
    let resData=qs.parse(res.config.data);
    if (resData.isCut=="false"){
        return res;
    }

    const data = res.data;

    //除非明确指定interceptError===false,否则做拦截处理
    if (res.config.interceptError!==false){
	    if (1 === parseInt(data.status)) {
	        // 对接口异常信息进行友好展示

            MessageBox({
                type:'error',
                title: '错误',
                message:  data.message || `错误`,
                confirmButtonText: '确定',
            })

	        return Promise.reject(data);
	    }
    }

    return data;

}, (error) => {
    // 对请求异常信息进行友好展示



    Notification.error({
        title: '请求错误',
        message: error.message ,
        duration: 2000,
    });
    return Promise.reject(error);
});



export default axios;




