import { HTMLAttributes, useRef, useState } from "react"
import React from "react"
import { render } from "react-dom"
import { useEventListener, useLatest, useMemoizedFn, useMount, useScroll, useSize, useUpdateEffect } from "ahooks"
import { hidden } from "colors"

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

        const rowHeight = new Array<number>(col).fill(0)
        for (let index = 0; index < renderData.length; index++) {
            const minRowIndex = minHeightRow(rowHeight)
            const data = renderData[index]
            const topGetter = (rowHeight[minRowIndex] == 0) ? 0 : (rowGetter||0)
            const leftGetter  = minRowIndex * (columnGetter || 0)
            const realHeight = formatHeight(data.height, data.width)
            let top = rowHeight[minRowIndex] + topGetter
            let left = itemWidth * minRowIndex + leftGetter
            rowHeight[minRowIndex] += realHeight + topGetter

            if (rowHeight[minRowIndex] > containerHeight) setContainerHeight(rowHeight[minRowIndex])
            status.push({
                index,
                top,
                left,
                show: false,
                width: itemWidth,
                height: realHeight || itemWidth
            })
        }
        setItemStatus(status)
    })



    const wrapper = useRef<HTMLDivElement>(null)
    const [col, setCol] = useState(column || 3)
    const scrollPos = useScroll(wrapper)
    const containerSize = useSize(wrapper)
    const [itemWidth, setItemWidth] = useState(0)
    const [startIndex, setStartIndex] = useState(0) //  展示开始index
    const [endIndex, setEndIndex] = useState(0) //  展示结束index
    const [itemStatus, setItemStatus] = useState<ItemStatus[]>([])
    const [length, setLength] = useState(0)
    const [containerHeight, setContainerHeight] = useState(0)
    useMount(() => {

        //  初始化数据

    })

    useUpdateEffect(() => {
        setLength(renderData.length)
        initStatus()
    }, [renderData])



    // 监听container的大小
    useUpdateEffect(() => {
        if (containerSize) {
            setItemWidth((containerSize.width - (col - 1) * (columnGetter || 0)) / col)
        }
    }, [containerSize])
    return (
        <div className="_fix_masonry">
            <div
                style={{
                    ...style,
                    position: "relative",

                }}
                className={className ? className + " _fix_masonry_container" : "_fix_masonry_container"}
                id={id}
                ref={wrapper}
            >
                {
                    renderData?.map((item, index) => {
                        return (
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
                    })
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