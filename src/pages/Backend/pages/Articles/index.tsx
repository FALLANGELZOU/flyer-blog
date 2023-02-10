import { log } from "@/FlyerLog";
import $http from "@/utils/HttpService";
import { useLatest, useMount, useSafeState } from "ahooks";
import { Button, Input, Popconfirm, Space, Table } from "antd"
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React from "react"
import Editor, { ArticleDto } from "./Editor";
import s from './index.scss'

interface DataType {
    key: string;
    name: string;
    tags?: string[];
    createTime?: number;
}

const BEArticles = () => {
    //  列表展示相关
    const [show, setShow] = useSafeState(true)
    const [data, setData] = useSafeState<DataType[]>([])
    const [editId, setEditId] = useSafeState<string | undefined>(undefined)
    const [editIndex, setEditIndex] = useSafeState(0)
    //  新建文章相关
    const articleTitle = useLatest("")
    const [article, setArticle] = useSafeState<ArticleDto | undefined>(undefined)



    const onEdit = (data: DataType, index: number) => {
        setEditId(data.key)
        setEditIndex(index)
        setShow(false)
    }

    const onBack = (params: any) => {
        if (editIndex == -1) {
            //  新建的文章
            getArticles()
        }
        else if (params.title) {
            setData((data) => {
                data[editIndex].name = params.title
                return data
            })
        }
        setShow(true)
        setEditId(undefined)
        setEditIndex(0)
        setArticle(undefined)
    }

    //  新建文章
    const onCreate = () => {
        setShow(false)
        setEditId(undefined)
        setEditIndex(-1)
        setArticle({
            title: articleTitle.current
        })
    }

    const getArticles = () => {
        $http.get("/api/get-article-overall").then(res => {
            const data = res.data
            if (data.code == 200) {
                const articles = data.data.map((item: any) => {
                    return {
                        key: item._id,
                        name: item.title,
                        createTime: item.createTime
                    }
                })
                setData(articles)
            }
        })
    }

    const onDelete = (data: DataType, index: number) => {
        if (data.key) {
            log.debug(data, index)
            $http.post("/api/article-delete", {
                _id: data.key
            }).then(res => {
                setData((data) => {
                    return data.filter((currentValue, currentIndex) => {
                        return currentIndex != index
                    })
                })
            })
        } else {
            log.error("找不到文章id")
        }
    }



    const columns: ColumnsType<DataType> = [
        {
            title: '文章名称',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (createTime) => <a>{createTime ? dayjs(createTime).format('YYYY-MM-DD HH:mm:ss') : "无时间"}</a>,
        },
        {
            title: '操作',
            key: 'action',
            render: (text, data, index) => (
                <Space size="middle">
                    <a onClick={() => { onEdit(data, index) }}>编辑</a>
                    <Popconfirm
                        placement="topRight"
                        title={"确认删除？"}
                        description={"删除操作不可撤回，慎重考虑！"}
                        onConfirm={() => { onDelete(data, index) }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a>删除</a>
                    </Popconfirm>

                </Space>
            ),
        },
    ];

    useMount(() => {
        getArticles()
    })



    return (
        <div>
            {show && <div>
                <div style={{
                    paddingBottom: '10px'
                }}>
                    <Space wrap>
                        <Button type="primary" onClick={onCreate}>写文章</Button>
                        <Input placeholder="文章标题" onChange={(e: any) => { articleTitle.current = e.target.value }} />
                    </Space>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                />
            </div>
            }

            {
                !show && <div>
                    <Editor id={editId} onBack={onBack} createArticle={article}></Editor>
                </div>
            }

        </div>
    )
}



export default BEArticles