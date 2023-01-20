import { log } from "@/FlyerLog";
import { useMergedRef } from "@/utils/FlyerHooks";
import { useLatest, useSafeState, useUpdate, useUpdateEffect } from "ahooks";
import classNames from "classnames";
import React, { useRef, useState } from "react";
import { forwardRef, ImgHTMLAttributes, useEffect } from "react";
import FixImageV2 from "./FixImageV2";
import Masonry from 'masonry-layout'
import s from './index.scss'
//  无限瀑布流
interface Props extends ImgHTMLAttributes<HTMLDivElement> {
    col: number,
    getter: number,
    data?: { url: string; width: number; height: number }[]
};

const FixWaterFall = forwardRef<HTMLDivElement, Props>(({
    data,
    col,
    getter
}, ref) => {
    const el = useRef<HTMLDivElement>(null)
    const mergedRef = useMergedRef(el, ref)
    const width = useLatest(0)
    const height = useLatest(0)
    const [itemWidth, setItemWidth] = useState(0)
    const [imgs, setImgs] = useSafeState<{ url: string; width: number; height: number }[]>([
        {
            url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg",
            width: 300,
            height: 450
        },
        {
            url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg",
            width: 200,
            height: 450
        },
        {
            url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg",
            width: 300,
            height: 450
        },
        {
            url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg",
            width: 300,
            height: 650
        },
        {
            url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg",
            width: 120,
            height: 250
        },
        {
            url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg",
            width: 300,
            height: 450
        },
        {
            url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg",
            width: 300,
            height: 450
        },
        {
            url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg",
            width: 300,
            height: 450
        },
        {
            url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg",
            width: 300,
            height: 450
        },
        

    ]);

    //  获取每列的宽度
    const getColumnWidth = (containWidth: number, col: number, getter: number) => {
        return ((containWidth - (col - 1) * getter)/col)
    }

    const msnry = useLatest<Masonry|undefined>(undefined)

    useEffect(() => {
        if (el.current) {
            width.current = el.current.offsetWidth
            height.current = el.current.offsetHeight
            const iWidth = getColumnWidth(width.current, col, getter)
            setItemWidth(iWidth)
        }
    }, [])

    //  计算应该显示的高度
    const calculateShowHeight = (natureHeight: number, natureWidth: number, itemWidth: number) => {

        return itemWidth/natureWidth*natureHeight
    }

    useUpdateEffect(() => {
        if (el.current != undefined) {
            //  排版引擎
            log.debug("加载瀑布流");
            msnry.current = new Masonry(el.current, {
                // options
                itemSelector: classNames(s._waterFallItem),
                columnWidth: itemWidth,
                percentPosition: true,
                gutter: getter,
     
            });
        }
                
    },[itemWidth])

    

    return (
        <>
            <div ref={mergedRef} className={classNames(s.grid)}>
                {imgs.map((item, index) => {
                    return <div key={index} style={
                        {
                            width: itemWidth + 'px',
                            height: calculateShowHeight(item.height, item.width, itemWidth) + 'px',
                            paddingBottom: getter + 'px',
                        }
                }
                        className={classNames(s._waterFallItem)}
                    >
                        <FixImageV2
                            src={item.url}
                            key={index}
                            lazy={true}
                        />
                    </div>
                })}
            </div>

        </>
    )
});

export default FixWaterFall;