import request from './request';
export async function addItem(data){
    return await request.post(`http://localhost:8083/add`,{
        ...data
    });
}