function start(){
    return new (require('./src/index'))();
}
let app=start();
try{
    const path=require('path');
    const watch = require('node-watch');
    if(watch){
        watch('./src', {
            recursive: true
        }, function(event, fileName) {
            //跳过不在当前目录中的文件，非JS文件
            if('update'!=event){
                return;
            }
    
            //清空require.cache
            for(const item of Object.keys(require.cache)){
                delete require.cache[item];
            }

            //重启应用
            console.log('Restarting server');
            app.close();
            app=start();
        });
    }
}catch(e){
    console.error('Failed to load module node-watch, changes of JS files won\'t take effect by realtime.');
}
