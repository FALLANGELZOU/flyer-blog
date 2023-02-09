import { log } from "@/FlyerLog";
import { useMergedRef } from "@/utils/FlyerHooks";
import { useDebounceFn, useEventListener, useInViewport, useLatest, useMemoizedFn, useMount, useSafeState, useSize, useUpdate, useUpdateEffect } from "ahooks";
import classNames from "classnames";
import React, { useRef, useState } from "react";
import { forwardRef, ImgHTMLAttributes, useEffect } from "react";
import s from './index.scss'
import Masonry from 'react-masonry-component';
import imagesLoaded from 'imagesloaded';

//  无限瀑布流
//  总结：依靠插件实现长列表瀑布流不切实际
/**
 * 1. 根据容器宽度计算出有几列，宽度是多少
 * 2. 默认给出一个占位dom
 * 3. 先选取前20个元素，进行渲染和排序
 * 4. 当到达底部的时候，动态往dom树里面加东西
 */
interface Props extends ImgHTMLAttributes<HTMLDivElement> {
    rootEl?: any,
    usePlaceholder?: boolean,
    onShow?: Function
};


const WaterFallItem: React.FC<Props> = ({ children, rootEl, style, onShow }) => {
    const el = useRef<HTMLDivElement>(null)
    const virtualDom = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (el.current) {
            imagesLoaded(el.current).on('always', (instance) => {
                onShow?.()
            })
        }    
    })
    return (
        <div  style={style} ref={el}>
            {children}
        </div>
    )
}
const FixWaterFallV3 = forwardRef<HTMLDivElement, Props>(({
    children,
    rootEl
}, ref) => {
    const el = useRef<HTMLDivElement>(null)
    const mergedRef = useMergedRef(el, ref)
    const [masonry, setMasonry] = useSafeState<any>(null)
    const {
        run,
        cancel,
        flush
      } = useDebounceFn(
        () => {
            log.debug("瀑布无限流重新布局");
            masonry.layout()
        },
        {
            wait: 300
        }
      );
    const onShow = () => {
        run()
    }

    

    // useEffect(() => {

    // }, [])

    return (
        <>
            <div ref={mergedRef}
                style={{ width: '100%' }}
            >
                <Masonry
                    ref={function(c: any) {setMasonry((old: any) => old?old:c.masonry)}.bind(this)}
                    updateOnEachImageLoad={false}
                    style={{
                        width: "100%"
                    }}
                >
                    {
                        React.Children.map(children, (item) => {
                            return (
                                <WaterFallItem
                                    rootEl={rootEl}
                                    style = {{
                                        width:"33%",
                                    }}
                                    onShow = {onShow}
                                >
                                    {item}
                                </WaterFallItem>

                            )
                        })
                    }
                </Masonry>
            </div>
        </>
    )
});

export default FixWaterFallV3;