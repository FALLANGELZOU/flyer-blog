
const standardWidth = 1440; //  同一尺寸为1440px

const setRootFontSize = () => {
    document.getElementsByTagName('html')[0].style.fontSize = document.documentElement.clientWidth / standardWidth + 'px';
}
export const initFont = () => {
    document.addEventListener('DOMContentLoaded', setRootFontSize)
    window.onresize = setRootFontSize
}

export const styleUtil = {
    initFont
}