import { log } from '@/FlyerLog';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js'
import Background from '../Background';
import s from './index.scss';

interface Props {
  title?: string;
  desc?: string[];
  className?: string;
  backgroundImage?: string;
}

const PageTitle: React.FC<Props> = ({ title, desc, className, children, backgroundImage = "" }) => {

  const typedElement = useRef(null)
  const typed = useRef<React.MutableRefObject<Typed>>(null)
  useEffect(() => {

    return () => {
      (typed.current as any)?.destroy();
    }
  }, [])

  useEffect(() => {
    if (desc != undefined && desc != null && desc.length != 0) {
      (typed.current as any)?.destroy();  //  如果挂载实例了，则销毁
      (typed.current as any) = new Typed(typedElement.current as any, {
        strings: desc,
        typeSpeed: 50,
        backSpeed: 50,
        cursorChar: '|',
        autoInsertCss: true,
        backDelay: 1000 * 5,
        loop: true
      })
    }
  }, [desc])

  return (
    <div className={classNames(s.box, className)} style={{

    }}>
      <div className={s.title} style={{zIndex:1}}>{title}</div>
      <div style={{zIndex:1}}>
        <span ref={typedElement} className={classNames(s.desc, s["typed-cursor"])}></span>
      </div>

      {children}
    </div>

  );
};

export default PageTitle;
