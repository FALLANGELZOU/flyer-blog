import { setData } from "@/utils/apis/setData";
import $http from "@/utils/HttpService";
import { useLatest, useRequest, useSafeState } from "ahooks";
import { Button, Input, Modal, Popconfirm, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React from "react"

export interface FriendDto {
    name?: string;
    desc?: string;
    url?: string;
    avatar?: string;
    id?: string;
    createTime?: string;
    key?: string;
}


const BEFriends = () => {
    const [renderData, setRenderData] = useSafeState<FriendDto[]>([])
    const [open, setOpen] = useSafeState(false)
    const [confirmLoading, setConfirmLoading] = useSafeState(false)
    const [id, setId] = useSafeState<string | null>(null)
    const [friend, setFriend] = useSafeState<FriendDto>({})



    const { data, loading } = useRequest(() => $http.get("api/get-friends"), {
        onSuccess: (res, param) => {
            if (res.data.code == 200) {
                setRenderData(res.data.data.map((item: any) => ({
                    name: item.name,
                    desc: item.desc,
                    url: item.url,
                    avatar: item.avatar,
                    key: item._id,
                    id: item._id,
                    createTime: item.createTime,
                })))
            }
        }
    })

    const onEdit = (data: FriendDto, index: number) => {
        setFriend(data)
        setOpen(true)
        
    }
    const onDelete = (data: FriendDto, index: number) => {
        if (data.key) {
            $http.post("api/friend-delete", {
                _id: data.key
            }).then(res => {
                setRenderData((data) => {
                    return data.filter((currentValue, currentIndex) => {
                        return currentIndex != index
                    })
                })
            })
        } else {
            console.error("找不到友链id")
        }
    }

    const columns: ColumnsType<FriendDto> = [
        
        {
            title: '昵称',
            dataIndex: 'name',
            key: 'name',
            render: (_, data) => <a>{data.name}</a>,
        },
        {
            title: '简介',
            dataIndex: 'desc',
            key: 'desc',
            render: (_, data) => <a>{data.desc}</a>,
        },
        {
            title: '网站链接',
            dataIndex: 'url',
            key: 'url',
            ellipsis: true,
            render: (_, data) => <a>{data.url}</a>,
        },
        {
            title: '头像链接',
            dataIndex: 'avatar',
            key: 'avatar',
            ellipsis: true,
            render: (_, data) => <a>{data.avatar}</a>,
        },
        {
            title: '添加时间',
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

    const onAddFriend = () => {
        setOpen(true)
        setFriend({})
    }
    const handleOk = async () => {
        setConfirmLoading(true);
        const res = await $http.post("api/friend-update", {
            name: friend.name,
            url: friend.url,
            avatar: friend.avatar,
            desc: friend.desc,
            _id: friend.id
        })

        if (friend.id) {
            //  编辑
            setRenderData((data: any) => {
                if (res.data.code == 200) {
                    const newData = []
                    const item = res.data.data
                    const newItem = {
                        name: item.name,
                        desc: item.desc,
                        url: item.url,
                        avatar: item.avatar,
                        key: item._id,
                        id: item._id,
                        createTime: item.createTime,

                    }
                    return data.map((el: FriendDto) => {
                        if (el.key == newItem.key) {
                            return newItem
                        }
                        return el
                    })
                }
                return data
            })
        } else {
            // 新建
            setRenderData((data: any) => {
                const newData = []
                if (res.data.code == 200) {
                    const item = res.data.data
                    newData.push({
                        name: item.name,
                        desc: item.desc,
                        url: item.url,
                        avatar: item.avatar,
                        key: item._id,
                        id: item._id,
                        createTime: item.createTime,
                    })
                }
                return newData.concat(data)
            })
        }

        setConfirmLoading(false);
        setOpen(false)
        setFriend({})
    };
    const changeFriend = (f: FriendDto) => {
        console.log(f)
        const newF = {...friend}
        if (f.name != null) newF.name = f.name
        if (f.avatar != null) newF.avatar = f.avatar
        if (f.desc != null) newF.desc = f.desc
        if (f.url != null) newF.url = f.url
        setFriend(newF)
        return newF
    }
    return (

        <div>
            <div><Button type="primary" style={{ marginBottom: '10px' }} onClick={onAddFriend}>添加友链</Button></div>
            <Table
                columns={columns}
                dataSource={renderData}

            />
            <Modal
                title="新建友链"
                open={open}
                okText="确认"
                cancelText="取消"
                confirmLoading={confirmLoading}
                onCancel={() => { setOpen(false); setFriend({}) }}
                onOk={handleOk}
            >
                <div>
                    <div style={{ marginBottom: '10px', marginTop: '10px' }}>昵称：</div>
                    <Input placeholder="昵称" value={friend.name} onChange={(e) => { changeFriend({name: e.target.value}) }}></Input>
                    <div style={{ marginBottom: '10px', marginTop: '10px' }}>简介：</div>
                    <Input placeholder="简介" value={friend.desc} onChange={(e) => { changeFriend({desc: e.target.value}) }}></Input>
                    <div style={{ marginBottom: '10px', marginTop: '10px' }}>链接：</div>
                    <Input placeholder="网站链接" value={friend.url} onChange={(e) => { changeFriend({url: e.target.value}) }}></Input>
                    <div style={{ marginBottom: '10px', marginTop: '10px' }}>头像：</div>
                    <Input placeholder="头像链接" value={friend.avatar} onChange={(e) => { changeFriend({avatar: e.target.value}) }}></Input>
                    <div style={{ padding: '10px' }}></div>
                </div>
            </Modal>
        </div>
    )
}

export default BEFriends



