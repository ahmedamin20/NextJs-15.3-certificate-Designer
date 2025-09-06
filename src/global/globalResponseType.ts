export type TGlobalResponseType<T> = {
    data: T;
    status: number;
    message: string;
    success: boolean;
    code: number;
    meta?: TPagenationMeta

}

export type TPagenationMeta = {
    
        pageNumber: number,
        pageSize: number,
        totalPages: number,
        totalCount: number,
      
}