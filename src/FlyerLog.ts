
import colors from 'colors'
import { isDevelopment } from './FlyerConfig';

const styles = [
    'color: rgb(59, 142, 234);', 
    'background: yellow', 

  ].join(';'); // 2. 链接成字符串


const info = (message: any, ...args: any) => {
    console.log(
        '%c[%cinfo%c]', 
        'color: rgb(41, 184, 129);font-weight:bolder;',
        'color: rgb(59, 142, 234);font-weight:bolder;',
        'color: rgb(41, 184, 129);font-weight:bolder;',
        ` ${message}`, args.length!=0?args:'');
}

const debug = (message: any, ...args: any) => {
    if (isDevelopment) {
        console.log(
            '%c[%cdebug%c]', 
            'color: #F273E6;font-weight:bolder;',
            'color: #FF8B13;font-weight:bolder;',
            'color: #F273E6;font-weight:bolder;',
            ` ${message}`, args.length!=0?args:'');
    }
}

export const log = {
    info,
    debug
}