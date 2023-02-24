import { siteTitle } from '@/utils/constant';
import $http from '@/utils/HttpService';
import { useRequest, useSafeState, useTitle } from 'ahooks';
import { Timeline } from 'antd';
import dayjs from 'dayjs';

import React from 'react';
import { NoteDto } from '../Backend/pages/Notes';

interface TimeLineItemDto extends NoteDto {
  
}

const colors = [
  "#FFF9CA",
  "#FFDEB4",
  "#FFB4B4",
  "#B2A4FF"
]
const Log: React.FC = () => {
  useTitle(`${siteTitle} | 碎碎念`);
  const [renderDate, setRenderData] = useSafeState([])
  const { data, loading } = useRequest(() => $http.get("api/get-notes"), {
    onSuccess: (res, param) => {
        if (res.data.code == 200) {

            setRenderData(res.data.data.map((item: any, index: number) => {
              let setMargin = null
              if (index%2) {
                setMargin = {
                marginRight:'8px', 
                marginLeft: 'auto'
              }
            } else {
              setMargin = {
                marginRight:'auto', 
                marginLeft: '8px'
              }
            }
              return ({
                color: colors[Math.floor(Math.random()*colors.length)],
                children: (
                <div style={{
                  display:'flex',
                  minWidth:'20vw',
                  maxWidth:'26vw',
                  width:'fit-content',
                  marginBottom:'64px',
                  padding:'16px',
                  fontSize:'16rem',
                  boxShadow:'rgb(136 165 191 / 48%) 6px 2px 16px 0px, rgb(255 255 255 / 80%) -6px -2px 16px 0px',
                  backgroundColor:'white',
                  flexDirection:"column",
                  borderRadius:'8px',
                  wordBreak: "break-all",
                  color:"gray",
                  ...setMargin
                  
                  }}>
                  <div>{dayjs(item.createTime).format("YYYY-MM-DD")}</div>
                  <div style={{fontWeight:'bold'}}>{item.message}</div>
                </div>
                ),
                
                key: item._id,
                id: item.id,
            
            })}))
        }
    }
})
  return (
    <>
      <div style={{paddingTop:'128px'}}>
      <Timeline mode="alternate" items = {renderDate} pending = {true}></Timeline>
      </div>
    </>
  );
};

export default Log;
