import React, { ImgHTMLAttributes, MouseEventHandler, useEffect } from 'react';
import Card from '@/components/Card';
import s from './index.scss';
import CardV2 from '@/components/CardV2';
import FixImageV2 from '@/common/fix/FixImageV2';
import classNames from 'classnames';
import { BookFilled, ClockCircleOutlined } from '@ant-design/icons';
import FixImageV3 from '@/common/fix/FixImageV3';

interface Props extends ImgHTMLAttributes<HTMLDivElement> {
    image?: {
        url?: string,
        wdith?: number,
        height?: number
    }

    title?: string,
    description?: string,
    time?: string
    tags?: string[],
    classification?: string
}

const ShowCard: React.FC<Props> = ({
    style,
    image,
    title,
    description,
    time,
    tags,
    classification
}) => {
   
    useEffect(() => {
    })
    return (
        <div className={classNames(s._showCardContainer)}
            style = {style}
            >


            <CardV2>
                <div style={{
                    position: 'relative',
                    width: '100%'
                }}>
                    <FixImageV3
                        url='https://tva3.sinaimg.cn/large/ec43126fgy1gvvgi2g05xj21mc0wtnpd.jpg'
                    ></FixImageV3>
                    <div className={s._title}
                        style={{
                            position: 'absolute',
                            left: '0px',
                            bottom: '0px'
                        }}
                    >这是一个主题</div>
                </div>

                <div style={{
                    padding: '15px',
                    width: '100%'
                }}>
                    <div className={classNames(s._description)}>dasdsadasda</div>
                    <div style={{
                        height: '1px',
                        width: '100%',
                        backgroundColor: 'rgb(169,169,169)',
                        marginTop: '4px',
                        marginBottom: '4px'
                    }}></div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        position: 'relative'
                    }}>
                        <div>
                            <ClockCircleOutlined style={{ marginRight: '5px' }} />
                            2022-11-21
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                right: '0px'
                            }}
                        >
                            <BookFilled style={{ marginRight: '5px' }} />
                            主题文档</div>
                        <div>标签</div>
                    </div>
                </div>

            </CardV2>


        </div>

    );
};

export default ShowCard;
