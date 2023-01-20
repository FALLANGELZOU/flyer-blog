import { log } from "@/FlyerLog";
import { useMergedRef, usePersist, useUpdate } from "@/utils/FlyerHooks";
import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import { forwardRef, ImgHTMLAttributes } from "react";
import s from './index.scss'
interface Props extends Omit<ImgHTMLAttributes<HTMLDivElement>, "children"> {
    src?: string,
    lazy?: boolean,
    natureWidth?: number,
    natureHeight?: number,
    needNatureSize?: boolean,
    onNatureSize?: (natureWidth: number, naturalHeight: number) => {}
}
const FixImageV2 = forwardRef<HTMLDivElement, Props>(({
    src,
    lazy = true,
    style,
    needNatureSize = false,
    natureHeight,
    natureWidth,
    onNatureSize
}, ref) => {

    const el = useRef<HTMLDivElement>(null);
    const divRef = useMergedRef(ref, el);

    //  设置背景图片
    const setBackground = (url?: string) => {
        const current = el.current
        if (url && current) {
            current.style.backgroundImage = 'url(' + url +')'
            current.classList.remove(classNames(s._lazy))
        }

        if (url && needNatureSize && (!natureHeight) && (!natureWidth)) {
            log.debug("FixImageV2: 获取图片实际大小")
            const tmp = new Image()
            tmp.src = url
            if (tmp.complete) {
                //  图片已经缓存
                natureHeight = tmp.naturalHeight,
                natureWidth = tmp.naturalWidth
                onNatureSize?.(natureWidth, natureHeight)
            } else {
                //  图片没有缓存
                tmp.onload = () => {
                    natureHeight = tmp.naturalHeight,
                    natureWidth = tmp.naturalWidth
                    onNatureSize?.(natureWidth, natureHeight)
                }
            }
        }
    }

    // 相交监听器 ref。
    const observerRef = useRef<IntersectionObserver>();

    // 清理监听器。
    const clearObserver = usePersist(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = undefined;
        }
    });

    // 监听回调。
    const handleIntersect = usePersist((entries: IntersectionObserverEntry[]) => {
        const entry = entries && entries[0];
        if (entry && entry.isIntersecting) {
            log.debug("FixImageV2: 元素进入视图")
            if (observerRef.current) {
                observerRef.current.disconnect(); // 相交事件触发后停止监听
            }
            //  移除修改标签
            setBackground(src);
        } else {
            log.debug("FixImageV2: 元素离开视图")
        }
    });
    

    observerRef.current = new IntersectionObserver(handleIntersect);


    useEffect(() => {
 
      if (lazy) {
        if (observerRef.current && el.current) {
            observerRef.current.disconnect();
            observerRef.current.observe(el.current);
        }
      }

      return () => {
        //  清除监听器
        clearObserver()
      }
    }, [])

    useUpdate(() => {
        if (lazy) {
            if (observerRef.current && el.current) {
                observerRef.current.disconnect();
                observerRef.current.observe(el.current);
            }
        }
    }, [src])
    
    return (
        <>
            <div
                ref={ divRef }
                className= { classNames(s._fixImageContainerV2, { [s._lazy]: lazy }) }
                style = {style}
            ></div>
        </>
    )
})


export default FixImageV2;