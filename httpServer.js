const http=require('http');
module.exports=class{
    constructor(host='',port=8082){
        this.__host=host;
        this.__port=port;
        this.__server=http.createServer();
        this.__server.on('request',this.handler);
    }
    handler(request,response){}
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
}
