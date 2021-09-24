import request from './request';
export async function addItem(data){
    /*
    enabled int not null,
    match_type int,
    matcher varchar(1000),
    resp_type int,
    resp_code int,
    resp_header blob,
    resp_content blob
     */
    return await request.post(`http://localhost:8083/add`,{
        ...data
    });
}