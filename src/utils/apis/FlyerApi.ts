import { log } from "@/FlyerLog"
import $http from "../HttpService"

const API = {

    /**
     * 登陆接口
     * @param username 用户名
     * @param password 密码
     */
    login: async (username: string, password: string) => {
        return new Promise((resolve, reject) => {
            $http.post("/api/login", { username, password })
                .then(
                    res => {
                        //  如果验证通过，存储token
                        const data = res.data
                        if (data.code == 200 && data.data.token) {
                            localStorage.setItem("Authorization", data.data.token)
                            log.debug(`token:${data.data.token}`)
                        }
                        resolve(res)
                    },
                    err => { console.log(err); resolve(err)}
                )
        })
    },

    /**
     * 测试token是否有效
     */
    tokenTest: async () => {
        const res = await $http.get("api/token-test")
        if (res?.data) {
            log.debug(res.data)
        }
        return res
    }



}

export default API