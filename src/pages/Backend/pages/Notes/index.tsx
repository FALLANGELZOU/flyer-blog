import { setData } from "@/utils/apis/setData";
import $http from "@/utils/HttpService";
import { useLatest, useRequest, useSafeState } from "ahooks";
import { Button, Modal, Popconfirm, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React from "react"

export interface NoteDto {
    key?: string;
    id?: string,
    createTime?: string,
    message?: string
}


const BENotes = () => {
    const [renderData, setRenderData] = useSafeState<NoteDto[]>([])
    const [open, setOpen] = useSafeState(false)
    const [confirmLoading, setConfirmLoading] = useSafeState(false)
    const [noteValue, setNoteValue] = useSafeState("")
    const [noteId, setNoteId] = useSafeState<string|null>(null)

    const { data, loading } = useRequest(() => $http.get("api/get-notes"), {
        onSuccess: (res, param) => {
            if (res.data.code == 200) {
  
                setRenderData(res.data.data.map((item: any) => ({
                    key: item._id,
                    id: item.id,
                    createTime: item.createTime,
                    message: item.message
                })))
            }
        }
    })

    const onEdit = (data: NoteDto, index: number) => {
        setOpen(true)
        setNoteValue(data.message ? data.message : "")
        setNoteId(data.key ? data.key : null)
    }
    const onDelete = (data: NoteDto, index: number) => {
        if (data.key) {
            $http.post("api/note-delete", {
                _id: data.key
            }).then(res => {
                setRenderData((data) => {
                    return data.filter((currentValue, currentIndex) => {
                        return currentIndex != index
                    })
                })
            })
        } else {
            console.error("找不到文章id")
        }
    }

    const columns: ColumnsType<NoteDto> = [
        {
            title: '内容',
            dataIndex: 'contents',
            key: 'contents',
            render: (_, data) => <a>{data.message}</a>,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (_, data) => <a>{data.createTime ? dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss') : "无时间"}</a>,
        },
        {
            title: '操作',
            key: 'action',
            render: (_, data, index) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => { onEdit(data, index) }}>编辑</Button>
                    <Popconfirm
                        placement="topRight"
                        title={"确认删除？"}
                        description={"删除操作不可撤回，慎重考虑！"}
                        onConfirm={() => { onDelete(data, index) }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const onAddNote = () => {
        setOpen(true)
        setNoteId(null)
        setNoteValue("")
    }
    const handleOk = async () => {
        setConfirmLoading(true);
        const res = await $http.post("api/note-update", {
            message: noteValue,
            _id: noteId
        })

        if (noteId) {
            setRenderData((data: any) => { 
                if (res.data.code == 200) {
                    const newData = []
                    const item = res.data.data
                    const newItem = {
                        key: item._id,
                        id: item.id,
                        createTime: item.createTime,
                        message: item.message
                    }
                    return data.map((el: NoteDto) => {
                        if (el.key == newItem.key){
                            return newItem
                        }
                        return el
                    })
                }
                return data
            })
        } else {
            setRenderData((data: any) => {
                const newData = []
                if (res.data.code == 200) {
                    const item = res.data.data          
                    newData.push({
                        key: item._id,
                        id: item.id,
                        createTime: item.createTime,
                        message: item.message
                    })
                }
                return newData.concat(data)
            })
        }
        
        setConfirmLoading(false);
        setOpen(false)
        setNoteValue("")
        
    };

    return (

        <div>
            <div><Button type="primary" style={{ marginBottom: '10px' }} onClick={onAddNote}>写说说</Button></div>
            <Table
                columns={columns}
                dataSource={renderData}

            />
            <Modal
                title="新建说说"
                open={open}
                okText="确认"
                cancelText="取消"
                confirmLoading={confirmLoading}
                onCancel={() => { setOpen(false); setNoteValue(""); setNoteId(null); }}
                onOk={handleOk}
            >
                <TextArea
                    placeholder="输入说说内容..."
                    value = {noteValue}
                    autoSize={{ minRows: 4 }}
                    onChange={(item) => { setNoteValue(item.target.value) }}
                />
            </Modal>
        </div>
    )
}

export default BENotes



