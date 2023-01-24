import { log } from "@/FlyerLog";
import { useMergedRef } from "@/utils/FlyerHooks";
import { useEventListener, useLatest, useSafeState, useSize, useUpdate, useUpdateEffect } from "ahooks";
import classNames from "classnames";
import React, { useRef, useState } from "react";
import { forwardRef, ImgHTMLAttributes, useEffect } from "react";
import Masonry from 'masonry-layout'
import s from './index.scss'
//  无限瀑布流
interface Props extends ImgHTMLAttributes<HTMLDivElement> {
    col: number,
    getter: number,
    data?: { url: string; width: number; height: number }[]
};

const FixWaterFallV2 = forwardRef<HTMLDivElement, Props>(({
    data,
    col,
    getter,
    children
}, ref) => {
    const el = useRef<HTMLDivElement>(null)
    const mergedRef = useMergedRef(el, ref)
    const width = useLatest(0)
    const height = useLatest(0)
    const [itemWidth, setItemWidth] = useState(0)

    //  获取每列的宽度
    const getColumnWidth = (containWidth: number, col: number, getter: number) => {
        return ((containWidth - (col - 1) * getter) / col)
    }

    const msnry = useLatest<Masonry | undefined>(undefined)

    useEffect(() => {
        if (el.current) {
            width.current = el.current.offsetWidth
            height.current = el.current.offsetHeight
            const iWidth = getColumnWidth(width.current, col, getter)
            setItemWidth(iWidth)
        }
        const imageLoad = imagesLoaded(classNames("#test1"))
            imageLoad.on('progress', (item) => {
                log.debug("图片")
                // msnry.current?.layout?.()
            })
    }, [])

    //  计算应该显示的高度
    const calculateShowHeight = (natureHeight: number, natureWidth: number, itemWidth: number) => {
        return itemWidth / natureWidth * natureHeight
    }

    useUpdateEffect(() => {
        if (el.current != undefined) {
            //  当宽度发生变化的时候需要重新引入排版引擎
            log.debug("加载瀑布流");
            msnry.current?.destroy?.()
            msnry.current = new Masonry(el.current, {
                // options
                itemSelector: classNames(s._waterFallItem),
                columnWidth: itemWidth,
                gutter: getter,

            });
        }
    }, [itemWidth])

    return (
        <>
            <div ref={mergedRef} className={classNames(s.grid, "#test1")}>
                {React.Children.map(children, (item, index) => {
                    return <div key={index} style={
                        {
                            width: itemWidth + 'px',
                            paddingBottom: getter + 'px',
                        }
                    }
                        className={classNames(s._waterFallItem)}
                    >
                        {item}
                    </div>
                })}
            </div>

        </>
    )
});

export default FixWaterFallV2;