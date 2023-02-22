import { log } from '@/FlyerLog';
import $http from '@/utils/HttpService';
import { useSafeState, useThrottleFn } from 'ahooks';
import React, { ImgHTMLAttributes, useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import "./index.custom.scss"
import {
    CellMeasurer,
    CellMeasurerCache,
    createMasonryCellPositioner,
    Masonry,
    MasonryCellProps,
    Positioner,
} from 'react-virtualized';

interface MasonryComponentProp {
    itemsWithSizes: any
}
const MasonryComponent: React.FC<MasonryComponentProp> = ({
    itemsWithSizes
}) => {
    //  默认设置
    const [containerWidth, setContainerWidth] = useSafeState(0)
    const [containerHeight, setContainerHeight] = useSafeState(0)


    const defaultHeight = 250;
    const defaultWidth = 200;

    const bottomEl = useRef(null)
    const el = useRef<HTMLDivElement>(null)
    const [show, setShow] = useSafeState(false)



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
                <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
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
                cellCount={itemsWithSizes.length}
                cellMeasurerCache={cache}
                cellPositioner={cellPositioner}
                cellRenderer={cellRenderer}
                height={containerHeight}
                width={containerWidth}
                autoHeight={false}
            />
        )
    }





    useEffect(() => {
        if (el.current) {
            //setColumnWidth(el.current.offsetWidth)

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

interface Props extends ImgHTMLAttributes<HTMLDivElement> {
}

const ImageWaterFall: React.FC<Props> = ({
    className,
    style
}) => {

    const [noCacheList, setNoCacheList] = useSafeState([])
    const { run: fetch } = useThrottleFn((num = 10) => {
        $http.post("api/images", {
            num
        }).then((_) => {
            const res = _.data
            if (res.code == 200) {
                const urls = res.data.map((item: any) => {
                    return {
                        url: item.url,
                        width: item.width,
                        height: item.height
                    }
                })
                setNoCacheList(list => list.concat(urls))
                //setImgs((img) => img.concat(urls))
            }
        })
    }, { wait: 2000 })

    useEffect(() => {
        fetch(100)
    }, [])
    return (
        <div
            className={className}
            style={style}
        >
            <MasonryComponent
                itemsWithSizes={noCacheList}
            />
        </div>


    )
}


export default ImageWaterFall
