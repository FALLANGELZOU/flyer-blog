import { useMount, useRequest, useSafeState, useTitle, useUpdateEffect } from 'ahooks';
import React from 'react';
import { connect } from 'react-redux';

import PageTitle from '@/components/PageTitle';
import { setNavShow } from '@/redux/actions';
import { siteTitle } from '@/utils/constant';
import useTop from '@/utils/hooks/useTop';

import Aside from './Aside';
import s from './index.scss';
import Section from './Section';
import { log } from '@/FlyerLog';
import $http, { BASE_URL } from '@/utils/HttpService';
import { formatImageUrl, randomImage } from '@/api/image.api';
import { ImageDto } from '@/api/dto/common.dto';

interface Props {
  setNavShow?: Function;
}

const getPoem = require('jinrishici');

const getPoems = (count: number = 1) => {
  const all = []
  for (let i =0; i < count; i++) {
    const p = new Promise((resolve: (content: string) => void, reject) => {
      getPoem.load(
        (res: { data: { content: string; };}) => { resolve(res.data.content) },
        (error: any) => reject(error)
      )
    })
    all.push(p)
  }
  return Promise.all(all)
}


const Home: React.FC<Props> = ({ setNavShow }) => {
  useTitle(siteTitle);
  setNavShow?.(false);
  setNavShow && useTop(setNavShow);

  const [poem, setPoem] = useSafeState(new Array<string>());
  const [backgroundUrl, setBackgroundUrl] = useSafeState("")
  const {data, loading} = useRequest(() => randomImage({
    type: "pc",
    num: 1
  }))

  useMount(() => {
    getPoems(3).then((res: string[]) => { setPoem(res) });
  });

  useUpdateEffect(() => {
    if (data?.data[0]) {
      const image = data?.data[0] as ImageDto
      setBackgroundUrl(formatImageUrl(image))
    }
   
  }, [loading])
  return (
    <>
      <div style={{display:'flex', width:'100%', height:'100%', position:'relative'}}>
      <PageTitle title={siteTitle} desc={poem || [] } className={s.homeTitle} backgroundImage = {backgroundUrl}/>
      <img src={backgroundUrl}
          style={{
            display: "flex",
            objectFit: "cover",
            position: "absolute",
            height: "100vh",
            width: "100vw",
            zIndex: 0,
            top:0
          }}
        ></img>

      </div>
      
        {/* <Section /> */}
        {/* <Aside /> */}
      
    </>
  );
};

export default connect(() => ({}), { setNavShow })(Home);
