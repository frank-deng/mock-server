function start(){
    const Server=require('./server/index');
    return new Server();
}
let app=start();
try{
    const watch = require('node-watch');
    if(watch){
        watch('./server', {
            recursive: true
        }, function(event, fileName) {
            //跳过不在当前目录中的文件，非JS文件
            if('update'!=event){
                return;
            }
            //重启应用
            console.log('Closing server');
            try{
                app.close();
            }catch(e){
                console.error(e);
            }
    
            //清空require.cache
            for(const item of Object.keys(require.cache)){
                delete require.cache[item];
            }

            //重启应用
            process.nextTick(()=>{
                console.log('Starting server');
                try{
                    app=start();
                }catch(e){
                    console.error(e);
                }
            });
        });
    }
}catch(e){
    console.error('Failed to load module node-watch, changes of JS files won\'t take effect by realtime.');
}
