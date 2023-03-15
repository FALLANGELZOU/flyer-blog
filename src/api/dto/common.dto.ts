export interface PageQueryDto {
    pageSize?: number,
    pageIndex?: number,
    reverse?: boolean,
    sortBy?: string,
    thirdParty?: boolean,
    thirdPartyType?: string
}

export interface ImageFromOtherOption {
    type?: "pc" | "mp" | "top" | "random"
    num?: number
}

export interface ImageDto {
    file: FileDto
    thumbPath?: string
    width: number
    height: number,
    createTime?: Date,
    thirdParty?: boolean
    thirdPartyType?: "pc" | "mp" | "top" | "random"
}

export interface FileDto {

    fileName: string //  文件名称
 
    contentType: string  //  文件类型
 
    md5?: string  //  文件MD5
    
    filePath?: string //  文件路径

    originalFileName?: string

 }