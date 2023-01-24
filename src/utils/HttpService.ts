import axios, { AxiosRequestConfig } from "axios"
//  对axios进行简单的配置
const developUrl = "http://localhost:3000/"
const productionUrl = ""
const BASE_URL = process.env.NODE_ENV === 'development' ? developUrl : productionUrl

const $http = axios.create({
    baseURL: BASE_URL,
    timeout: 5000
})

// 请求拦截器 在发起http请求之前的一些操作
// 1、发送请求之前，加载一些组件
// 2、某些请求需要携带token，如果说没有没有携带，直接跳转到登录页面
$http.interceptors.request.use((config) => {
    // console.log('被拦截做的一些操作')
    return config
}, err => {
    return err
})

// 响应拦截器
$http.interceptors.response.use((res) => {
    return res
}, err => {
    if (err && err.response) {
        switch(err.response.status) {
            // case 400:
            //     console.log('请求错误')
            //     break
            // case 401:
            //     console.log('未认证')
            //     break
            // default:
            //     console.log('其他信息错误')
        }
    }
})

export default $http
