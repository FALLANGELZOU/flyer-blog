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
  const { data: selfData, loading: selfLoading } = useRequest(() => $http.get('api/self-info'))
  console.log(selfData)
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
          <div style={{ 
            width:'80%', 
            minHeight: '30vh', 
            backgroundColor:'white',
            margin:'auto',
            borderRadius:'8px'
             }}>
            {/* 文章标签/搜索/统计等展示区域 */}

          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            margin:'auto',
            width:'80%'
          }}>
              <div style={{
                backgroundColor:'white',
                width:'28%',
                padding:'8px',
                marginTop:'24px',
                marginRight:'48px',
                borderRadius:'8px',
                height:'fit-content',
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                flexDirection:'column',
                boxShadow:"6px 2px 16px 0 rgb(136 165 191 / 48%), -6px -2px 16px 0 hsl(0deg 0% 100% / 80%)"
      
              }}>
                <div style={{padding:'8px'}}><img style={{width:'100%'}} src="http://58.221.197.198:25568/i/2023/02/23/63f63eea436a1.jpeg" alt="" title="" /></div>
                <div style={{fontSize:'24rem', fontWeight:'bolder', marginBottom:'8px'}}>十三</div>
                <div style={{fontSize:'8rem', color:"#74759b", marginBottom:'24px'}}>贪得无厌的欲望野兽</div>
                <div style={{marginBottom:'24px'}}>
                  <Space wrap direction="horizontal" size={16}>
                    <Github style={{width:'48rem'}} url = {selfData?.data?.data?.github}/>
                    <QQ style={{width:'48rem'}} url = {selfData?.data?.data?.qq}/>
                    <WX style={{width:'48rem'}} url = {selfData?.data?.data?.wx}/>
                  </Space>
                </div>
              </div>


              <div style={{
                width:'72%',
                display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
            }}>{renderArticles()}</div>
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
import { isBlank, openUrl } from '@/utils/FlyerHooks';
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
        width:"100%",
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        boxShadow:"6px 2px 16px 0 rgb(136 165 191 / 48%), -6px -2px 16px 0 hsl(0deg 0% 100% / 80%)"
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

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  url?: string
}
const QQ: React.FC<IconProps> = ({style, url}) => (<div style={style} onClick={() => openUrl(url)}><svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14004"><path d="M511.09761 957.257c-80.159 0-153.737-25.019-201.11-62.386-24.057 6.702-54.831 17.489-74.252 30.864-16.617 11.439-14.546 23.106-11.55 27.816 13.15 20.689 225.583 13.211 286.912 6.767v-3.061z" fill="#FAAD08" p-id="14005"></path><path d="M496.65061 957.257c80.157 0 153.737-25.019 201.11-62.386 24.057 6.702 54.83 17.489 74.253 30.864 16.616 11.439 14.543 23.106 11.55 27.816-13.15 20.689-225.584 13.211-286.914 6.767v-3.061z" fill="#FAAD08" p-id="14006"></path><path d="M497.12861 474.524c131.934-0.876 237.669-25.783 273.497-35.34 8.541-2.28 13.11-6.364 13.11-6.364 0.03-1.172 0.542-20.952 0.542-31.155C784.27761 229.833 701.12561 57.173 496.64061 57.162 292.15661 57.173 209.00061 229.832 209.00061 401.665c0 10.203 0.516 29.983 0.547 31.155 0 0 3.717 3.821 10.529 5.67 33.078 8.98 140.803 35.139 276.08 36.034h0.972z" fill="#000000" p-id="14007"></path><path d="M860.28261 619.782c-8.12-26.086-19.204-56.506-30.427-85.72 0 0-6.456-0.795-9.718 0.148-100.71 29.205-222.773 47.818-315.792 46.695h-0.962C410.88561 582.017 289.65061 563.617 189.27961 534.698 185.44461 533.595 177.87261 534.063 177.87261 534.063 166.64961 563.276 155.56661 593.696 147.44761 619.782 108.72961 744.168 121.27261 795.644 130.82461 796.798c20.496 2.474 79.78-93.637 79.78-93.637 0 97.66 88.324 247.617 290.576 248.996a718.01 718.01 0 0 1 5.367 0C708.80161 950.778 797.12261 800.822 797.12261 703.162c0 0 59.284 96.111 79.783 93.637 9.55-1.154 22.093-52.63-16.623-177.017" fill="#000000" p-id="14008"></path><path d="M434.38261 316.917c-27.9 1.24-51.745-30.106-53.24-69.956-1.518-39.877 19.858-73.207 47.764-74.454 27.875-1.224 51.703 30.109 53.218 69.974 1.527 39.877-19.853 73.2-47.742 74.436m206.67-69.956c-1.494 39.85-25.34 71.194-53.24 69.956-27.888-1.238-49.269-34.559-47.742-74.435 1.513-39.868 25.341-71.201 53.216-69.974 27.909 1.247 49.285 34.576 47.767 74.453" fill="#FFFFFF" p-id="14009"></path><path d="M683.94261 368.627c-7.323-17.609-81.062-37.227-172.353-37.227h-0.98c-91.29 0-165.031 19.618-172.352 37.227a6.244 6.244 0 0 0-0.535 2.505c0 1.269 0.393 2.414 1.006 3.386 6.168 9.765 88.054 58.018 171.882 58.018h0.98c83.827 0 165.71-48.25 171.881-58.016a6.352 6.352 0 0 0 1.002-3.395c0-0.897-0.2-1.736-0.531-2.498" fill="#FAAD08" p-id="14010"></path><path d="M467.63161 256.377c1.26 15.886-7.377 30-19.266 31.542-11.907 1.544-22.569-10.083-23.836-25.978-1.243-15.895 7.381-30.008 19.25-31.538 11.927-1.549 22.607 10.088 23.852 25.974m73.097 7.935c2.533-4.118 19.827-25.77 55.62-17.886 9.401 2.07 13.75 5.116 14.668 6.316 1.355 1.77 1.726 4.29 0.352 7.684-2.722 6.725-8.338 6.542-11.454 5.226-2.01-0.85-26.94-15.889-49.905 6.553-1.579 1.545-4.405 2.074-7.085 0.242-2.678-1.834-3.786-5.553-2.196-8.135" fill="#000000" p-id="14011"></path><path d="M504.33261 584.495h-0.967c-63.568 0.752-140.646-7.504-215.286-21.92-6.391 36.262-10.25 81.838-6.936 136.196 8.37 137.384 91.62 223.736 220.118 224.996H506.48461c128.498-1.26 211.748-87.612 220.12-224.996 3.314-54.362-0.547-99.938-6.94-136.203-74.654 14.423-151.745 22.684-215.332 21.927" fill="#FFFFFF" p-id="14012"></path><path d="M323.27461 577.016v137.468s64.957 12.705 130.031 3.91V591.59c-41.225-2.262-85.688-7.304-130.031-14.574" fill="#EB1C26" p-id="14013"></path><path d="M788.09761 432.536s-121.98 40.387-283.743 41.539h-0.962c-161.497-1.147-283.328-41.401-283.744-41.539l-40.854 106.952c102.186 32.31 228.837 53.135 324.598 51.926l0.96-0.002c95.768 1.216 222.4-19.61 324.6-51.924l-40.855-106.952z" fill="#EB1C26" p-id="14014"></path></svg></div>)
const WX: React.FC<IconProps> = ({style, url}) => (<div style={style} onClick={() => openUrl(url)}><svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4789"><path d="M1024 619.52c0-143.36-138.24-256-307.2-256s-307.2 112.64-307.2 256 138.24 256 307.2 256c30.72 0 61.44-5.12 92.16-10.24l97.28 51.2-25.6-76.8c87.04-51.2 143.36-128 143.36-220.16z m-414.72-40.96c-30.72 0-51.2-20.48-51.2-51.2s20.48-51.2 51.2-51.2 51.2 20.48 51.2 51.2c0 25.6-25.6 51.2-51.2 51.2z m209.92 0c-30.72 0-51.2-20.48-51.2-51.2s20.48-51.2 51.2-51.2 51.2 20.48 51.2 51.2c0 25.6-25.6 51.2-51.2 51.2z" fill="#4CBF00" p-id="4790"></path><path d="M358.4 609.28c0-158.72 153.6-286.72 348.16-286.72h15.36C680.96 189.44 542.72 87.04 368.64 87.04 163.84 87.04 0 225.28 0 394.24c0 107.52 66.56 204.8 168.96 256l-30.72 92.16L256 686.08c35.84 10.24 71.68 15.36 112.64 15.36h10.24c-15.36-30.72-20.48-61.44-20.48-92.16z m138.24-414.72c35.84 0 66.56 30.72 66.56 66.56s-30.72 66.56-66.56 66.56c-35.84-5.12-66.56-35.84-66.56-71.68s30.72-61.44 66.56-61.44z m-250.88 128c-35.84 0-61.44-30.72-61.44-66.56s30.72-66.56 66.56-66.56 61.44 30.72 61.44 66.56-30.72 66.56-66.56 66.56z" fill="#4CBF00" p-id="4791"></path></svg></div>)
const Github: React.FC<IconProps> = ({style, url}) => (<div style={style} onClick={() => openUrl(url)}><svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5750"><path d="M960 512c0 97.76-28.704 185.216-85.664 263.264-56.96 78.016-130.496 131.84-220.64 161.856-10.304 1.824-18.368 0.448-22.848-4.032a22.4 22.4 0 0 1-7.2-17.504v-122.88c0-37.632-10.304-65.44-30.464-82.912a409.856 409.856 0 0 0 59.616-10.368 222.752 222.752 0 0 0 54.72-22.816c18.848-10.784 34.528-23.36 47.104-38.592 12.544-15.232 22.848-35.904 30.912-61.44 8.096-25.568 12.128-54.688 12.128-87.904 0-47.072-15.232-86.976-46.208-120.16 14.368-35.456 13.024-74.912-4.48-118.848-10.752-3.616-26.432-1.344-47.072 6.272s-38.56 16.16-53.824 25.568l-21.984 13.888c-36.32-10.304-73.536-15.232-112.096-15.232s-75.776 4.928-112.096 15.232a444.48 444.48 0 0 0-24.672-15.68c-10.336-6.272-26.464-13.888-48.896-22.432-21.952-8.96-39.008-11.232-50.24-8.064-17.024 43.936-18.368 83.424-4.032 118.848-30.496 33.632-46.176 73.536-46.176 120.608 0 33.216 4.032 62.336 12.128 87.456 8.032 25.12 18.368 45.76 30.496 61.44 12.544 15.68 28.224 28.704 47.072 39.04 18.848 10.304 37.216 17.92 54.72 22.816a409.6 409.6 0 0 0 59.648 10.368c-15.712 13.856-25.12 34.048-28.704 60.064a99.744 99.744 0 0 1-26.464 8.512 178.208 178.208 0 0 1-33.184 2.688c-13.024 0-25.568-4.032-38.144-12.544-12.544-8.512-23.296-20.64-32.256-36.32a97.472 97.472 0 0 0-28.256-30.496c-11.232-8.064-21.088-12.576-28.704-13.92l-11.648-1.792c-8.096 0-13.92 0.928-17.056 2.688-3.136 1.792-4.032 4.032-2.688 6.72s3.136 5.408 5.376 8.096 4.928 4.928 7.616 7.168l4.032 2.688c8.544 4.032 17.056 11.232 25.568 21.984 8.544 10.752 14.368 20.64 18.4 29.6l5.824 13.44c4.928 14.816 13.44 26.912 25.568 35.872 12.096 8.992 25.088 14.816 39.008 17.504 13.888 2.688 27.36 4.032 40.352 4.032s23.776-0.448 32.288-2.24l13.472-2.24c0 14.784 0 32.288 0.416 52.032 0 19.744 0.48 30.496 0.48 31.392a22.624 22.624 0 0 1-7.648 17.472c-4.928 4.48-12.992 5.824-23.296 4.032-90.144-30.048-163.68-83.84-220.64-161.888C92.256 697.216 64 609.312 64 512c0-81.152 20.192-156.064 60.096-224.672s94.176-122.88 163.232-163.232C355.936 84.192 430.816 64 512 64s156.064 20.192 224.672 60.096 122.88 94.176 163.232 163.232C939.808 355.488 960 430.848 960 512" fill="#2c2c2c" p-id="5751"></path></svg></div>)

export default ArticleList;
