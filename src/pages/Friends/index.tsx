import { siteTitle } from "@/utils/constant"
import { useEvent, useWindowSize } from "@/utils/FlyerHooks"
import $http from "@/utils/HttpService"
import { UserOutlined } from "@ant-design/icons"
import { useMount, useRequest, useSafeState, useTitle, useUpdateEffect } from "ahooks"
import { Avatar, List, Space } from "antd"
import React, { useEffect } from "react"
import { FriendDto } from "../Backend/pages/Friends"

const Friends = () => {
    useTitle(`${siteTitle} | 友人帐`);
    const [column, setColumn] = useSafeState(4)
    const [containerMargin, setContainerMargin] = useSafeState(128)
    const windowSize = useWindowSize()
    useEffect(() => {
        changeColumn()
    }, [windowSize])

    const changeColumn = () => {
        if (windowSize?.width >= 1440) setColumn(4)
        else if (windowSize?.width < 1440 && windowSize?.width >= 1024) setColumn(3)
        else if (windowSize?.width < 1024 && windowSize?.width >= 425) setColumn(2)
        else setColumn(1)
    }

    const { data, loading } = useRequest(() => $http.get('api/get-friends'))
    const renderItem = (item: FriendDto) => {
        const onClick = () => {
            const w = window.open('_black') //这里是打开新窗口
            const url = item.url
            if (w?.location?.href && url) w.location.href = url //这样就可以跳转了

        }
        return (
            <div onClick={onClick} style={{ margin: '10px', padding: '20px' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    background: 'white',
                    boxShadow: 'rgb(136 165 191 / 48%) 6px 2px 16px 0px, rgb(255 255 255 / 80%) -6px -2px 16px 0px',
                    padding: '24px',
                    borderRadius: '8px'
                }}>
                    <div style={{ marginRight: '16px' }}><Avatar src={item.avatar} size={64} icon={<UserOutlined />} /></div>
                    <div style={{}}>
                        <div style={{ fontSize: '20rem', fontWeight: 'bold' }}>{item.name}</div>
                        <div style={{ fontSize: '12rem', color: 'gray' }}>{item.desc}</div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <>
            <div style={{
                marginLeft: `${containerMargin}rem`,
                marginRight: `${containerMargin}rem`
            }}>
                <List
                    grid={{ gutter: 16, column: column }}
                    dataSource={data?.data?.data ? data?.data?.data : []}
                    renderItem={renderItem}
                ></List>
            </div>
        </>
    )
}

export default Friends