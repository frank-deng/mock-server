let config={};
try{
    config=require('./config.json');
}catch(e){
    console.log(e);
    process.exit(1);
}

const MockHandler=require('./mockHandler');
const MockManager=require('./mockManager');
async function main(){
    const mockHandler=new MockHandler(config.handler.host,config.handler.port);
    const mockManager=new MockManager(config.manager.host,config.manager.port);
    let [handlerInfo, managerInfo]=await Promise.all([
        mockHandler.start(),
        mockManager.start()
    ]);
    console.log(`Handler Service started at port ${handlerInfo.port}.`);
    console.log(`Manager Service started at port ${managerInfo.port}.`);
}
main();
