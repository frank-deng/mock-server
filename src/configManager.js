class ConfigManager{
    constructor(){
        this.__host=host;
        this.__port=port;
        this.__server=http.createServer();
        this.__server.on('request',this.handler);
    }
    handler(request,response){
        console.log('收到客户端的请求了，请求路径是：' + request.url)
        // response 对象有一个方法：write 可以用来给客户端发送响应数据
        // write 可以使用多次，但是最后一定要使用 end 来结束响应，否则客户端会一直等待
        response.write('hahaha');
        response.end()
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
}