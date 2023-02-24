import { useEventListener, useInViewport, useLatest, useMemoizedFn, useRequest, useSafeState, useSize, useThrottle, useThrottleFn, useTitle, useUpdateEffect } from 'ahooks';
import React, { ImgHTMLAttributes, useEffect, useRef, useState } from 'react';

import Layout from '@/components/Layout';
import { Title } from '../titleConfig';
import s from './index.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-component';
import { log } from '@/FlyerLog';
import $http from '@/utils/HttpService';
import classNames from 'classnames';
import { FloatButton, Spin } from 'antd';
import ImageWaterFall from './ImageWaterFall';
import { ArrowUpOutlined } from '@ant-design/icons';
import { findDOMNode } from 'react-dom';
import { siteTitle } from '@/utils/constant';

const Gallery: React.FC = () => {
    const [imgs, setImgs] = useSafeState([])
    const bottom = useRef(null)
    useTitle(`${siteTitle} | 图库`);
    // const [seeBottom] = useInViewport(bottom)

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
                setImgs((img) => img.concat(urls))
            
            }
        })
    }, { wait: 2000 })


    return (
        <>
            <div>
                <ImageWaterFall style={{
                    width: '100%',
                    height: '100vh'
                }} 
                />

            </div>

            <div ref={bottom}></div>
        </>

    );
};

export default Gallery;
