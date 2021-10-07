const multipart=require('simple-multipart/parse');
const multipart2=require('multipart-form-parser');
const httpServer=require('./httpServer');
const DB=require('./dataHandler');
module.exports=class extends httpServer{
    constructor(host,port){
        super(host,port);
        this.route={
            '/add':this.addHandler,
            '/delete':this.deleteHandler,
            '/update':this.updateHandler,
            '/list':this.listHandler,
            '/updateItemEnabled':this.updateItemEnabled,
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
        //要把multipart/form-data解开来
        try{
            let contentType=request.headers['content-type'];
            if(-1 == contentType.indexOf('multipart/form-data')){
                return;
            }
            let data=multipart({body}), rawData=multipart2.Parse(body,multipart2.getBoundary(contentType));
            data.forEach((item,i)=>{
                item.content=rawData[i].data;
            });
            return data;
        }catch(e){
            console.error(e);
        }
    }
    addHandler=async({body,request,response})=>{
        let db=DB.get();
        let data={};
        for(let item of body){
            switch(item.name){
                case 'conf':
                    Object.assign(data,JSON.parse(item.content));
                break;
                case 'data':
                    data.resp_content=item.content;
                break;
            }
        }
        db.add(data);
        DB.getCache().update(db.listAll());
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
            DB.getCache().update(db.listAll());
            return {
                code:0,
                message:'删除条目成功'
            }
        }
    }
    updateHandler=async({path,body,request,response})=>{
        let db=DB.get();
        let data={};
        for(let item of body){
            switch(item.name){
                case 'conf':
                    Object.assign(data,JSON.parse(item.content.toString()));
                break;
                case 'data':
                    data.resp_content=item.content;
                break;
            }
        }
        if(!db.update(data.id,data)){
            return {
                code:2,
                message:'更新条目失败'
            };
        }else{
            DB.getCache().update(db.listAll());
            return {
                code:0,
                message:'更新条目成功'
            };
        }
    }
    updateItemEnabled=async({path,body,request,response})=>{
        let db=DB.get(), id=path.query.id, enabled=Number(path.query.enabled);
        if(!db.updateEnabled(id,enabled)){
            return {
                code:2,
                message:'更新条目失败'
            };
        }else{
            DB.getCache().update(db.listAll());
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
