       

//图片预加载函数
var MyImage = (function () {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    var imgse = new Image();
    imgse.onload = function () {
        imgNode.src = this.src;
    }
    return {
        setSrc: function (src) {
            imgNode.src = 'http://.........';//占位图片地址
            image.src = src;
        }
    }
})();
MyImage.setSrc("http://.....");//实际图片地址


//用代理实现的图片预加载
//创建图片函数
var myImg = (function () {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    return {
        setSrc: function (src) {
            imgNode.src = src;
        }
    }
})();
//代理图片预加载函数
var proxyImage = (function () {
    var img = new Image();
    img.onload = function () {
        myImg.setSrc(this.src);
    }
    return {
        setSrc: function (src) {
            myImg.setSrc("http:........");
            img.src = src;
        }
    }
})();
proxyImage.setSrc("http:...........");

//。。。。。。。。。。。。。。。。。。。。。。。
//虚拟代理，如果该函数被频繁调用，或频繁的网络请求
var synchromousFile = function (idArry) {//如果该函数被频繁调用，或频繁的网络请求，可以用下面的代理收集数据，每2秒执行一次
    console.log(idArry);
}
var proxySynchronousFile = (function () {
    var cache = [],
        setIn;
    return function (id) {
        cache.push(id);
        if (setIn) {
            return;
        };
        setIn = setTimeout(function () {
            synchromousFile(cache);
            clearTimeout(setIn);
            setIn = null;
            cache.length = 0;
        }, 2000);
    };
})();

//。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
//虚拟代理的log函数实现
//miniConsole对象代理另一个脚本的miniConsole对象收集数据，当按下键盘16值的shift键时加载另一个脚本的miniConsole对象覆盖代理对象
var miniConsole = (function () {
    var cache = [];

    var hendler = function (e) {

        if (e.keyCode === 16) {
            //创建一个脚本
            var script = document.createElement('script');
            script.innerHTML = " var miniConsole = {  log: function () { console.log([].join.call(arguments)); } }"
            //script.onload=function(){............}如果脚本是引用外部地址
            document.getElementsByTagName('head')[0].appendChild(script);
            //移除键盘事件
            document.body.removeEventListener('keydown', hendler, false);

            //执行代理保存下的函数
            for (var i = 0, fn; fn = cache[i++];) {
                fn();
            };
        }
    };
    //监听键盘事件
    document.body.addEventListener('keydown', hendler, false);
    //返回代理对象
    return {
        log: function () {
            var arg = arguments;
            cache.push(function () {
                return miniConsole.log.apply(miniConsole, arg);
            })
        },
    }
})();
//保存代理对象数据
miniConsole.log(1);
miniConsole.log(2);
miniConsole.log(3);
miniConsole.log(4);
    

//。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
//缓存代理
//该函数只负责计算乘积
var mult = function () {
    var mults = 1;
    //for (var i = 0, number; number = arr[i++];) {//这里写法要注意arr[i++]的值为0,null,undefined就会终止循环
    //    mults = mults * number;
    //}
    for (var i = 0, j = arguments.length; i < j; i++) {
        mults = mults * arguments[i];
    }
    return mults;
}
//缓存代理工厂是用于，可以代理乘法，加法，。。。等等，缓存之前执行过的值
var ProxyFactory = function (fn) {
    var cache = {};
    return function () {
        var args = [].join.call(arguments);
        if (args in cache) {
            return cache[args];
        }
        return cache[args] = fn.apply(this, arguments);
    }
};
multFn= proxyMult(mult);
console.log(multFn(1, 2, 3, 8));
console.log(multFn(1, 2, 3, 6));











