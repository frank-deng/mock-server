const httpServer=require('./httpServer');
const DB=require('./dataHandler');
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
    setCommonHeader(response){
        response.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Headers','content-type');
    }
    addHandler=async({path,body,request,response})=>{
        this.setCommonHeader(response);
        if('OPTIONS'==request.method){
            response.writeHead(200);
            response.end();
            return;
        }
        let db=DB.get();
        db.add(JSON.parse(body));
        response.setHeader('content-type', 'application/json; charset=utf-8');
        response.end(JSON.stringify({
            code:0,
            message:'添加条目成功'
        }));
        console.log('添加条目');
    }
    deleteHandler=async(path,request,response)=>{
        response.setHeader('content-type','application/json; charset=utf-8');
        response.write(JSON.stringify({
            code:0,
            message:'删除条目成功'
        }));
        response.end();
        console.log('删除条目');
    }
    updateHandler=async(path,request,response)=>{
        response.setHeader('content-type','application/json; charset=utf-8');
        response.write(JSON.stringify({
            code:0,
            message:'更新条目成功'
        }));
        response.end();
        console.log('更新条目');
    }
}
