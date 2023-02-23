import './index.custom.scss';


import {
  useEventListener,
  useLocalStorageState,
  useSafeState,
  useUpdateEffect
} from 'ahooks';
import { Drawer, Space } from 'antd';
import classNames from 'classnames';
import React, { HTMLAttributes, useEffect, useLayoutEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { storeState } from '@/redux/interface';
import s from './index.scss';
import Expanse from './Expanse';

const flyerNavList = [
  { name: '主页', to: '/' },
  { name: '文章', to: '/articles' },
  { name: '图库', to: '/gallery' },
  { name: '碎碎念', to: '/log' },
  { name: '关于', to: '/about' },
  { name: "测试页面", to: '/testPage'},
]
interface Props {
  hiddenNav?: boolean;
}

const Nav: React.FC<Props> = ({ hiddenNav }) => {

  const nav = useRef<HTMLDivElement>(null);
  const [show, setShow] = useSafeState(true);
  useEventListener(
    'mousewheel',
    event => {
      if (event.wheelDeltaY>0 == show) return
      event = event || window.event;
      setShow(event.wheelDeltaY > 0);

    },
    { target: document.body }
  );
    
  return (
    <>
      <Expanse show={show && !hiddenNav}>
        <div
          className={classNames(s.navContainer)}
          ref={nav}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage:"linear-gradient( 135deg, #FEB692 10%, #EA5455 100%)",
            color:"white",
            boxShadow: "6px 2px 16px 0 rgb(136 165 191 / 48%), -6px -2px 16px 0 hsl(0deg 0% 100% / 80%)",
            padding:'8px',
            fontWeight:'bold',
          }}
        >
          <Space>
            {
              flyerNavList.map((item, index) => <div key={index}><NavButton to={item.to}>{item.name}</NavButton></div>)
            }
          </Space>
        </div>

      </Expanse>


    </>
  );
};
//  connect第一个参数用来传入store的state（redux的，而不是react的，即全局状态，并且会在状态改变的时候自动更新）
//  第二个参数传入action，必须这样传入才能是可执行的action，如果直接在函数组件中调用，只能获得action的定义
export default connect(
  (state: storeState) => ({
    hiddenNav: state.hiddenNav
  }),
  { }
)(Nav);


interface NavButtonProps extends HTMLAttributes<HTMLDivElement> {
  to?: string,
  fontSize?: string
}
const NavButton: React.FC<NavButtonProps> = ({
  to,
  style,
  children,
  fontSize = '15rem'
}) => {
  return (
    <>
      <div style={{ ...style, margin: "5px" }} className={classNames(s.navButtonContainer)}>
        <NavLink to={to ? to : ''} style={{ width: '100%', height: '100%', position: 'relative', fontSize: fontSize, padding: '8px' }} >{children}</NavLink>
        <div style={{
          height: "3px",
          borderRadius: "3px",
          backgroundColor: "#91d8e4",
          width: '100%'
        }} className={classNames(s.navButtonLine)}></div>
      </div>
    </>
  )
}