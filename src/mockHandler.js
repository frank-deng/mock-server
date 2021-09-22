const httpServer=require('./httpServer');
const url=require('url');
module.exports=class extends httpServer{
    handler(request,response){
        const urlParsed=url.parse(request.url, true);
        console.log('收到客户端的请求了，请求路径是：',urlParsed);
        // response 对象有一个方法：write 可以用来给客户端发送响应数据
        // write 可以使用多次，但是最后一定要使用 end 来结束响应，否则客户端会一直等待
        response.write('hahaha');
        response.end()
    }
}
