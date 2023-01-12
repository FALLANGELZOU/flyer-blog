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
import React, { createRef, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { setMode, setNavShow } from '@/redux/actions';
import { storeState } from '@/redux/interface';
import { blogAdminUrl } from '@/utils/constant';
import { modeMap, modeMapArr } from '@/utils/modeMap';

import { useLinkList, flyerNavList } from './config';
import s from './index.scss';
import FixButton from '@/common/fix/FixButton';

interface Props {
  navShow?: boolean;
  setNavShow?: Function;
  mode?: number;
  setMode?: Function;
}

const bodyStyle = window.document.getElementsByTagName('body')[0].style;

const Nav: React.FC<Props> = ({ navShow, setNavShow, mode, setMode }) => {
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [_, setLocalMode] = useLocalStorageState('localMode');
  const { navArr, secondNavArr, mobileNavArr } = useLinkList();
  const [visible, setVisible] = useSafeState(false);
  const [lineVisible, setLineVisible] = useSafeState(false)
  const modeOptions = ['rgb(19, 38, 36)', 'rgb(110, 180, 214)', 'rgb(171, 194, 208)'];

  const navLine = createRef<HTMLDivElement>();
  const navButtons: React.RefObject<HTMLAnchorElement>[] = []
  navArr.forEach(e => {
    navButtons.push(createRef<HTMLAnchorElement>())
  })

  useEventListener(
    'mousewheel',
    event => {
      //  滚轮事件监听
      event = event || window.event;
      setNavShow!(event.wheelDeltaY > 0);
    },
    { target: document.body }
  );

  useUpdateEffect(() => {
    setLocalMode(mode);
    for (const type of modeMapArr) {
      bodyStyle.setProperty(type, modeMap[type as keyof typeof modeMap][mode!]);
    }
  }, [mode]);

  const location = useLocation();
  //  初始化，只执行一次，此时已经挂在真实dom
  useEffect(() => {
    navButtons.forEach(e => {
      setNavLine(navLine.current, e.current)
    })
  }, [])

  const setNavLine = (navLine: HTMLDivElement | null, navButton: HTMLAnchorElement | null) => {
    if (navLine == null || navButton == null) return
    if (location.pathname == navButton.pathname) {
      if (lineVisible == false) setLineVisible(true);
      navLine.style.left = navButton.offsetLeft + "px";
    }
  }

  return (
    <>
      <div className= {classNames(s.nav, { [s.hiddenNav]: !navShow }, 'nav_group')}>
        {
          flyerNavList.map((item, index) => {
              return (
                <FixButton
                  text = {item.name}
                  key = {index}
                  style = {{
                    marginLeft: "20px",
                    marginRight: "20px"
                  }}
                  to = {item.to}
                />
              )
          })
        }
      </div>

    </>
  );
};

export default connect(
  (state: storeState) => ({
    navShow: state.navShow,
    mode: state.mode
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