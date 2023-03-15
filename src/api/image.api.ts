import $http, { apiUrl } from "@/utils/HttpService"
import { ImageDto, ImageFromOtherOption, PageQueryDto } from "./dto/common.dto"

export const getImages = async (param: PageQueryDto) => {
    const res = await $http.post("service/i/api/image/list", param)
    return res.data
}

export const randomImage = async (param: ImageFromOtherOption) => {
    const res = await $http.post("service/i/api/image/random", param)
    return res.data
}

export const formatImageUrl = (image: ImageDto) => {
    return apiUrl("/service/i/api/images/" + image.file.filePath)
}

export const formatThumbUrl = (image: ImageDto) => {
    if (!image.thumbPath) return ""
    return apiUrl("/service/i/api/images" + image.thumbPath)
}