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
    addHandler=async(path,request,response)=>{
        response.set({ 'content-type': 'application/json; charset=utf-8'});
        response.write(JSON.stringify({
            code:0,
            message:'添加条目成功'
        }));
        response.end();
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
