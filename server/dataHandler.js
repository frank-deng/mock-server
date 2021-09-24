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
        console.log(data);
        this.__db.prepare(`insert into ${DataHandler.TABLE_NAME} (
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
            enabled: data.enabled ? 1 : 0
        });
    }
    delete(id){
        this.__db.prepare(`delete from ${DataHandler.TABLE_NAME} where id=@id`).bind({
            ...data,
            id:this.newId()
        }).run();

    }
    close(){
        this.__db.close();
    }
}
let instance=null;
module.exports=class{
    static init(config={}){
        if(instance){
            throw Error('Data handler already started');
        }
        instance=new DataHandler(config);
    }
    static get(){
        return instance;
    }
    static close(){
        if(!instance){
            return;
        }
        instance.close();
        instance=null;
    }
}
