import { useLatest, useMount, useSafeState, useUpdateEffect } from "ahooks";
import React, { useEffect, useRef } from "react"
import Vditor from "vditor";
import '@/styles/vditor.custom.scss'
import $http, { getToken, uploadMdImageUrl } from "@/utils/HttpService";
import { Button, Input, notification, Radio, Space, Tag } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined, PlusOutlined, SmileOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { isBlank, useUpdate } from "@/utils/FlyerHooks";
import { log } from "@/FlyerLog";


interface Props {
    id?: string //  文章id
    onBack?: Function   //  监听返回
    createArticle?: ArticleDto  //  新建文章   
}

export interface ArticleDto {
    id?: string;    //  前端使用id字段
    md?: string;
    title?: string;
    createTime?: number;
    status?: string;
    _id?: string;   //  服务端传回来的数据
    tag?: string[];
}


const Editor: React.FC<Props> = ({
    id,
    onBack,
    createArticle
}) => {

    const [vd, setVd] = useSafeState<Vditor>();
    const [api, contextHolder] = notification.useNotification();
    const [title, setTitle] = useSafeState("")
    const [tags, setTags] = useSafeState<string[]>([])
    const [status, setStatus] = useSafeState("editing")



    const openSaveTost = (title: string = "保存成功", msg: string = "未知原因", success = true) => {
        api.error({
            message: title,
            description: msg,
            icon: success ? <CheckCircleOutlined style={{ color: 'green' }} /> : <ExclamationCircleOutlined style={{ color: 'red' }} />,
            placement: 'topRight'
        });
    };

    useMount(async () => {
        let value = "开始编辑"
        if (id) {
            const res = await $http.post("/api/find-article", { _id: id })
            const data = res?.data?.data
            if (res.data.code == 200 && data) {
                //  console.log(data);
                value = data.md
                setTitle(data.title)
                setTags(data.tag?data.tag:[])
                setStatus(data.status?data.status:"editing")
            }
        } else if (createArticle) {
            //  新建文章
            setTitle(createArticle.title ? createArticle.title : "")
        }


        const vditor = new Vditor("vditor", {
            after: () => {
                vditor.setValue(value);
                setVd(vditor);

            },
            focus: (value) => {
                //  聚焦编辑器
            },
            upload: {
                url: uploadMdImageUrl,
                headers: {
                    Authorization: `Bearer ${getToken()}`
                },

                format: (files: File[], responseText: string) => {
                    const data = JSON.parse(responseText)
                    let succImage = {}
                    if (data.code === 200) {
                        for(const img of data.data) {
                            // 一堆东西
                            const imgData = img.data
                            const name = (imgData.name as string).split(".")[0]
                            succImage = Object.defineProperty(succImage, name, {
                                value: imgData.links.url,
                                writable: true,
                                enumerable: true
                            })
        
                        }

                        const res = {
                            "msg": "",
                            "code": 0,
                            "data": {
                                "errFiles": [],
                                "succMap": succImage
                            }
                        }
                        log.debug(res)
                        log.debug(JSON.stringify(res))
                        return JSON.stringify(res)
                    }
                    return responseText
                }

            }
        });



    })

    const onSave = () => {
        if (vd) {
            if (isBlank(title)) {
                openSaveTost("保存失败", "标题不能为空", false)
                return

            }

            const md = vd.getValue();
            $http.post("api/article-update", {
                _id: id,
                md,
                title,
                tag: tags,
                status
            }).then(res => {
                const data = res.data
                if (data.code == 200 && data.data) {
                    openSaveTost("保存成功", "", true)
                    const article = data.data as ArticleDto | null
                    if (article) {
                        //  如果是新建的，保存之后要把id存储下来
                        id = article?._id ? article?._id : id
                    }
                } else {
                    openSaveTost("保存失败", "文章保存失败，可能原因：服务端存储失败", false)
                }
            })
        } else {
            openSaveTost("保存失败", "无法获取文章内容", false)
        }
    }

    return (
        <>
            {contextHolder}
            <Title>文章编辑区</Title>
            <Space size='middle' align="center" style={{
                marginTop: '20px',
                marginBottom: '20px'
            }}>
                <span>文章标题</span>
                <div >
                    <Input placeholder="标题" value={title} onChange={(e) => { setTitle(e.target.value) }}></Input>
                </div>
                <span>文章状态</span>
                <div>

                    <Radio.Group defaultValue="editing" value={status} onChange = {(e) => {setStatus(e.target.value)}}>
                        <Radio.Button value="editing">编辑</Radio.Button>
                        <Radio.Button value="publish">发布</Radio.Button>
                        <Radio.Button value="hidden">隐藏</Radio.Button>
                    </Radio.Group>
                </div>
            </Space>
            <div style={{
                display: 'flex',
                flexDirection: 'row'
            }}>
                <div style={{ width: '85%' }}>
                    <div id="vditor" className="vditor" />
                    <div style={{
                        marginTop: '10px',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'row-reverse',
                    }}>

                        <Space wrap>
                            <Button type="primary" onClick={onSave}>保存</Button>
                            <Button danger>删除</Button>
                            <Button type="default" onClick={() => {
                                onBack?.({
                                    title
                                })
                            }}>返回</Button>
                        </Space>
                    </div>
                </div>
                <div style={{
                    width: '15%',
                    marginLeft: '10px'
                }}>
                    <div>标签</div>
                    <TagsLayout  tagProp={tags} onTagsChange = { (newTags) => {setTags(newTags)} }/>
                </div>
            </div>

        </>
    )
}



interface TagProp {
    tagProp: string[],
    onTagsChange?: (value: string[]) => void
}
const TagsLayout: React.FC<TagProp> = ({ tagProp, onTagsChange }) => {
    const [tags, setTags] = useSafeState(tagProp);
    const [inputVisible, setInputVisible] = useSafeState(false)
    const [inputValue, setInputValue] = useSafeState("")
    const [addTagWidth, setAddTagWidth] = useSafeState(78)
    const addEl = useRef(null)

    useUpdateEffect(() => {
        setTags(tagProp)
    }, [tagProp])

    useMount(() => {
        if (addEl.current) {
            setAddTagWidth((addEl.current as HTMLElement).offsetWidth);
        }
    })

    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            const newTags = [...tags, inputValue]
            onTagsChange?.(newTags)
            setTags(newTags);
        }
        setInputVisible(false);
        setInputValue('');
    };

    const showInput = () => { setInputVisible(true); };
    //  删除标签
    const handleClose = (removedTag: string) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        onTagsChange?.(newTags)
        setTags(newTags);
    };

    const forMap = (tag: string) => {
        let color = ""
        if (tag.length > 0 && tag[0] == '!') {
            //  有颜色
            for (let i = 1; i < tag.length; i++) {
                if (tag[i] != ' ') {
                    color += tag[i]
                } else {
                    tag = tag.substring(i)
                }
            }
        }
        const tagElem = (
            <Tag
                color={color}
                style={{
                    margin: '5px'
                }}
                closable
                onClose={(e) => {
                    e.preventDefault();
                    handleClose(tag);
                }}

                onClick={(e) => {
                    console.log(e, "测试");

                }}
            >
                {tag}
            </Tag>
        );
        return (
            <span key={tag} style={{ display: 'inline-block' }}>
                {tagElem}
            </span>
        );
    };

    return (
        <div style={{
            width: '100%'
        }}>
            {tags.map(tag => forMap(tag))}
            <span style={{ display: 'inline-block', width: '100px' }}>
                {inputVisible ? (
                    <Input
                        type="text"
                        size="small"
                        style={{ width: addTagWidth }}
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value); }}
                        onBlur={handleInputConfirm}
                        onPressEnter={handleInputConfirm}
                    />
                ) : (
                    <Tag
                        ref={addEl}
                        onClick={showInput}
                        style={{ borderStyle: 'dashed' }}>
                        <PlusOutlined /> 添加标签
                    </Tag>
                )}
            </span>

        </div>
    )
}

export default Editor