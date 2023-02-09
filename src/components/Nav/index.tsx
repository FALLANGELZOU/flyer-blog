import './index.custom.scss';

import {
  BgColorsOutlined,
  CheckOutlined,
  HomeOutlined,
  MenuOutlined,
  SettingOutlined
} from '@ant-design/icons';
import {
  useEventListener,
  useLocalStorageState,
  useSafeState,
  useUpdateEffect
} from 'ahooks';
import { Drawer } from 'antd';
import classNames from 'classnames';
import React, { createRef, FC, useEffect, useLayoutEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { setMode, setNavShow } from '@/redux/actions';
import { storeState } from '@/redux/interface';
import { blogAdminUrl } from '@/utils/constant';
import { modeMap, modeMapArr } from '@/utils/modeMap';

import { useLinkList, flyerNavList } from './config';
import s from './index.scss';
import FixButton from '@/common/fix/FixButton';
import { log } from '@/FlyerLog';

interface Props {
  navShow?: boolean;
  setNavShow?: Function;
  mode?: number;
  setMode?: Function;
  hiddenNav?: boolean;
}

const bodyStyle = window.document.getElementsByTagName('body')[0].style;

const Nav: React.FC<Props> = ({ navShow, setNavShow, mode, setMode, hiddenNav }) => {
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [_, setLocalMode] = useLocalStorageState('localMode');
  const { navArr, secondNavArr, mobileNavArr } = useLinkList();
  const [visible, setVisible] = useSafeState(false);
  const [lineVisible, setLineVisible] = useSafeState(false)
  const modeOptions = ['rgb(19, 38, 36)', 'rgb(110, 180, 214)', 'rgb(171, 194, 208)'];

  const navLine = createRef<HTMLDivElement>();
  const navButtons: any[]  = []
  const location = useLocation();


  flyerNavList.forEach(e => {
    navButtons.push(useRef())
  })
  useEventListener(
    'mousewheel',
    event => {
      if (hiddenNav) return
      //  滚轮事件监听
      event = event || window.event;
      setNavShow!(event.wheelDeltaY > 0);

    },
    { target: document.body }
  );

  useEventListener(
    'resize',
    event => {
      //  这么写，性能不太好
      navButtons.forEach(e => {
        setNavLine?.(navLine.current, e.current, true)
      })
    }
  )

  useUpdateEffect(() => {
    setLocalMode(mode);
    for (const type of modeMapArr) {
      bodyStyle.setProperty(type, modeMap[type as keyof typeof modeMap][mode!]);
    }
  }, [mode]);

  //  初始化，只执行一次，此时已经挂在真实dom
  useEffect(() => {
    navButtons.forEach(e => {
      setNavLine(navLine.current, e.current, true)
    })
  }, [])

  //  TODO: 目前判断下划线是通过路由匹配的，但是如果两个路由一样就会出问题
  const setNavLine = (navLine: HTMLDivElement | null, navButton: any | null, first = false) => {
    if (navLine == null || navButton == null) {
      log.debug("navLine或navButton为null", navLine, navButton)
      return
    }
    if (first) {
      if (location.pathname == navButton.pathname) {
        if (lineVisible == false) {
          setLineVisible(true);
        }
        navLine.style.left = navButton.offsetLeft + "px";
        navLine.style.transitionDuration = "200ms";
        navLine.style.width = window.getComputedStyle(navButton).width  
        //  console.log(window.getComputedStyle(navButton).width);
         
      }
    } else {
        if (lineVisible == false) {
          setLineVisible(true);
        }
        navLine.style.transform = `translateX(${navButton.offsetLeft - navLine.offsetLeft}px)`;
        navLine.style.transitionDuration = "200ms";
        navLine.style.width = window.getComputedStyle(navButton).width
      }
    

  }

  return (
    <>
      <div className= {classNames(s.nav, { [s.hiddenNav]: (hiddenNav || !navShow) }, 'nav_group')}>
        {
          flyerNavList.map((item, index) => {
              return (
                <FixButton
                  text = {item.name}
                  key = {index}
                  style = {{
                    paddingLeft: "20px",
                    paddingRight: "20px"
                  }}
                  to = {item.to}
                  ref = { navButtons[index] }
                  onClick = {(e) => {
                    setNavLine(navLine.current, e.currentTarget)
                  }}
                  id = {index}
                />
              )
          })
        }
        <div className= {classNames(s.navLine)} ref = { navLine } 
        style = {{display: lineVisible ? "block" : "none"}}
        />
      </div>

    </>
  );
};
//  connect第一个参数用来传入store的state（redux的，而不是react的，即全局状态，并且会在状态改变的时候自动更新）
//  第二个参数传入action，必须这样传入才能是可执行的action，如果直接在函数组件中调用，只能获得action的定义
export default connect(
  (state: storeState) => ({
    navShow: state.navShow,
    mode: state.mode,
    hiddenNav: state.hiddenNav
  }),
  { setNavShow, setMode }
)(Nav);



{/* <nav className={classNames(s.nav, { [s.hiddenNav]: !navShow })}>
        <div className={s.navContent}>
          
          <div className={s.homeBtn} onClick={() => navigate('/')}>
            <HomeOutlined />
          </div>

          
          <a className={s.adminBtn} href={blogAdminUrl} target='_blank' rel='noreferrer'>
            <SettingOutlined />
          </a>

          
          <div className={s.modeBtn}>
            <BgColorsOutlined />
            <div className={s.modeOpions}>
              {modeOptions.map((backgroundColor, index) => (
                <div
                  key={index}
                  style={{ backgroundColor }}
                  className={classNames(s.modeItem, s[`modeItem${index}`])}
                  onClick={() => setMode?.(index)}
                >
                  <CheckOutlined style={{ display: mode === index ? 'block' : 'none' }} />
                </div>
              ))}
            </div>
          </div>

        
          <div className={s.articlesBtn}>
            <div className={s.articelsSecond}>
              {secondNavArr.map((item, index) => (
                <NavLink
                  className={({ isActive }) =>
                    isActive ? s.sedActive : s.articelsSecondItem
                  }
                  to={item.to}
                  key={index}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
            文章
          </div>

       
          {navArr.map((item, index) => {
            return (
            <NavLink
              className={({ isActive }) => (isActive ? s.navActive : s.navBtn)}
              to={item.to}
              key={index}
              onClick = { (e) => {
                if (lineVisible == false) {
                  setLineVisible(true);
                  const current = navLine.current
                  if (current != undefined) {
                    current.style.left = e.currentTarget.offsetLeft + "px";
                    return
                  }
                }
                const current = navLine.current
                if (current != undefined) {
                  current.style.transform = `translateX(${e.currentTarget.offsetLeft - current.offsetLeft}px)`;
                  current.style.transitionDuration = "200ms";
                }
                console.log(e.currentTarget.offsetLeft);
                
              } }

              ref = {navButtons[index]}
            >
              {item.name}
            </NavLink>
          )}
          )}
        
        <div className= {classNames(s.navLine)} ref = { navLine } style = {{display: lineVisible ? "block" : "none"}}></div>
        </div>
        
      </nav> */}