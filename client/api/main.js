import request from './request';
export async function addItem(data){
    return await request.post(`add`,{
        ...data
    });
}
export async function deleteItem(id){
    return await request.get(`delete`,{
        params:{
            id
        }
    });
}
export async function queryItem(data){
    return await request.post(`list`,{
        pageNum:data.pageNum,
        pageSize:data.pageSize
    });
}