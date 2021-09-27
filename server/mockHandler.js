const httpServer=require('./httpServer');
const url=require('url');
const DB=require('./dataHandler');
module.exports=class extends httpServer{
    async handler(request,response){
        try{
            const urlParsed=url.parse(request.url, true);
            const path=urlParsed.pathname;
            let cache=DB.getCache().getAll();
            let matched=cache.exact[path];
            if(!matched){
                for(let item of cache.regexp){
                    let regexp=new RegExp(item.matcher);
                    if(regexp.test(path)){
                        matched=item;
                        break;
                    }
                }
            }
            response.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Headers','content-type');
            if(!matched){
                response.setHeader('content-type', 'text/plain; charset=utf-8');
                response.writeHead(404);
                response.end('404 Not Found');
                return;
            }
            // response 对象有一个方法：write 可以用来给客户端发送响应数据
            // write 可以使用多次，但是最后一定要使用 end 来结束响应，否则客户端会一直等待
            response.setHeader('content-type', 'application/json; charset=utf-8');
            response.write(JSON.stringify(matched,null,2));
            response.end()
        }catch(e){
            console.error(e);
        }
    }
}
