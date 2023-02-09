import { useUnmount } from "@/utils/FlyerHooks";
import { useInViewport, useMount, useSafeState, useUpdateEffect } from "ahooks";
import { Spin } from "antd";
import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import s from './index.scss'

/**
 *  //  TODO: 在图片未加载之前，没有宽高，导致一定会显示在屏幕中，导致瞬间加载，导致lazy失效
 *  //  理想状态应该是有宽高，现有占位图片，然后等占位图显示之后才检测是否在视图内
 */
interface Props {
    width?: string  //  显示宽
    height?: string //  显示高
    url?: string    //  显示图片
    preUrl?: string //  缩略图
    naturalWidth?: string   //  原始宽
    naturalHeight?: string  //  原始高
    onFinish?: (props: FinishProps) => void //  图片加载完成后的回调
    placeholder?: {
        width?: string
        height?: string
        hidden?: boolean
    }
    lazy?: boolean,
    needLoadingAnimation?: boolean
}


interface FinishProps {
    width?: string  //  显示宽
    height?: string //  显示高
    naturalWidth?: string   //  原始宽
    naturalHeight?: string  //  原始高
}

const FixImageV3: React.FC<Props> = ({
    width = '100%',
    height,
    url,
    preUrl,
    naturalWidth,
    naturalHeight,
    onFinish,
    placeholder = {
        width: '100%',
        height: '426px',
    },
    needLoadingAnimation = true,
    lazy = false
}) => {
    const img = useRef<HTMLImageElement>(null)
    const layout = useRef<HTMLDivElement>(null)
    
    const [loading, setLoading] = useSafeState(needLoadingAnimation)
    const [hidden, setHidden] = useSafeState(lazy)
    const [mount, setMount] = useSafeState(false)
    const [inViewport, ratio] = useInViewport(() => layout.current);


    //  懒加载
    useUpdateEffect(() => {
        // console.log(inViewport);
        if (mount && inViewport && hidden) {
            console.log("开始懒加载");    
            //  动态显示dom树
            setHidden(false)

            //  开始加载图片
            if (img.current && url) {
                img.current.src = url
            }
        }
    }, [inViewport])

    useMount(() => {
        
        if (!lazy) {
            //  不用懒加载，直接显示
            setHidden(false)
            if (img.current && url) {
                img.current.src = url
            }
        } else {
            //  监听懒加载情况
            setMount(true)
        }
    })

    useUnmount(() => [

    ])

    //  加载图片后的回调
    const onLoad = () => {
        setLoading(false)
        //  图片加载完成后调用
        if (img.current) {
            naturalHeight = img.current.naturalHeight + 'px'
            naturalWidth = img.current.naturalWidth + 'px'
            width = img.current.offsetWidth + 'px'
            height = img.current.offsetHeight + 'px'
        }

        //  整体加载完成的回调
        onFinish?.({
            width,
            height,
            naturalHeight,
            naturalWidth
        })
    }


    return (
        <div 
            ref = {layout}
            className={classNames(s._fixImageContainerV3)} 
            // style = {hidden ? {
            //     width: placeholder.width,
            //     height: placeholder.height
            // } : {}}
            >
            <Spin 
                tip = "加载中..." 
                spinning = {loading} 
                className = {classNames({[s._hidden]: hidden})}
                style = {loading ? {
                    width: placeholder.width,
                    height: placeholder.height
                } : {}}
            >
                <img 
                src= {lazy?"":url}
                style={{
                    objectFit: 'cover',
                    width,
                    height
                }}
                ref = {img}
                onLoad = {onLoad}
                />
                
            </Spin>
        </div>
    )
}


export default FixImageV3;