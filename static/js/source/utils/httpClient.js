/**
 * Created by jensen on 2018/1/18.
 */
const axios = require('axios');

let client = (config) => {

    if(!config){
        return null;
    }
    return new Promise((resolve, reject) => {
        axios(config).then((res) => {
           resolve(res);
        }, (err) => {
            reject(err);
        }).catch(err => {
            reject(err);
        })
    });
}

const initConfig = (config, params) => {

    if(params) {
        if(!config.method || config.method==='get'){
            config.params = params;
        }else if(config.method==='post'){
            config.data = params;
        }
    }
}


/**
 * get请求函数
 * @param {String}    url       [请求的url]
 * @param {Obejct}    params    [提交的参数，会拼到url中作为键值对参数提交]
 */
client.get = (url, params) => {
    let config = {
        method: 'get',
        url: url
    }

    initConfig(config, params);

    return fetch(config);
}

/**
 * get请求函数
 * @param {String}    url       [请求的url]
 * @param {Obejct}    params    [提交的参数，作为post的键值对参数提交]
 */
client.post = (url, params) => {
    let config = {
        method: 'post',
        url: url,
    }
    initConfig(config, params);
    return fetch(config);
}

export default client