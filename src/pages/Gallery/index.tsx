import { useMemoizedFn, useRequest, useSafeState } from 'ahooks';
import React, { useEffect, useRef, useState } from 'react';

import Layout from '@/components/Layout';
import { DB } from '@/utils/apis/dbConfig';
import { getData } from '@/utils/apis/getData';
import { staleTime } from '@/utils/constant';

import { Title } from '../titleConfig';
import ImgCard from './ImgCard';
import s from './index.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'masonry-layout'
import FixImageV2 from '@/common/fix/FixImageV2';
import classNames from 'classnames';
import { log } from '@/FlyerLog';
import FixWaterFall from '@/common/fix/FixWaterFall';
interface GalleryType {
  _id: string;
  cover: string;
  title: string;
  descr: string;
}
//  https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg
const Gallery: React.FC = () => {
  const { data, loading } = useRequest(getData, {
    defaultParams: [DB.Gallery],
    retryCount: 3,
    cacheKey: `Gallery-${DB.Gallery}`,
    staleTime
  });
  const returnData = [
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"},
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"},
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"},
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"}
  ]
  const [ imgs, setImgs ] = useSafeState<{ url: string; }[]>([
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"},
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"},
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"},
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"},
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"},
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"},
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"},
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"},
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"},
    {url: "https://tva4.sinaimg.cn/large/ec43126fgy1gwjqvksjruj21k410pe81.jpg"},

  ])

  const el = useRef(null);
  const [fetching, setFetching] = useSafeState(false)
  

  useEffect(() => {
  }, [])

  const fetch = async() => {
    setTimeout(() => {
      setImgs((value) => value.concat(returnData))
    }, 500);
    log.debug("当前图片加载：", imgs);
  }

  useEffect(() => {

      if (el.current != undefined) {
        

      }
    
  }, [loading])


  return (
    <>
      <Layout title={Title.Gallery} loading={loading} className={s.imgBox}>
          <FixWaterFall
            ref={el}
            col={3}
            getter = {10}
          ></FixWaterFall>
        {/* <div ref={el} style = {{
          display: 'flex',
          width: '100%',
          height: 'fit-content'
        }}>
          {imgs.map((item, index) => {
                return <div className= {classNames(s._imageContainer)} key = {index} style = {{
                  width: '300px',
                  height: '450px',
                  margin: '20px'
                }}>
                  <FixImageV2
                    src= {item.url}
                    key = { index }
                    lazy = {true}
                  />
                </div>
            })} 
        </div> */}

    </Layout>
        </>
  
  );
};

export default Gallery;
