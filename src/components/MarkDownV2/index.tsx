import { useSafeState } from "ahooks";
// import "vditor/dist/index.css";
import "./vditor.custom.scss"
import React, { useEffect } from "react";
import Vditor from "vditor";
import './index.scss'
const MarkDownV2 = () => {
const [vd, setVd] = useSafeState<Vditor>();
  useEffect(() => {
    const vditor = new Vditor("vditor", {
      after: () => {
        vditor.setValue("`Vditor` 编辑");
        setVd(vditor);
      }
    });
  }, []);

  
  return <div id="vditor" className="vditor" />;
}

export default MarkDownV2;