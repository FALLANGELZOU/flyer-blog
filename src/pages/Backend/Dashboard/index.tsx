import ErrorBoundary from "@/components/ErrorBoundary"
import { storeState } from "@/redux/interface"
import { setHiddenNav } from "@/redux/reducers/common"
import { useUnmount } from "@/utils/FlyerHooks"
import { FormOutlined, MailOutlined } from "@ant-design/icons"
import { useMount } from "ahooks"
import { Menu, MenuProps } from "antd"
import React, { lazy, Suspense } from "react"
import { connect } from "react-redux"
import { Route, Routes, useNavigate } from "react-router-dom"
//@ts-ignore
type MenuItem = Required<MenuProps>['items'][number];

interface Props {
    hiddenNav?: boolean,
    setHiddenNav?: Function
}
const Dashboard: React.FC<Props> = ({
    hiddenNav, setHiddenNav
}) => {
    const navigate = useNavigate();
    const Overview = lazy(() => import(/* webpackPrefetch:true */ '../pages/Overview'))
    const Articles = lazy(() => import(/* webpackPrefetch:true */ '../pages/Articles'))

    

    useMount(() => {
        console.log("进入后台");
        setHiddenNav?.(true)
    })

    useUnmount(() => {
        console.log("离开后台");

        setHiddenNav?.(false)
    })

    const onSelect = (e: any) => {
        navigate(`/dashboard/${e.key}`)
    }

    const getItem = (
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
        children?: MenuItem[],
        type?: 'group',
    ): MenuItem => {
        return {
            key,
            icon,
            children,
            label,
            type,
        } as unknown as MenuItem;
    }

    const items: MenuItem[] = [
        getItem('总览', 'overview', <MailOutlined />),
        getItem('文章', 'articles', <FormOutlined />),
    ]
    return (
        <>
            <div style={{
                position: 'absolute',
                left: '0',
                right: '0',
                top: '0',
                minHeight: 'calc(100vh - 160px)',
                background: 'white',
                color: 'black',
                display: 'flex',
                flexDirection: 'row',
            }}>
                <div style={{
                    margin: '10px'
                }}>
                    <Menu
                        theme='light'
                        // onClick={onClickSilder}
                        style={{ width: 256 }}
                        defaultSelectedKeys={['overview']}
                        mode="inline"
                        items={items}
                        onSelect={onSelect}
                    />
                </div>
                <div style={{
                    margin: '10px',
                    marginTop: '14px',
                    marginRight:'20px',
                    width: '100%'
                }}>

                    <ErrorBoundary>
                        <Suspense fallback={<></>}>
                            <Routes>
                            <Route path="/" element={<Overview />} />
                                <Route path="overview" element={<Overview />} />
                                <Route path="articles" element={<Articles />} />
                            </Routes>
                        </Suspense>
                    </ErrorBoundary>


                </div>
            </div>

        </>
    )
}

export default connect((state: storeState) => ({
    hiddenNav: state.hiddenNav
}), {
    setHiddenNav
})(Dashboard)