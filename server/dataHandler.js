const Sqlite3 = require('better-sqlite3');
class DataHandler{
    static TABLE_NAME='mock_item';
    constructor(config={}){
        this.__db=new Sqlite3(config.file, { verbose: console.log });
    }
    newId(){
        const stmt = this.__db.prepare(`select max(id) as newId from ${DataHandler.TABLE_NAME}`);
        let value=stmt.get()['newId'];
        if(null===value){
            return 0;
        }
        return value+1;
    }
    add(data){
        let info=this.__db.prepare(`insert into ${DataHandler.TABLE_NAME} (
            id,
            enabled,
            match_type,
            matcher,
            resp_type,
            resp_code,
            resp_header,
            resp_content
        ) VALUES (
            @id,
            @enabled,
            @match_type,
            @matcher,
            @resp_type,
            @resp_code,
            @resp_header,
            @resp_content
        )` ).run({
            ...data,
            id:this.newId(),
            resp_header:JSON.stringify(resp_header),
            enabled: data.enabled ? 1 : 0
        });
        return info.changes;
    }
    update(id,data){
        let info=this.__db.prepare(`update ${DataHandler.TABLE_NAME} set
            enabled=@enabled,
            match_type=@match_type,
            matcher=@matcher,
            resp_type=@resp_type,
            resp_code=@resp_code,
            resp_header=@resp_header,
            resp_content=@resp_content
            where id=@id`).run({
            ...data,
            resp_header:JSON.stringify(data.resp_header),
            enabled: data.enabled ? 1 : 0,
            id
        });
        return info.changes;
    }
    updateEnabled(id,enabled){
        let info=this.__db.prepare(`update ${DataHandler.TABLE_NAME} set
            enabled=@enabled
            where id=@id`).run({
            enabled: enabled ? 1 : 0,
            id
        });
        return info.changes;
    }
    delete(id){
        let info=this.__db.prepare(`delete from ${DataHandler.TABLE_NAME} where id=@id`).run({
            id
        });
        return info.changes;
    }
    list(pageNum=0,pageSize=10){
        return {
            total:this.__db.prepare(`select count(id) as total from ${DataHandler.TABLE_NAME}`).get()['total'],
            data:this.__db.prepare(`select * from ${DataHandler.TABLE_NAME} limit @pageSize offset @offset`).all({
                pageSize,
                offset:pageSize*pageNum
            }).map((item)=>{
                let resp_header=[];
                try{
                    resp_header=JSON.parse(item.resp_header);
                }catch(e){}
                return{
                    ...item,
                    resp_header,
                    enabled: item.enabled ? true : false
                };
            })
        };
    }
    listAll(){
        return this.__db.prepare(`select * from ${DataHandler.TABLE_NAME} where enabled=1`).all().map((item)=>{
            let resp_header=[];
            try{
                resp_header=JSON.parse(item.resp_header);
            }catch(e){}
            return{
                ...item,
                resp_header,
                enabled: item.enabled ? true : false
            };
        });
    }
    close(){
        this.__db.close();
    }
}
class DataCache{
    __exactMatch={};
    __regexpMatch=[];
    update(data){
        this.__exactMatch={};
        this.__regexpMatch=[];
        for(let item of data){
            switch(item.match_type){
                case 0:
                    this.__exactMatch[item.matcher]=item;
                break;
                case 1:
                    this.__regexpMatch.push(item);
                break;
            }
        }
    }
    getAll(){
        return{
            exact:this.__exactMatch,
            regexp:this.__regexpMatch
        }
    }
    close(){
    }
}
let instance=null, cache=null;
module.exports=class{
    static init(config={}){
        if(instance){
            throw Error('Data handler already started');
        }
        instance=new DataHandler(config);
        if(cache){
            throw Error('Data handler already started');
        }
        cache=new DataCache();
        cache.update(instance.listAll());
    }
    static get(){
        return instance;
    }
    static getCache(){
        return cache;
    }
    static close(){
        if(instance){
            instance.close();
            instance=null;
        }
        if(cache){
            cache.close();
            cache=null;
        }
    }
}
