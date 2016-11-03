

//享元模式 是一种性能优化模式，例如创建大多类似的对象导致内存占用过高，假如一个内衣工厂生产男女各50套内衣，需要生产男女模特给这些内衣拍照，如果按普通模式就是生产男女各50个模特对象，用享元模式就是生产2 个模特对象就可以了
//享元模式要求将对象划分为，内部状态和外部状态，状态就是指属性
//内部状态是存放于对象内部一部不会改变，外部状态具体会根据场景会变化

var Model = function (sex) {
    this.sex = sex;//性别  在享元模式中属于内部状态
}
Model.prototype.takePhoto = function () {
    console.log('性别： ' + this.sex + ",  款式： " + this.underwear);
}
//生产男女模特对象
var maleModel = new Model('男'),
    femaleModel = new Model('女');
//男模特拍照
for (var i = 1; i <= 50; i++) {
    maleModel.underwear = '男新款' + i;//在享元模式中属于外部状态
    maleModel.takePhoto();
}
//女模特拍照
for (var i = 1; i <= 50; i++) {
    femaleModel.underwear = '女新款' + i;//在享元模式中属于外部状态
    femaleModel.takePhoto();
};



//享元模式,重构上传文件
var Upload = function (uploadType) {//把Upload的初化工作放到外部管理器中也就是 uploadManager
    this.uploadType = uploadType;
}
Upload.prototype.delFile = function (id) {//删除
    uploadManager.setExternalState(id, this);//设置外部状态，也就是设置Upload的外部属性
    if (this.fileSize < 3000) {  //设置好Upload的外部属性就可以比较，文件小于3000直接删除文件
        return this.dom.parentNode.removeChild(this.dom);
    }
    if (window.confirm('确定要删除该文件吗 ? ' + this.fileName)) {//文件大于3000确认是否删除文件
        return this.dom.parentNode.removeChild(this.dom);
    }
}

//工厂进行实例化对象，相同的对象只创建一个
var UploadFactory = (function () {
    var createdFlyWeightObjs = {};
    return function (uploadType) {
        if (createdFlyWeightObjs[uploadType]) {
            return createdFlyWeightObjs[uploadType];
        }
        return createdFlyWeightObjs[uploadType] = new Upload(uploadType);
    }
})();

//创建一个管理器，管理外部状态
var uploadManager = (function () {
    var uploadDatabase = {};//存放上文件数据
    return {
        add: function (id, uploadType, fileName, fileSize) {
            var flyWeightObj = UploadFactory(uploadType);//相同对象只创建一个

            var div = document.createElement('div');
            div.innerHTML = '<span>文件名称： ' + fileName + ', 文件大小： ' + fileSize + '</span>' + '<button class="delFile">删除</button>';
            div.querySelector('.delFile').onclick = function () {//绑定删除按钮事件
                flyWeightObj.delFile(id);
            }
            document.body.appendChild(div);//显示上传文件数据

            uploadDatabase[id] = {//添加上传文件数据
                fileName: fileName,
                fileSize: fileSize,
                dom: div,
            };
            return flyWeightObj;//返回上传对象
        },
        setExternalState: function (id, flyWeightObj) { //给对象设置外部属性
            var uploadData = uploadDatabase[id];
            for (var i in uploadData) {
                flyWeightObj[i] = uploadData[i];
            }
        }

    }
})();

//开始触发上传
var id = 0;
window.startUpload = function (uploadType, files) {

    for (var i = 0, k = files.length; i < k; i++) {
        var uploadObj = uploadManager.add(id++, uploadType, files[i].fileName, files[i].fileSize);
    }
}
//插件上传
startUpload('plugin', [{ fileName: '1.txt', fileSize: 1000 },
    { fileName: '2.txt', fileSize: 2000 }, { fileName: '3.txt', fileSize: 5000 }]);
//flash上传
startUpload('flash', [{ fileName: '1.txt', fileSize: 1000 },
    { fileName: '2.txt', fileSize: 3000 }, { fileName: '3.txt', fileSize: 999 }]);





//对象池,如果经常创建DOM和删除DOM，就可以用对象池的技术,把要删除的东西放入对象池里，方便下次使用
var toolTipFactory = (function () {
    var toolTipPool = [];//对象池，
    return {
        create: function () {
            if (toolTipPool.length === 0) {//如果对象池是空的，就重新创建一个div
                var div = document.createElement('div'); alert(9);
                document.body.appendChild(div);
                return div;
            };
            return toolTipPool.shift();//如果对象池不是空的，就取出一个div
        },
        recover: function (dom) {
            toolTipPool.push(dom);//把要删除的div放入对象池
        }
    }
})();
for (var i = 0, str; str = ['a', 'b'][i++];) {
    var div = toolTipFactory.create();//首先从对象池中拿出2个DIV
    div.innerHTML = str;
}
document.body.addEventListener('click', function (e) {
    if (e.target.nodeName === 'DIV') {              //如果点击是DIV
        toolTipFactory.recover(e.target);           //那么把这个div放入对象池里
        e.target.parentElement.removeChild(e.target)//然后删除这个div
    }
}, false);
var a = 0;
document.getElementById('btn').onclick = function () {
    var div = toolTipFactory.create();//点击按钮，又从对象池里取出DIV
    if (div.innerText == "") {
        div.innerText = a++;
    }
    document.body.appendChild(div);
}


//通用的对象池实现
var objectPoolFactory = function (createFn) {
    var objectPool = [];
    return {
        create: function () {
            if (objectPool.length === 0) {
                return createFn.apply(window, arguments);
            }
            return objectPool.shift();
        },
        recover: function (obj) {
            objectPool.push(obj);
        }
    }
}









