import MarkDownV2 from "@/components/MarkDownV2";
import { useSafeState } from "ahooks";
import React, { useEffect } from "react";
import Vditor from "vditor";
import '@/styles/vditor.custom.scss'
import Login from "../Backend/Login";
import ArticleDetail from "../Articles/ArticleDetail";
import ImageWaterFall from "../Gallery/ImageWaterFall";

const TestPage = () => {
// const [vd, setVd] = useSafeState<Vditor>();
//   useEffect(() => {
//     const vditor = new Vditor("vditor", {
//       after: () => {
//         vditor.setValue("`Vditor` 编辑");
//         setVd(vditor);
        
//       },
//       focus: (value) => {
//         //  聚焦编辑器
//       }
//     });
  
//   }, []);



  return (
    <div>

        <ImageWaterFall style={{
          width:'100%',
          height:'100vh'
        }}/>
        {/* <ArticleDetail></ArticleDetail> */}
    </div>

  
  
  );
}

export default TestPage;