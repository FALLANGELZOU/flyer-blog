import { HTMLAttributes, useRef, useState } from "react"
import React from "react"
import { render } from "react-dom"
import { useEventListener, useLatest, useMemoizedFn, useMount, useScroll, useSize, useThrottleEffect, useThrottleFn, useUpdateEffect } from "ahooks"
import { hidden } from "colors"
import { AVLTree } from "./struct"
import { number } from "echarts"

interface Props extends HTMLAttributes<HTMLDivElement> {
    renderData: ImageRenderInfo[],
    renderItem: (item: ImageRenderInfo) => JSX.Element,
    column?: number,
    renderLayoutStyle?: React.CSSProperties,
    rowGetter?: number,
    columnGetter?: number
}


export interface ImageRenderInfo {
    width: number;
    height: number;
    url: string;
    thumbUrl?: string;

}

interface ItemStatus {
    index: number,
    top: number,
    left: number,
    show: boolean,
    height?: number,
    width?: number
}

const compare = (a: ItemStatus, b: ItemStatus): number => {
    if (a.top < b.top) return -1
    if (a.top > b.top) return 1
    if (a.top == b.top) {
        if (a.index < b.index) return -1
        return 1
    }
    return 0
}


const FixMasonry: (param: Props) => JSX.Element = ({
    style,
    id,
    className,
    renderData,
    renderItem,
    column,
    renderLayoutStyle,
    columnGetter,
    rowGetter
}) => {

    const minHeightRow = (rows: number[]) => {
        let index = 0
        for (let i = 0; i < rows.length; i++) {
            if (rows[index] > rows[i]) index = i
        }


        return index
    }

    const formatHeight = useMemoizedFn((height: number, width: number) => {
        return itemWidth / width * height
    })
    const initStatus = useMemoizedFn(() => {
        const status: ItemStatus[] = []
        //tree.current.clear();

        const rowHeight = new Array<number>(col).fill(0)
        for (let index = 0; index < renderData.length; index++) {
            //  calc item position
            const data = renderData[index]
            const minRowIndex = minHeightRow(rowHeight)
            const topGetter = (rowHeight[minRowIndex] == 0) ? 0 : (rowGetter||0)
            const leftGetter  = minRowIndex * (columnGetter || 0)
            const realHeight = formatHeight(data.height, data.width)
            let top = rowHeight[minRowIndex] + topGetter
            let left = itemWidth * minRowIndex + leftGetter

            //  update row height
            rowHeight[minRowIndex] += realHeight + topGetter
            const itemStatus: ItemStatus = {
                index,
                top,
                left,
                show: false,
                width: itemWidth,
                height: realHeight || itemWidth
            }
            status.push(itemStatus)
            // tree.current.insert(itemStatus)
            tree.insert(itemStatus)
        }
        //  update container height
        let maxHeight = 0
        for(let i of rowHeight) {
            if (i > maxHeight) maxHeight = i
        }
        if (maxHeight > containerHeight) setContainerHeight(maxHeight)
        setItemStatus(status)
        return maxHeight
    })

    const updateItemWidth = useMemoizedFn((width: number) => {
        setItemWidth((width - (col - 1) * (columnGetter || 0)) / col)
    })

    const {run: updateShowIndex} = useThrottleFn(() => {
        if (wrapper.current) {
            const info = wrapper.current.getBoundingClientRect()
            const padding = window.innerHeight / 2
            const bottom = window.innerHeight - info.bottom
            const top = info.top 
            
            if (top < 0) {
                //  更新开始index
                const up = - (top + padding)
                const item = tree.upper({
                    top: up,
                    index: length,
                    left: 0,
                    show: false
                })
                
                
                if (item && item.key.index != startIndex) setStartIndex(item.key.index)
            }
           
            if (bottom < 0) {
                const down = containerHeight + bottom + padding
                const item = tree.lower({
                    top: down,
                    index: -1,
                    left: 0,
                    show: false
                })
                if (item && item.key.index != endIndex) setEndIndex(item.key.index)
            }
        }
    }, {
        wait: 200
    })

    const renderDataFromStartToEnd = useMemoizedFn((start: number, end: number) => {

        if (!renderData) return <></>
        if (start < 0) start = 0
        if (end >= length) end = length - 1

        const res = []
        for(let index = start; index <= end; index ++) {
            const item = renderData[index]
            res.push(
                <div
                    className="_fix_masonry_item_layout"
                    key={index}
                    style={{
                        position: "absolute",
                        width: itemWidth,
                        overflow: "hidden",
                        left: itemStatus?.[index]?.left,
                        top: itemStatus?.[index]?.top,
                        ...renderLayoutStyle
                    }}>
                    {renderItem(item)}
                </div>
            )
        }

        // renderData?.map((item, index) => {
        //     return (
        //         <div
        //             className="_fix_masonry_item_layout"
        //             key={index}
        //             style={{
        //                 position: "absolute",
        //                 width: itemWidth,
        //                 overflow: "hidden",
        //                 left: itemStatus?.[index]?.left,
        //                 top: itemStatus?.[index]?.top,
        //                 ...renderLayoutStyle
        //             }}>
        //             {renderItem(item)}
        //         </div>
        //     )
        // })
        return res
    }
    )


    const [tree, setTree] = useState(new AVLTree<ItemStatus>(compare))
    const wrapper = useRef<HTMLDivElement>(null)
    const [col, setCol] = useState(column || 3)
    const scrollPos = useScroll(wrapper)
    const containerSize = useSize(wrapper)
    const [itemWidth, setItemWidth] = useState(0)
    const [startIndex, setStartIndex] = useState(0) //  start index
    const [endIndex, setEndIndex] = useState(-1) //  end index
    const [itemStatus, setItemStatus] = useState<ItemStatus[]>([])
    const [length, setLength] = useState(0)
    const [containerHeight, setContainerHeight] = useState(0)
    const [containerWidth, setContainerWidth] = useState(0)


    useMount(() => {})

    useUpdateEffect(() => {
        setLength(renderData.length)
        initStatus()
        //updateShowIndex()
    }, [renderData])

    useEventListener("scroll", (event) => {
        updateShowIndex()
    });

    useUpdateEffect(() => {
        updateShowIndex()
    }, [containerHeight])
    

    // monitor container size
    useUpdateEffect(() => {
        if (containerSize && containerSize.width != containerWidth) {
            setContainerWidth(containerSize.width)
            updateItemWidth(containerSize.width)
        }
    }, [containerSize])


    return (
        <div className="_fix_masonry">
            <div
                style={{
                    ...style,
                    position: "relative",
                    height: containerHeight
                }}
                className={className ? className + " _fix_masonry_container" : "_fix_masonry_container"}
                id={id}
                ref={wrapper}
            >
                {
                    renderDataFromStartToEnd(startIndex, endIndex)
                }
            </div>
            <div
                className="_fix_masonry_fill"
                style={{
                    height: containerHeight
                }}></div>
        </div>

    )

}


export default FixMasonry