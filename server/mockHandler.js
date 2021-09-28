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
            if(!matched){
                response.setHeader('Access-Control-Allow-Methods', request.method);
                response.setHeader('Access-Control-Allow-Origin', '*');
                response.setHeader('Access-Control-Allow-Headers','content-type');
                response.setHeader('content-type', 'text/plain; charset=utf-8');
                response.writeHead(404);
                response.end('404 Not Found');
                return;
            }

            //检测内容是否为JSON
            let isJSON=false;
            try{
                JSON.parse(matched.resp_content);
                isJSON=true;
            }catch(e){}

            //准备默认的返回头，包括跨域操作
            let headers={
                'Access-Control-Allow-Methods':request.method,
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Headers':null
            };
            let allowHeaders={};
            for(let item of matched.resp_header){
                try{
                    if(headers[item.key] || !item.key){
                        continue;
                    }
                    allowHeaders[item.key]=true;
                }catch(e){
                    console.error(e);
                }
            }
            
            //JSON内容相关的默认header加上
            if(isJSON){
                headers['content-type']='application/json; encoding=UTF-8';
                allowHeaders['content-type']=true;
            }

            //跨域相关header加上
            if(Object.keys(allowHeaders).length){
                headers['Access-Control-Allow-Headers']=Object.keys(allowHeaders).join(',');
            }

            //取出要设置的返回头，可覆盖默认的返回头
            for(let item of matched.resp_header){
                try{
                    if(!item.key || !item.value){
                        continue;
                    }
                    headers[item.key]=item.value;
                }catch(e){
                    console.error(e);
                }
            }
            //值为空的返回头项目去掉
            for(let key in headers){
                if(!headers[key]){
                    continue;
                }
                response.setHeader(key,headers[key]);
            }
            response.writeHead(matched.resp_code);
            response.end(matched.resp_content);
        }catch(e){
            console.error(e);
        }
    }
}
