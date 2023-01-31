import $http from "@/utils/HttpService";
import { useMount, useSafeState } from "ahooks";
import { Space, Table } from "antd"
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React from "react"
import Editor from "./Editor";
import s from './index.scss'

interface DataType {
    key: string;
    name: string;
    tags?: string[];
    createTime?: number;
}

const BEArticles = () => {
    const [show, setShow] = useSafeState(true)
    const [data, setData] = useSafeState<DataType[]>([])
    const [editId, setEditId] = useSafeState<string | undefined>(undefined)

    const onEdit = (data: DataType) => {
        setEditId(data.key)
        setShow(false)
    }

    const onBack = () => {
        setShow(true)
        setEditId(undefined)
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
            render: (data) => (
                <Space size="middle">
                    <a onClick={() => { onEdit(data) }}>编辑</a>
                    <a>删除</a>
                </Space>
            ),
        },
    ];
    useMount(() => {
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
    })
    


    return (
        <div>
            {show && <div>
                <Table
                    columns={columns}
                    dataSource={data}
                />
            </div>
            }

            {
                !show && <div>
                    <Editor id={editId} onBack = {onBack}></Editor>
                </div>
            }

        </div>
    )
}



export default BEArticles