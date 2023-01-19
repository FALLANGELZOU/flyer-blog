import { isDevelopment } from '@/FlyerConfig';
import { log } from '@/FlyerLog';
import { storeState } from '@/redux/interface';
import axios from 'axios';
import classNames from 'classnames';
import React, { createRef, ForwardedRef, forwardRef, MouseEventHandler, RefObject, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import s from './index.scss'

interface Props {
    text?: string,
    onClick?: React.MouseEventHandler<HTMLDivElement> | undefined,
    style?: React.HTMLAttributes<HTMLDivElement> | React.CSSProperties
    to?: string,
    id?: any,
    navShow?: any
}
const FixButton = forwardRef<any, Props>(({
    text,
    onClick,
    style,
    to,
    id,
}, ref: any) => {
    if (ref == null) ref = useRef(null);
    const navigate = useNavigate();
    //  设置文字
    const setFontStyle = () => {
        
    }
    const needLinkTo = () => {
        if (to != undefined) {
            return (<NavLink
            style={{
                width: "100%",
                height: "100%",
                position: "absolute"
            }}
                to={to}
                key={id} 
                children={() => null}
                onClick = {(e) => {
                    log.debug("点击导航", location)
                }}
                ></NavLink>
              )
        }
        return null
    }

    useEffect(() => {
        const current = ref.current
        if (current != undefined) {
            current.style.position = "relative"
            current.pathname = to  
            current.id = id
        }
    }, [])

    return (
        <>
            <div
                className= { classNames(s._baseButton) }
                onClick = {(e) => { onClick?.(e); }}
                ref = { ref }
                style = { style }
            >{text}
            {needLinkTo()}
            </div>
        </>
    )
})
//  想同时用forwardRef和connect只能加上forwardRef: true
export default connect((state: storeState) => ({
    navShow: state.navShow
}), null, null, {forwardRef: true})(FixButton)