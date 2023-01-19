import FixImage from "@/common/fix/FixImage";
import FixImageV2 from "@/common/fix/FixImageV2";
import { log } from "@/FlyerLog";
import { useAsync } from "@/utils/FlyerHooks";
import axios from "axios";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { forwardRef } from "react";
import { connect } from "react-redux";
import s from './index.scss'
interface Props {

}
//  https://iw233.cn/ 图库链接

const urls = [
    "https://iw233.cn/api.php?sort=pc",
    "http://api.iw233.cn/api.php?sort=pc",
    "http://ap1.iw233.cn/api.php?sort=pc",
    "https://dev.iw233.cn/api.php?sort=pc"
]

const getImages = async (count: number = 1) => {
    let data = await axios.get('/api/image')
    return data.data.pic[0]
}
const Background = forwardRef<any, Props>(({

}, ref: any) => {

    const image = useRef<HTMLDivElement>(null)
    const [img, setImg] = useState<string>("")


    useEffect(() => {
        let active = true
        getImages(1).then(res => {
            if (active) setImg(res)
        })
      const current = image.current
      if (current != undefined) {
        getImages(1).then(res => {
            current.style.backgroundImage = 'url(' + res +')'
        })
        
      }

      return () => {
        active = false
      }
      
    }, []);


/* <div className= {classNames(s.background_image)} ref = {image} /> */


    return (
        <>
            <div className={classNames(s.screen_container)}>
                <FixImageV2
                    src= {img}
                    lazy = {true}
                    style = {{
                        zIndex: -1
                    }}
                    />
            </div>
        </>
    )
})


export default connect((state) => state, {})(Background)