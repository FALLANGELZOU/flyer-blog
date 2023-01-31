import { useMount, useSafeState } from "ahooks";
import React from "react"
import Vditor from "vditor";
import '@/styles/vditor.custom.scss'
import $http from "@/utils/HttpService";

interface Props {
    id?: string //  文章id
    onBack?: Function   //  监听返回
}
const Editor: React.FC<Props> = ({
    id,
    onBack
}) => {

    const [vd, setVd] = useSafeState<Vditor>();

    useMount(async () => {
        let value = "开始编辑"
        if (id) {
            const res = await $http.post("/api/find-article", {_id: id})
            if (res.data.code == 200 && res.data.data.md) {
                value = res.data.data.md
            }

            const vditor = new Vditor("vditor", {
                after: () => {
                    vditor.setValue(value);
                    setVd(vditor);
                    
                },
                focus: (value) => {
                    //  聚焦编辑器
                },

                "mode": "sv",
                "preview": {
                  "mode": "both"
                }
                });
        }
        
        
        
    })

    return (
        <>
            <div>编辑区</div>

            <div>
                <div id="vditor" className="vditor" />
                <div style={{
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'row-reverse',

                }}>
                    <div style={{
                        fontSize: '24px',
                        background: '#FFB4B4',
                        padding: '5px',
                        margin: '5px',
                        borderRadius: '5px'

                    }}>保存</div>
                    <div style={{
                        fontSize: '24px',
                        background: '#B2A4FF',
                        padding: '5px',
                        margin: '5px',
                        borderRadius: '5px'
                    }}>上传</div>
                    <div style={{
                        fontSize: '24px',
                        background: '#B2A4FF',
                        padding: '5px',
                        margin: '5px',
                        borderRadius: '5px'
                    }}
                    onClick = {() => {onBack?.()}}
                    >返回</div>
                </div>
            </div>
        </>
    )
}

export default Editor