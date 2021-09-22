module.exports=class{
    constructor(){
        let config={};
        try{
            config=require('../config.json');
        }catch(e){
            console.log(e);
            process.exit(1);
        }
        const MockHandler=require('./mockHandler');
        const MockManager=require('./mockManager');
        this.mockHandler=new MockHandler(config.handler.host,config.handler.port);
        this.mockManager=new MockManager(config.manager.host,config.manager.port);
        Promise.all([
            this.mockHandler.start(),
            this.mockManager.start()
        ]).then(([handlerInfo,managerInfo])=>{
            console.log(`Handler Service started at port ${handlerInfo.port}.`);
            console.log(`Manager Service started at port ${managerInfo.port}.`);
        });
    }
    close(){
        this.mockHandler.close();
        this.mockManager.close();
    }
}
