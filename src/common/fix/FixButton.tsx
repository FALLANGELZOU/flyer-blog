import { isDevelopment } from '@/FlyerConfig';
import { log } from '@/FlyerLog';
import classNames from 'classnames';
import React, { createRef, MouseEventHandler, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import s from './index.scss'

interface Props {
    text?: string,
    onClick?: React.MouseEventHandler<HTMLDivElement> | undefined,
    style?: React.HTMLAttributes<HTMLDivElement> | React.CSSProperties
    to?: string
}
const FixButton: React.FC<Props> = ({
    text,
    onClick,
    style,
    to
}) => {
    const navigate = useNavigate();
    const button = createRef<HTMLDivElement>()
    
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
                key={null} 
                children={() => null}
                onClick = {() => {
                    log.debug("点击导航", location)
                }}
                ></NavLink>
              )
        }
        return null
    }

    useEffect(() => {
        const current = button.current
        if (current != undefined) {
            current.style.position = "relative"
        }
    }, [])

    return (
        <>
            <div 
                className= { classNames(s._baseButton) }
                onClick = {(e) => { onClick?.(e); }}
                ref = { button }
                style = { style}
            >{text}
            {needLinkTo()}
            </div>
        </>
    )
}

export default FixButton