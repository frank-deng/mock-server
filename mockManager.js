const httpServer=require('./httpServer');
const url=require('url');
module.exports=class extends httpServer{
    constructor(host,port){
        super(host,port);
        this.route={
            '/add':this.addHandler,
            '/delete':this.deleteHandler,
            '/update':this.updateHandler,
            '/list':this.listHandler
        };
    }
    handler(request,response){
        try{
            const urlParsed=url.parse(request.url, true);
            const path=urlParsed.pathname;
            if(!this.route[path]){
                
            }
        }catch(e){
            console.error(e);
            response.writeHead(500);
            response.write(e.toString());
            response.end();
        }
    }
    addHandler(request,response){

    }
}
