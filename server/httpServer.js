const http=require('http');
const url=require('url');
module.exports=class{
    route={};
    constructor(host='',port=8082){
        this.__host=host;
        this.__port=port;
        this.__server=http.createServer();
        this.__sockets=new Set();
        this.__server.on('request',this.__callHandler);
        this.__server.on('connection',this.__onConnection);
    }
    __onConnection=(socket)=>{
        try{
            this.__sockets.add(socket);
        }catch(e){
            console.error(e);
        }
    }
    __callHandler=async(request,response)=>{
        try{
            await this.handler(request,response);
        }catch(e){
            console.error(e);
            response.writeHead(500);
            response.end(e.toString());
        }
    }
    async handler(request,response){
        const urlParsed=url.parse(request.url, true);
        const path=urlParsed.pathname;
        const func=this.route[path];
        if('function'!=typeof(func)){
            response.writeHead(404);
            response.end('404 Not Found.');
            return;
        }

        let body=null;
        if('POST'==request.method){
            body=await new Promise((resolve)=>{
                let postBody='';
                request.on('data',(chunk)=>{
                    postBody+=chunk;
                });
                request.on("end", function(){
                    resolve(postBody);
                });
            });
        }
        await func({path,body,request,response});
    }
    start(){
        return new Promise((resolve)=>{
            this.__server.listen(this.__port,this.__host,()=>{
                resolve({
                    host:this.__host,
                    port:this.__port
                });
            });
        });
    }
    close(){
        for (const socket of this.__sockets) {
            socket.destroy();
            this.__sockets.delete(socket);
        }
        this.__server.close('function'==typeof(this.onClose) ? this.onClose : undefined);
    }
}
