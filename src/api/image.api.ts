import $http from "@/utils/HttpService"
import { PageQueryDto } from "./dto/common.dto"

export const getImages = async (param: PageQueryDto) => {
    const res = await $http.post("service/i/api/image/list", param)
    return res.data
}

