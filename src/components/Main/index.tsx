import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ErrorBoundary from '@/components/ErrorBoundary';

import s from './index.scss';
import { useMount, useSafeState } from 'ahooks';
import $http from '@/utils/HttpService';

const Home = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Home'));
const Articles = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Articles'));
const Classes = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Classes'));
const Tags = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Tags'));
const Gallery = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Gallery'));
const Img = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Img'));
const Say = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Say'));
const Msg = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Msg'));
const Log = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Log'));
const About = lazy(() => import(/* webpackPrefetch:true */ '@/pages/About'));
const Post = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Post'));
const Friends = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Friends'));
const TestPage = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Test'))

//  后台页面
const Backend = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Backend'))
const Dashboard = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Backend/Dashboard'))
const Login = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Backend/Login'))
const Main: React.FC = () => {

  return (
    <main className={s.main} id = "main_root">
      <div className={s.center}>
        <ErrorBoundary>
          <Suspense fallback={<></>}>
            <Routes>
              {/* 前端 */}
              <Route path='/' element={<Home />} />
              <Route path='articles/*' element={<Articles />} />
              
              <Route path='classes' element={<Classes />} />
              <Route path='tags' element={<Tags />} />
              <Route path='gallery' element={<Gallery />} />
              <Route path='img' element={<Img />} />
              <Route path='say' element={<Say />} />
              <Route path='msg' element={<Msg />} />
              <Route path='log' element={<Log />} />
              <Route path='about' element={<About />} />
              <Route path='post' element={<Post />} />
              <Route path='friends' element={<Friends />} />
              <Route path='*' element={<Navigate to='/' replace />} />
              <Route path='testPage' element={<TestPage />} />
              {/* 后台 */}
              <Route path='login' element = {<Login/>} />
              <Route path='dashboard/*' element = {<Dashboard/>} />
              
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  );
};

export default Main;
