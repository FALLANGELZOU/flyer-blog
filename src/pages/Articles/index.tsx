import { useMount, useRequest, useSafeState, useTitle } from 'ahooks';
import React, { HTMLAttributes, Suspense } from 'react';
import { detailPostSize, siteTitle, staleTime } from '@/utils/constant';
import $http from '@/utils/HttpService';
import { Route, Routes } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import ArticleList from './ArtList';
import ArticleDetail from './ArticleDetail';


const Articles: React.FC = () => {
  const [page, setPage] = useSafeState(1);
  const { data, loading } = useRequest(() => $http.get("api/get-article-overall"));

  useTitle(`${siteTitle} | 文章`);
  return (
    <>
      <div>
        <ErrorBoundary>
          <Suspense fallback={<></>}>
            <Routes>
              <Route path="/" element={<ArticleList />} />
              <Route path="/:id" element={<ArticleDetail />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
};
export default Articles;
