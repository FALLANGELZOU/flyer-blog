import { useEventListener, useInViewport, useLatest, useMemoizedFn, useRequest, useSafeState, useSize, useThrottle, useThrottleFn, useUpdateEffect } from 'ahooks';
import React, { ImgHTMLAttributes, useEffect, useRef, useState } from 'react';

import Layout from '@/components/Layout';
import { Title } from '../titleConfig';
import s from './index.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-component';
import { log } from '@/FlyerLog';
import $http from '@/utils/HttpService';
import classNames from 'classnames';
import { Spin } from 'antd';

interface GalleryType {
  _id: string;
  cover: string;
  title: string;
  descr: string;
}

interface ImageItem {
  url: string;
  width: number;
  height: number
}
//  https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg
const Gallery: React.FC = () => {
  const [imgs, setImgs] = useSafeState<ImageItem[]>([])
  const [itemWidth, setItemWidth] = useSafeState(0)
  const masonry = useRef<any>(null)
  const col = useLatest(3)
  const el = useRef(null)
  const bottomEl = useRef(null)

  const {run: fetch} = useThrottleFn((num = 10) => {
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
  }, {wait: 2000})

  const {run: calcItemWidth, } = useThrottleFn(() => {
    if (el.current) {
      setItemWidth((el.current as HTMLDivElement).offsetWidth / col.current)
    }
  }, {
    wait: 2000
  })
  const containerSize = useSize(el);
  
  useUpdateEffect(() => {
    calcItemWidth()
  }, [containerSize?.width])


  useEffect(() => {
    fetch(20)
    calcItemWidth()
  }, [])


  const [seeBottom] = useInViewport(bottomEl)
  useUpdateEffect(() => {
    if (seeBottom) fetch(20)
  }, [seeBottom])
  // const clear = useInterval(() => {
  //   console.log("下一批数据");

  // }, 3000)


  interface ImageSealProps extends ImgHTMLAttributes<HTMLDivElement> {
    item: ImageItem
  }
  const ImageSeal: React.FC<ImageSealProps> = ({
    item,
    style,
  }) => {
    const [loading, setLoading] = useSafeState(true)
    const el = useRef(null)
    const [inViewport] = useInViewport(() => el.current, {
      rootMargin: "200px 0px 200px 0px"
    })
    const onLoad = () => {
      setLoading(false)
    }

    return (
      <div style={{
          ...style,
          paddingLeft:'5px',
          paddingRight:'5px',
          paddingBottom:'10px'
        }} ref={el} >
        {
          inViewport && <Spin
            tip="加载中..."
            spinning={loading}
            className={classNames("imageLayout")}
            style={style}
          >
            <img src={item.url}
              style={{
                width: '100%',
                height: '100%'
              }}
              loading='lazy'
              onLoad={onLoad}
            />
          </Spin>
        }


      </div>

    )
  }

  return (
    <>
      <Layout title={Title.Gallery} loading={false} className={s.imgBox}>
        <div ref={el} style={{
          width: '100%',
          height: '100%'
        }}>
          <Masonry
            ref={masonry}
            style={{
              width: "100%"
            }}
          >
            {imgs.map((item, index) => {
              return <ImageSeal
                item={item}
                key={index}
                style={{
                  width: itemWidth + 'px',
                  height: (item.height * (itemWidth / item.width)) + 'px'
                }}

              />
            })}
          </Masonry>

          <div 
          ref = {bottomEl}
          style={{
            width: '100%',
            height:'0px'
          }}></div>
        </div>
      </Layout>
    </>

  );
};

export default Gallery;
