import FixImage from "@/common/fix/FixImage";
import FixImageV2 from "@/common/fix/FixImageV2";
import { log } from "@/FlyerLog";
import { useAsync } from "@/utils/FlyerHooks";
import $http from "@/utils/HttpService";
import axios from "axios";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { forwardRef } from "react";
import { connect } from "react-redux";
import s from './index.scss'
interface Props {

}

const getImages = async (count: number = 1) => {
    //  先不取随机图了，这个比较好看
    // let data = await $http.post('/api/images', {
    //     num: 1,
    //     sort: 'pc'
    // })
    // return data.data[0].url
    return "https://tvax3.sinaimg.cn/large/ec43126fgy1glow3bpjagj21z41407wi.jpg"
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