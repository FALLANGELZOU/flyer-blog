import { Skeleton } from 'antd';
import classNames from 'classnames';
import React, { ImgHTMLAttributes, MouseEventHandler } from 'react';

import s from './index.scss';

interface Props extends ImgHTMLAttributes<HTMLDivElement> {

  
}

const Card: React.FC<Props> = ({ 
    loading,
    children,
    className
 }) => {
  return (
    <div
        className= { classNames(className, s._cardContainer)}
        
    >
      {loading ? <Skeleton paragraph={{ rows: 2 }} /> : children}
    </div>
  );
};

export default Card;
