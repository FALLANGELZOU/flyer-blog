import Layout from "@/components/Layout"
import API from "@/utils/apis/FlyerApi"
import { useLatest } from "ahooks"
import { Button, Input } from "antd"
import React from "react"

const Login = () => {


    const username = useLatest("")
    const password = useLatest("")

    const changePassword = (e: any) => {
        password.current = e.target.value
        
    }
    const changeUsername = (e: any) => {
        username.current = e.target.value
    }
    const login = () => {
        API.login(username.current, password.current).then((res: any) => {
            const data = res.data
            if (data.code == 200) {
                // TODO: 切换到后台管理界面
            }
        })
    }

    return (
        <>
            <Layout>
            <div style={{
                display:"flex",
                height:"100%",
                width:"100%",
                justifyContent:"center",
                alignItems:"center"
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: "column",
                    width: '400px'

                }}>
                    <div id="username" style={{marginBottom:'20px'}}>
                        <Input 
                        placeholder="用户名" 
                        size="large" 
                        style={{height:"60px"}} 
                        onChange = {changeUsername}
                        />
                    </div>
                    <div id="password" style={{marginBottom:'20px'}}>
                        <Input.Password 
                        placeholder="密码" 
                        size="large" 
                        style={{height:"60px"}} 
                        onChange = {changePassword}
                        />
                    </div>
                    <Button style={{
                        left:"0px",
                        width:"20%",
                        height:"45px",
                        marginLeft:"auto",
                        backgroundColor: "rgb(246,255,239)"
                    }}
                    
                    onClick = {login}
                    
                    >登陆</Button>
                </div>
            </div>
            </Layout>

        </>
    )
}

export default Login