import MarkDownV2 from "@/components/MarkDownV2";
import { useSafeState } from "ahooks";
import React, { useEffect } from "react";
import Vditor from "vditor";
import '@/styles/vditor.custom.scss'
import Login from "../Backend/Login";

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
        <Login></Login>
          {/* <div id="vditor" className="vditor" />
          <div style={{
            color:'white',
            display: 'flex',
            flexDirection:'row-reverse',
            
          }}>
            <div style={{
                fontSize: '24px',
                background: '#FFB4B4',
                padding:'5px',
                margin:'5px',
                borderRadius:'5px'
                
            }}>保存</div>
            <div style={{
                fontSize: '24px',
                background: '#B2A4FF',
                padding:'5px',
                margin:'5px',
                borderRadius:'5px'   
            }}>上传</div>
          </div> */}
    </div>

  
  
  );
}

export default TestPage;