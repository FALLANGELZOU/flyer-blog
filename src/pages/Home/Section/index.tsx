import { useMount, useRequest, useSafeState } from 'ahooks';
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
import $http from '@/utils/HttpService';

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
  const { data, loading } = useRequest(() => $http.post("api/get-article", {
    page: 0,
    pageSize: 20
  }))
  useMount(() => {

  })

  return (
    <>
      <div className={s.section}>

        {

          data?.data?.code == 200 && data?.data?.data.map((item: any, index: number) => {
            return <div
              style={{
                paddingBottom: '20px',
                paddingLeft: '20px'
              }}
              key={index}
            >
              <ShowCard
                description={item.title}
              />

            </div>
          })

        }


      </div>

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
