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
    beforeRequest({path,body,request,response}){
        response.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Headers','content-type');
        response.setHeader('content-type', 'application/json; charset=utf-8');
        if('OPTIONS'==request.method){
            response.writeHead(200);
            response.end();
            return;
        }
    }
    addHandler=async({body,request,response})=>{
        let db=DB.get();
        db.add(JSON.parse(body));
        response.end(JSON.stringify({
            code:0,
            message:'添加条目成功'
        }));
    }
    deleteHandler=async({path,request,response})=>{
        let id=path.query.id;
        if(undefined===id){
            response.write(JSON.stringify({
                code:1,
                message:'未指定条目'
            }));
            response.end();
            return;
        }
        let db=DB.get();
        if(!db.delete(id)){
            return {
                code:2,
                message:'删除条目失败'
            };
        }else{
            return {
                code:0,
                message:'删除条目成功'
            }
        }
    }
    updateHandler=async({path,body,request,response})=>{
        let db=DB.get(), data=JSON.parse(body);
        if(!db.update(data.id,data)){
            return {
                code:2,
                message:'更新条目失败'
            };
        }else{
            return {
                code:0,
                message:'更新条目成功'
            };
        }
    }
    listHandler=async({path,body,request,response})=>{
        let pageSize=path.query.pageSize || 10,
            pageNum=path.query.pageNum || 0;
        return {
            ...DB.get().list(pageNum,pageSize),
            message:'success',
            code:0
        };
    }
}
