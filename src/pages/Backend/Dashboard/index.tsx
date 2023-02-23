import ErrorBoundary from "@/components/ErrorBoundary"
import { storeState } from "@/redux/interface"
import { setHiddenNav } from "@/redux/reducers/common"
import { useUnmount } from "@/utils/FlyerHooks"
import { FileImageOutlined, FormOutlined, LogoutOutlined, MailOutlined, MessageOutlined } from "@ant-design/icons"
import { useMount, useSafeState } from "ahooks"
import { Menu, MenuProps } from "antd"
import React, { lazy, Suspense } from "react"
import { connect } from "react-redux"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
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
    const location = useLocation()
    const [path, setPath] = useSafeState("/dashboard/overview")
    const Overview = lazy(() => import(/* webpackPrefetch:true */ '../pages/Overview'))
    const Articles = lazy(() => import(/* webpackPrefetch:true */ '../pages/Articles'))
    const ImageHost = lazy(() => import(/* webpackPrefetch:true */ '../pages/ImageHost'))
    const Notes = lazy(() => import(/* webpackPrefetch:true */ '../pages/Notes'))
    //  不能在dom渲染后再设置
    if (location.pathname != path) setPath(location.pathname)

    useMount(() => {
        setHiddenNav?.(true)
        
    })

    useUnmount(() => {
        setHiddenNav?.(false)
    })

    const onSelect = (e: any) => {
        navigate(e.key)
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
        getItem('总览', '/dashboard/overview', <MailOutlined />),
        getItem('文章', '/dashboard/articles', <FormOutlined />),
        getItem('说说', '/dashboard/notes', <MessageOutlined />),
        getItem('图库', '/dashboard/image-host', <FileImageOutlined />),
        getItem('退出', '/', <LogoutOutlined />)
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
                height:'100%'
            }}>
                <div style={{
                    margin: '10px'
                }}>
                    <Menu
                        theme='light'
                        // onClick={onClickSilder}
                        style={{ width: 256 }}
                        defaultSelectedKeys={[path]}
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
                                <Route path="image-host" element={<ImageHost/>} />
                                <Route path="notes" element={<Notes/>} />
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