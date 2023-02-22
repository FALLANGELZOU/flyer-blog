import { useMount, useSafeState, useTitle } from 'ahooks';
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
import $http from '@/utils/HttpService';

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

  useMount(() => {
    getPoems(3).then((res: string[]) => { setPoem(res) });
    $http.post('/api/images', {
      num: 1,
      sort: 'pc'
  }).then(res => {
    setBackgroundUrl("https://tvax4.sinaimg.cn/large/ec43126fgy1gwxgbt92hrj21hc0u0njz.jpg")
    //setBackgroundUrl(res.data.data[0].url)
  }).catch(err => console.log(err)
  )
  });

  return (
    <>
      <PageTitle title={siteTitle} desc={poem || [] } className={s.homeTitle} backgroundImage = {backgroundUrl}/>
      <div className={s.body}>
        {/* <Section /> */}
        {/* <Aside /> */}
      </div>
    </>
  );
};

export default connect(() => ({}), { setNavShow })(Home);
