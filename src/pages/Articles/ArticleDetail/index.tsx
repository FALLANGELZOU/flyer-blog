import FixImageV3 from "@/common/fix/FixImageV3";
import { log } from "@/FlyerLog";
import { useEventListener, useMemoizedFn, useMount, useSafeState } from "ahooks";
import { Button, message, Skeleton, Space } from "antd";
import React, { useRef } from "react";
import Vditor from 'vditor'
import '@/styles/vditor.custom.scss'
import './index.custom.scss'
import { HeartFilled, HeartOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { useLocation, useParams } from "react-router-dom";
import $http from "@/utils/HttpService";

const ArticleDetail = () => {

    const params = useParams()
    const mdLayout = useRef(null)
    const outlineLayout = useRef(null)
    const [mdValue, setMdValue] = useSafeState("")
    const [backgroundImage, setBackgroundImage] = useSafeState("https://tva1.sinaimg.cn/large/004kfMibgy1gvm87t3nc1j638o21w1ky02.jpg")  //  https://tva1.sinaimg.cn/large/004kfMibgy1gvm87t3nc1j638o21w1ky02.jpg
    const [createTime, setCreateTime] = useSafeState("2023-02-01")
    const [author, setAuthor] = useSafeState("Light_Sun")
    const [messageApi, contextHolder] = message.useMessage();
    const [active, setActive] = useSafeState(false)
    useMount(async () => {
        const id = params.id
        const res = await $http.post("/api/find-article", { _id: id })
        const data = res?.data?.data
        if (res.data.code == 200 && data) {
            setMdValue(data.md)
            if (mdLayout.current) {
                Vditor.preview(mdLayout.current,
                    data.md,
                    {
                        mode: "light",
                        anchor: 0,
                        after: () => {
                            // 渲染大纲
                            Vditor.outlineRender(mdLayout.current!, outlineLayout.current!)
                            //  渲染回调
                            setActive(true)
                            log.debug("渲染完成")
                        }
                    }
                )

            }
        }


    })


    const onClickHeart = () => {
        messageApi.open({
            type: 'success',
            content: '感谢你的喜欢！',
            duration: 3,
            icon: <HeartFilled style={{ color: "#F44336" }} />
        })
    }

    return (
        <>

            <div style={{
                width: '100%',
                backgroundColor: "rgb(234,234,234)",
                fontSize: '24px',
                minHeight: '120vh'
            }}>
                {contextHolder}
                {/* 头图区域 */}
                <div style={{ height: '40vh', }}>
                    <img
                        style={{
                            objectFit: 'cover',
                            width: "100%",
                            height: "100%"
                        }}
                        src={backgroundImage} />
                </div>
                <div style={{
                    marginLeft: '5%',
                    marginRight: '5%',
                    display: active ? 'none' :'block'
                }}>
                    <Skeleton active paragraph = {{
                        rows:4
                    }} title ></Skeleton>
                    <Skeleton active paragraph = {{
                        rows:5
                    }} title = {false} ></Skeleton>
                    <Skeleton active paragraph = {{
                        rows:3
                    }} title = {false} ></Skeleton>
                </div>

                <div style={{
                    position: 'relative',
                    top: "-10vh",
                    display: active?'flex':'none',
                    flexDirection: 'row',
                    marginLeft: '5%',
                    marginRight: '5%'
                    
                }}>
                    
                    <div style={{
                        width: '75%',
                        backgroundColor: 'white',
                        borderRadius: "10px",
                        paddingTop: '10px',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        paddingBottom: "40px"
                    }}>

                        <div>
                            <Space wrap>
                                <div>发布时间：{createTime}</div>
                                <div>|</div>
                                <div>文章字数: {mdValue.length}</div>
                            </Space>
                        </div>

                        <div>
                            <div id="markdownLayout" ref={mdLayout}></div>
                        </div>
                        <div style={{
                            color: "gray",
                            borderTop: "1px solid #eaecef",
                            paddingTop: '20px',
                            lineHeight: '1.5em'
                        }}>
                            <div style={{ fontSize: '15rem', fontWeight: 'bold' }}>文章作者：{author}</div>
                            <div style={{ fontSize: '15rem', fontWeight: 'bold' }}>©版权声明: 本博客所有文章除特別声明外，均采用 CC BY 4.0 许可协议。转载请注明来源!</div>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: '20px'
                        }}>
                            <Space wrap>
                                <Button shape="circle" size="large" style={{
                                    height: '50px',
                                    width: "50px",
                                    backgroundColor: "#F44336",
                                    color: "white",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                    onClick={onClickHeart}
                                >
                                    <HeartOutlined style={{ fontSize: '24px' }} />
                                </Button>
                            </Space>



                        </div>
                    </div>
                    <div style={{
                        width: '25%',
                        padding: '10px',
                        marginLeft: '20px',
                        backgroundColor: 'white',
                        borderRadius: "10px",
                        paddingLeft: '20px',
                        paddingRight: '16px',
                        height: 'fit-content',
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis"
                    }}>
                        <div style={{ fontSize: '18px' }}>
                            <div style={{ paddingLeft: '8px', borderBottom: "1px solid #eaecef", paddingBottom: '10px' }}>
                                <UnorderedListOutlined /> 文章目录</div>
                            <div ref={outlineLayout}></div>
                        </div>
                    </div>
                </div>
                {/* <div>猜你喜欢，下篇上篇等</div> */}
            </div>
        </>


    )
}




export default ArticleDetail;