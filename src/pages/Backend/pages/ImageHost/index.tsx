import { getImages } from "@/api/image.api"
import { log } from "@/FlyerLog"
import { BASE_URL, getToken } from "@/utils/HttpService"
import { UploadOutlined } from "@ant-design/icons"
import { useMount, useRequest, useUpdateEffect } from "ahooks"
import { Button, message, Space, Upload, UploadProps } from "antd"
import React, { useState } from "react"
import Masonry from "react-masonry-component"
import FixMasonry, { ImageRenderInfo } from "./FixMasonry"

const BEImageHost = () => {

    const { data, loading } = useRequest(() => getImages({

    }))

    const [imageData, setImageData] = useState<ImageRenderInfo[]>([])


    useMount(() => {

    })

    useUpdateEffect(() => {
        const images: ImageRenderInfo[] = data?.data.map((item: any) => ({
            width: item.width,
            height: item.height,
            url: "http://localhost:3000/service/i/api/images/" + item.file.filePath,
            thumbUrl: item.thumbPath
        }))
        setImageData(images)
    }, [loading])

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

                <Space wrap style={{
                    paddingBottom: '20px'
                }}>
                    <div>
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined style={{color: "black"}}/>}>上传图片</Button>
                        </Upload>
                    </div>
                    <div>搜索图片</div>
                    <div>相册分类</div>
                </Space>

                <div>
                    <FixMasonry
                        renderData={imageData} 
                        renderItem={(item) => <img 
                            src = {item.url}
                            style = {{width: '100%'}}
                        ></img>}   
                        columnGetter = {5}
                        rowGetter = {5}
                        ></FixMasonry>
                </div>

                <div>分页</div>
            </div>
        </>
    )
}

export default BEImageHost