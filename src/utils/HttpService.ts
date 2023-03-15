import { log } from "@/FlyerLog"
import axios, { AxiosRequestConfig } from "axios"
//  对axios进行简单的配置
const developUrl = "http://localhost:3000/"
const productionUrl = "http://58.221.197.198:25570/"
export const BASE_URL = process.env.NODE_ENV === 'development' ? developUrl : productionUrl
export const getToken = () => localStorage.getItem("Authorization")
export const uploadMdImageUrl = BASE_URL + 'api/image/upload-markdown-image'

const $http = axios.create({
    baseURL: BASE_URL,
    timeout: 5000
})

export const apiUrl = (path: string) => {
    if (path.length>0 && path[0] == "/") {
        return BASE_URL + path.slice(1, path.length)
    }
    return BASE_URL + path
}

// 请求拦截器 在发起http请求之前的一些操作
// 1、发送请求之前，加载一些组件
// 2、某些请求需要携带token，如果说没有没有携带，直接跳转到登录页面
$http.interceptors.request.use((config) => {
    //  携带token
    const token = localStorage.getItem("Authorization")
    if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`
    }
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

        return err.response
    }
})

export default $http
