import './global.custom.scss';

import { useLocalStorageState, useMount } from 'ahooks';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import Footer from '@/components/Footer';
import Main from '@/components/Main';
import Nav from '@/components/Nav';

import s from './App.scss';
import BackToTop from './components/BackToTop';
import { setMode } from './redux/actions';
import { storeState } from './redux/interface';
import Background from './components/Background';

interface Props {
  mode?: number;
  setMode?: Function;
}

const App: React.FC<Props> = ({ mode, setMode }) => {
  const bgClasses = [s.bg0, s.bg1, s.bg2];
  const [localMode] = useLocalStorageState('localMode');

  useMount(() => {
    if (localMode !== undefined) {
      setMode?.(localMode);
    }
  });
// bgClasses[mode!]
  return (
    <div className={classNames(s.AppBox)}>  
      <Nav />
      <Main />
      <Footer />
      <BackToTop />
      <Background/>
    </div>
  );
};

export default connect(
  (state: storeState) => ({
    mode: state.mode
  }),
  { setMode }
)(App);


// 1. useMount  挂载后，DOM插入后执行一次，类似useEffect(() => {}, [])
// 2. useUnmount  只在组件 unmount 时执行的 hook。
// 3. useUpdateEffect 忽略首次渲染，且只在依赖更新的时候才更新
// 4. useUpdate 强制重新渲染
// 5. useUnmountedRef、useMountedState  都用来判定组件是不是已被卸载，可用于避免一些组件卸载后的状态更新。
//    ahooks 实现的是 useUnmountedRef，react-use 实现的是 useMountedState

// 6. useLogger
// 7. useShallowCompareEffect、useDeepCompareEffect、useCustomCompareEffect

//  https://cloud.tencent.com/developer/article/1794247


//  其他有用的ahooks
//  https://www.cnblogs.com/amiezhang/p/14743624.html