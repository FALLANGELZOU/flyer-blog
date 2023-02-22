import { useMount, useRequest, useSafeState, useTitle, useUpdateEffect } from 'ahooks';
import React, { HTMLAttributes } from 'react';
import { detailPostSize, siteTitle, staleTime } from '@/utils/constant';

import { Pagination, Space } from 'antd';
import $http from '@/utils/HttpService';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import "./index.custom.scss"
const ArticleList: React.FC = () => {
  const { data, loading } = useRequest(() => $http.get("api/get-article-overall"));
  const [page, setPage] = useSafeState(1);
  const [pageSize, setPageSize] = useSafeState(10)
  const [total, setTotal] = useSafeState(0)
  const [renderData, setRenderData] = useSafeState<ArticleDto[]>([])
  useTitle(`${siteTitle} | 文章`);

  const renderArticles = () => {
    if (!renderData) return <></>
    return renderData.map((item, index) => {
      return (<ArticleItem article={item} key={index} />)
    })

  }

  const generateRenderData = () => {
    const d = ((data?.data?.data as any) as ArticleDto[])?.slice((page-1)*pageSize, page*pageSize)
    return d ? d : []
  }


  useUpdateEffect(() => {
    setRenderData(generateRenderData())
  }, [page])

  useUpdateEffect(() => {
    if (!loading) {
      setTotal(data?.data?.data.length)
      setRenderData(generateRenderData)
    }
  }, [loading])


  return (
    <>
      <div>
        <Space wrap direction='vertical' style={{ width: '100%' }}>
          <div style={{ width: '100%', minHeight: '30vh' }}>
            文章标签/搜索/统计等展示区域
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {renderArticles()}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <Pagination
              defaultCurrent={1}
              total={total}
              pageSize = {pageSize}
              responsive
              hideOnSinglePage
              onChange={(page: number) => {
                setPage?.(page);
                window.scrollTo(0, 0);
              }}
            />
          </div>
        </Space>
      </div>
    </>
  );
};


import calendar from "@/imgs/calendar.png"
import tag from "@/imgs/tag.png"
import { isBlank } from '@/utils/FlyerHooks';
import { ArticleDto } from '@/pages/Backend/pages/Articles/Editor';
import { log } from '@/FlyerLog';
interface ArticleItemProps extends HTMLAttributes<HTMLDivElement> {
  article: ArticleDto
}
const ArticleItem: React.FC<ArticleItemProps> = ({
  article
}) => {
  const navigate = useNavigate();

  const enterArticleDetail = () => {
    console.log(article._id)
    navigate(`${article._id}`)
  }
  return (

    <div
      onClick={enterArticleDetail}
      style={{
        padding: '32px',
        margin: '24px',
        backgroundColor: 'white',
        minWidth: '60vw',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center'
      }}>
      <Space wrap direction='vertical' align='center'>
        <div style={{
          display: 'flex',
          justifyItems: 'center',
          alignItems: 'center'
        }}>
          <img src={calendar} width="20rem" style={{ marginRight: '5px' }} />
          <span>{dayjs(article.createTime).format('YYYY-MM-DD')}</span>

          {
            !isBlank(article.tag?.join(" ")) &&
            <>
              <span style={{ marginRight: '10px', marginLeft: '10px' }}>|</span>
              <img src={tag} width="20rem" style={{ marginRight: '5px' }} />
              <span>{article.tag?.join(" ")}</span>
            </>
          }

        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30rem', fontWeight: 'bold' }}>{article.title}</div>
      </Space>

    </div>
  )
}

export default ArticleList;
