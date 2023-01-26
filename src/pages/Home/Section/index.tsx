import { useRequest, useSafeState } from 'ahooks';
import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import MyPagination from '@/components/MyPagination';
import { storeState } from '@/redux/interface';
import { DB } from '@/utils/apis/dbConfig';
import { getPageData } from '@/utils/apis/getPageData';
import { homeSize, staleTime } from '@/utils/constant';

import s from './index.scss';
import PostCard from './PostCard';
import ShowCard from './ShowCard';
import Masonry from 'react-masonry-component';
import CardV2 from '@/components/CardV2';
import FixImageV2 from '@/common/fix/FixImageV2';
import classNames from 'classnames';
import { BookFilled, ClockCircleOutlined } from '@ant-design/icons';

interface theAtc {
  classes: string;
  content: string;
  date: number;
  tags: string[];
  title: string;
  titleEng: string;
  url: string;
  _id: string;
  _openid: string;
}

interface Props {
  artSum?: number;
}

const Section: React.FC<Props> = ({ artSum }) => {
  const navigate = useNavigate();
  const [page, setPage] = useSafeState(1);

  const { data, loading } = useRequest(
    () =>
      getPageData({
        dbName: DB.Article,
        sortKey: 'date',
        isAsc: false,
        page,
        size: homeSize
      }),
    {
      retryCount: 3,
      refreshDeps: [page],
      cacheKey: `Section-${DB.Article}-${page}`,
      staleTime
    }
  );


  const ids = Array(20).fill(1)

  return (
    <>
      <div className={s.section}>
        <Masonry
        >
          {
            ids.map((e, index) => {

              return <div
              style={{
                width: '33%',
                paddingBottom: '20px',
                paddingLeft: '20px'
              }}
              key = {index}
              >
                <ShowCard></ShowCard>

              </div>



            })
          }


        </Masonry>
      </div>



      {/* <section className={s.section}>
        <ShowCard></ShowCard>
        <ShowCard></ShowCard>
        <ShowCard></ShowCard>
        <ShowCard></ShowCard>
        <ShowCard></ShowCard>
        <ShowCard></ShowCard>
        <ShowCard></ShowCard> */}
      {/* {data?.data.map(({ _id, title, content, date, tags, titleEng }: theAtc) => (
    <PostCard
      key={_id}
      title={title}
      content={content}
      date={date}
      tags={tags}
      loading={loading}
      onClick={() => navigate(`/post?title=${encodeURIComponent(titleEng)}`)}
    />
  ))} */}

      {/* 自定义的分页显示 */}
      {/* <MyPagination
    current={page}
    defaultPageSize={homeSize}
    total={artSum}
    setPage={setPage}
    autoScroll={true}
    scrollToTop={document.body.clientHeight - 80}
  /> */}
      {/* </section> */}

    </>

  );
};

export default connect((state: storeState) => ({ artSum: state.artSum }))(Section);
