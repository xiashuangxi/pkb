window.onload = function() {
    
AV.init({
    appId: "APkyofPK2ac4AHxpfEyLg0ps-gzGzoHsz",
    appKey: "4mOaFRdFn3BH61vUJBaMvSSb",
    serverURL: "https://apkyofpk.lc-cn-n1-shared.com"
  });

}
var unsubscribe_to_network = function(email) {
    console.log("[INFO] 取消订阅");
    var query = new AV.Query('UserEmail');
    var exists = false;
    query.find().then(function (ues) {
        console.log("[INFO] 查询所有，"+ email + "是否有数据？");
        if (ues.length > 0){
            console.log("[INFO] 有数据");
            for(var i = 0; i < ues.length; i++ ){
                var obj = ues[i];
                console.log("[INFO] "+ obj.attributes.email + "=" + email);
                if(obj.attributes.email == email.trim()){
                    exists=true;
                    var uo = AV.Object.createWithoutData('UserEmail', obj.id);
                    console.log("[INFO] "+email+" enable修改为"+ obj.enable, obj.id);
                    uo.set('enable', 0);
                    uo.save();
                    alert("✅ 取消订阅成功")
                    break;
                }
            }

            if(exists==false){
                alert("🔴 您没有订阅过我们的文章")     
            }
        } else {
           alert("✅ 取消订阅成功")
        }
    }).catch(function(error) {
    
    });
}


var subscribe_to_network = function(email) {
    console.log("[INFO] 提交网络: "+ email);

    var exists = false;

    var query = new AV.Query('UserEmail');
    query.find().then(function (ues) {
        console.log("[INFO] 查询所有，"+ email + "是否有数据？");
        if (ues.length > 0){
            console.log("[INFO] 有数据");
            for(var i = 0; i < ues.length; i++ ){
                var obj = ues[i];
                console.log("[INFO] "+ obj.attributes.email + "=" + email);
                if(obj.attributes.email == email.trim()){
                    exists = true;
                     var uo = AV.Object.createWithoutData('UserEmail', obj.id);
                    var enable = obj.attributes.enable;
                    if (enable == 0) {
                        enable = 1
                    } else {
                        alert("⚠ 您已经订阅过了")
                        return;
                    }
                    console.log("[INFO] "+email+" enable修改为"+ obj.enable, obj.id);
                    uo.set('enable', enable);
                    uo.save();
                    alert("✅ 订阅成功")
                    break;
                }
            }
            console.log("[INFO] "+email+" 存在吗"+ exists);
            if (exists == false) {
                var UserEmail = AV.Object.extend('UserEmail');
                var userEmail = new UserEmail();

                // 为属性赋值
                userEmail.set('email',   email);
                userEmail.set('enable', 1);

                // 将对象保存到云端
                userEmail.save().then(function (todo) {
                // 成功保存之后，执行其他逻辑
                console.log('保存成功。objectId：' + todo.id);
                alert("✅ 订阅成功")
                }, function (error) {
                // 异常处理
                });
            }
        } else {
            var UserEmail = AV.Object.extend('UserEmail');
            var userEmail = new UserEmail();

            // 为属性赋值
            userEmail.set('email',   email);
            userEmail.set('enable', 1);

            // 将对象保存到云端
            userEmail.save().then(function (todo) {
              // 成功保存之后，执行其他逻辑
              console.log('保存成功。objectId：' + todo.id);
              alert("✅ 订阅成功")
            }, function (error) {
              // 异常处理
            });
        }
    }).catch(function(error) {
    
    });
}