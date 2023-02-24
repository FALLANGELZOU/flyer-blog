import Layout from "@/components/Layout"
import { storeState } from "@/redux/interface"
import { setHiddenNav } from "@/redux/reducers/common"
import API from "@/utils/apis/FlyerApi"
import { useUnmount } from "@/utils/FlyerHooks"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { useLatest, useMount, useTitle } from "ahooks"
import { Button, Input, Space } from "antd"
import React from "react"
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom"


interface Props {
    setHiddenNav?: Function
}
const Login: React.FC<Props> = ({
    setHiddenNav
}) => {

    const navigate = useNavigate()
    const username = useLatest("")
    const password = useLatest("")
    useTitle("核心控制系统")
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
                navigate("/dashboard")
            }
        })
    }


    useMount(() => {
        setHiddenNav?.(true)
    })

    useUnmount(() => {
        setHiddenNav?.(false)
    })

    return (
        <>
            <div style={{
                height: '100vh',
                width: "100vw",
                position: 'absolute',
                left: '0',
                right: '0',
                top: '0',
                bottom: '0',
                display: 'flex',
                backgroundImage: `url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")`
            }}>
                <div
                    style={{
                        height: "fit-content",
                        position: 'relative',
                        backgroundColor: 'white',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        marginLeft: 'auto',
                        right: '70px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        paddingTop: '30px',
                        paddingBottom: '60px',
                        paddingLeft: '80px',
                        paddingRight: '80px',
                        borderRadius: '15px'
                    }}
                >
                    <Space wrap>
                        <img src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" style={{ width: '80px' }}></img>
                        <span style={{ fontSize: '30px', marginLeft: '5rem', fontWeight: '600' }}>Flyer Core System</span>
                    </Space>
                    <span style={{ color: 'gray', marginTop: '10px', fontSize: '1rem', marginBottom: '45px' }}>Light_Sun的管理中心</span>
                    <Space direction="vertical" style={{ width: '90%' }}>
                        <Input
                            onChange={changeUsername}
                            placeholder="Enter your username"
                            prefix={<UserOutlined style={{ paddingRight: '10px' }} />}
                        />
                        <Input.Password
                            onChange={changePassword}
                            placeholder="Input password"
                            prefix={<LockOutlined style={{ paddingRight: '10px' }} />}
                        />

                        <Button
                            onClick={login}
                            type="primary"
                            block
                            style={{ marginTop: "20px" }}
                        >登陆</Button>
                    </Space>

                </div>
            </div>
        </>
    )
}





export default connect(
    (state: storeState) => ({
        hiddenNav: state.hiddenNav
    }),
    { setHiddenNav }
)(Login);

