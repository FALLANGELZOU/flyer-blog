import { log } from '@/FlyerLog';
import $http from '@/utils/HttpService';
import { useInViewport, useLatest, useSafeState, useThrottleFn, useUpdateEffect } from 'ahooks';
import React, { HTMLAttributes, ImgHTMLAttributes, useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import "./index.custom.scss"
import {
    CellMeasurer,
    CellMeasurerCache,
    createMasonryCellPositioner,
    Masonry,
    MasonryCellProps,
    OnScrollCallback,
    Positioner,
} from 'react-virtualized';

interface MasonryComponentProp {
    itemsWithSizes: any,
    onScroll?: Function
}
const MasonryComponent: React.FC<MasonryComponentProp> = ({
    itemsWithSizes,
    onScroll
}) => {
    //  默认设置
    const [containerWidth, setContainerWidth] = useSafeState(0)
    const [containerHeight, setContainerHeight] = useSafeState(0)


    const defaultHeight = 250;
    const defaultWidth = 200;

    const bottomEl = useRef(null)

    const el = useRef<HTMLDivElement>(null)
    const [show, setShow] = useSafeState(false)


    const mel = useRef(null)

    const init = () => {
        
 

        const cache = new CellMeasurerCache({
            defaultHeight,
            defaultWidth,
            fixedWidth: true,
        })
    
        const cellPositioner = createMasonryCellPositioner({
            cellMeasurerCache: cache,
            columnCount: 3,
            columnWidth: containerWidth / 3,
            spacer: 10,
        });

       

        const cellRenderer = ({ index, key, parent, style }: MasonryCellProps) => {
            const { url, width, height } = itemsWithSizes[index];
            const columnWidth = containerWidth / 3
            const columnHeight = columnWidth * (height / width) || defaultHeight;
            return (
                <CellMeasurer cache={cache} index={index} key={`${key}`} parent={parent}>
                    <div style={style}>
                        <img
                            className='fade'
                            src={url}
                            style={{
                                height: columnHeight,
                                width: columnWidth,
                            }}
                        />

                    </div>
                </CellMeasurer>
            );
        }

        return (
            <Masonry
                ref={mel}
                cellCount={itemsWithSizes.length}
                cellMeasurerCache={cache}
                cellPositioner={cellPositioner}
                cellRenderer={cellRenderer}
                height={containerHeight}
                width={containerWidth}
                autoHeight={false}
                
                onScroll = {(param: { clientHeight: number; scrollHeight: number; scrollTop: number }) => {
                    onScroll?.(param)
                    if (param.scrollTop + param.clientHeight + 200 >= param.scrollHeight) {
                    
                    }
                }}
            />
        )
    }



    

    useEffect(() => {
        if (el.current) {
            setContainerHeight(el.current.offsetHeight)
            setContainerWidth(el.current.offsetWidth)
            init()

            setShow(true)
        }
    }, [])
    return (
        <div style={{
            width: '100%',
            height: '100%'
        }}
            ref={el}
        >
            {
                show && <>
                    {init()}
                    <div
                        ref={bottomEl}
                        style={{
                            width: '100%',
                            height: '0px'
                        }}></div>
                </>
            }

        </div>

    );
};

interface Props extends HTMLAttributes<HTMLDivElement> {
    onScroll?: (param: any) => void
}

const ImageWaterFall: React.FC<Props> = ({
    className,
    style,
    id,
    onScroll
}) => {

    const [noCacheList, setNoCacheList] = useSafeState([])
    const { run: fetch } = useThrottleFn((num = 10) => {
        $http.post("api/images", {
            num
        }).then((_) => {
            const res = _.data
            if (res.code == 200) {
                const urls = res.data.map((item: any, index: number) => {
                    return {
                        key: index,
                        url: item.url + '?noCache=' + Math.random(),
                        width: item.width,
                        height: item.height
                    }
                })
                setNoCacheList(list => list.concat(urls))
    
            }
        })
    }, { wait: 2000 })

    useEffect(() => {
        fetch(200)
    }, [])

    //  不能动态添加数据
    const innerOnScroll = (param: { clientHeight: number; scrollHeight: number; scrollTop: number }) => {

    }

    return (
        <div
            className={className}
            style={style}
            id = {id}
        >
            <MasonryComponent
                itemsWithSizes={noCacheList}
                onScroll = {(param: any) => {onScroll?.(param); innerOnScroll(param)}}
            />
        </div>


    )
}


export default ImageWaterFall
