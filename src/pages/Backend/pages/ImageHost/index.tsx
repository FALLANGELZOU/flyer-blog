import { log } from "@/FlyerLog"
import { BASE_URL, getToken } from "@/utils/HttpService"
import { UploadOutlined } from "@ant-design/icons"
import { useMount } from "ahooks"
import { Button, message, Space, Upload, UploadProps } from "antd"
import React from "react"
import Masonry from "react-masonry-component"

const BEImageHost = () => {
    const getImages = () => {

    }
    useMount(() => {

    })

    const uploadProps: UploadProps = {
        name: 'file',
        action: `${BASE_URL}api/image/upload`,
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            // console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            log.debug(info.file.response)
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
        progress: {
            strokeColor: {
              '0%': '#108ee9',
              '100%': '#87d068',
            },
            strokeWidth: 3,
            format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
          },
      };

      
    return (
        <>
            <div>

                <Space wrap>
                    <div>
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>上传图片</Button>
                        </Upload>
                    </div>
                    <div>搜索图片</div>
                    <div>相册分类</div>
                </Space>

                <div>
                    <Masonry
                        updateOnEachImageLoad
                    >
                        {

                        }
                    </Masonry>
                </div>

                <div>分页</div>
            </div>
        </>
    )
}

export default BEImageHost