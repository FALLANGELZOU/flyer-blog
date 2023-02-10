import FixImageV3 from "@/common/fix/FixImageV3";
import { log } from "@/FlyerLog";
import { useMemoizedFn, useMount, useSafeState } from "ahooks";
import { Button, message, Space } from "antd";
import React, { useRef } from "react";
import Vditor from 'vditor'
import '@/styles/vditor.custom.scss'
import './index.custom.scss'
import { HeartFilled, HeartOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";

const ArticleDetail = () => {

    const data = "# Hello Blog\n\n## 启程\n\n第一篇blog诞生了。🎉️ 🎉️\n\n我们可以使用工具 pprof 来进行性能分析。包括：CPU、内存、堵塞、Mutex。（对于相关的问题，见文章 [[内存泄漏]]）\n为了分析，我们首先需要确保服务端 [[#enable pprof]]，然后我们再 [[#访问 pprof]]。\n\n## 访问 pprof\n\n就和大部分工具一样（比如覆盖率分析 `go tool cover`，见 [[计算机/编程语言/Go/相关操作/测试|Go 的测试]]）、我们可以使用 `go tool` 来调用 pprof 工具：\n\n```shell\ngo tool pprof <http-api>\n# http-api 形式如：http://localhost:7979/debug/pprof/profile?seconds=60\n```\n\n一般来说，提供 pprof 服务的服务器，都是在 path `/debug/pprof` 上提供的（当然这个还是取决于具体应用吧），有子路径：\n\n- `/debug/pprof/heap` - 内存分析。可以分析内存泄漏。\n- `/debug/pprof/goroutine` - [[goroutine]] 分析，一般来说如果内存泄漏了，有一定的原因是因为 [[goroutine]] 过多导致的。\n\n当然，我们还有一些有用的参数，比如：\n\n- `-http=[0.0.0.0:8080](http://0.0.0.0:8080)\\`，在 8080 端口提供 HTTP 可视化接口。我们可以提供 `?debug=2`，并使用 `curl` 直接获取。\n\n## enable pprof\n\n首先提供 pprof 的在库 \\`net/http/pprof\\` 中。我们只需要 link 这个包即可：\n\n```go\nimport _ \"net/http/pprof\"\n```\n\n上面的包会默认注入到 `DefaultServeMux` 中。但是如果我们没有使用 `DefaultServeMux`，那么我们必须手动注册一个。\n在不同的 web 框架中，我们甚至有不同的 pprof 库。在 gin 中，我们可以选择使用 `github.com/gin-contrib/pprof`。我们可以直接：\n\n```go\npprof.Register(app)\n```\n"




    const mdLayout = useRef(null)
    const outlineLayout = useRef(null)
    const [mdValue, setMdValue] = useSafeState(data)
    const [backgroundImage, setBackgroundImage] = useSafeState("https://tva1.sinaimg.cn/large/004kfMibgy1gvm87t3nc1j638o21w1ky02.jpg")  //  https://tva1.sinaimg.cn/large/004kfMibgy1gvm87t3nc1j638o21w1ky02.jpg
    const [createTime, setCreateTime] = useSafeState("2023-02-01")
    const [author, setAuthor] = useSafeState("Light_Sun")
    const [messageApi, contextHolder] = message.useMessage();


    useMount(async () => {
        if (mdLayout.current) {
            Vditor.preview(mdLayout.current,
                mdValue,
                {
                    mode: "light",
                    anchor: 0,
                    after: () => {
                        // 渲染大纲
                        Vditor.outlineRender(mdLayout.current!, outlineLayout.current!)
                    }
                }
            )

        }

    })


    const onClickHeart = () => {
        messageApi.open({
            type: 'success',
            content: '感谢你的喜欢！',
            duration: 3,
            icon: <HeartFilled style={{color: "#F44336"}}/>
        })
    }

    return (
        <div style={{
            width: '100%',
            backgroundColor: "rgb(234,234,234)",
            fontSize: '24px'
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

                position: 'relative',
                top: "-10vh",
                display: 'flex',
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
                        <div>文章作者：{author}</div>
                        <div>©版权声明: 本博客所有文章除特別声明外，均采用 CC BY 4.0 许可协议。转载请注明来源!</div>
                    </div>

                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop:'20px'
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

    )
}




export default ArticleDetail;