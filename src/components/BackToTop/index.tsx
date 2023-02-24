import './index.custom.scss';

import { ArrowUpOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { BackTop, FloatButton } from 'antd';
import React from 'react';
import { connect } from 'react-redux';

import { setNavShow } from '@/redux/actions';

import s from './index.scss';
import classNames from 'classnames';

interface Props {
  setNavShow?: Function;
}

const BackToTop: React.FC<Props> = ({ setNavShow }) => {
  return (
    <FloatButton.BackTop 
    icon={<ArrowUpOutlined/>} 
    style={{zIndex:'100'}}

    />
  );
};

export default connect(() => ({}), {
  setNavShow
})(BackToTop);
