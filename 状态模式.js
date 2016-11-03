

//状态模式  例如一个开关，弱光状态-强光状态-关灯-弱光状态-，，，，，

//灯光状态的父类，预防状态类忘记了实现buttonWasPressed方法
var State = function () { };
State.prototype.buttonWasPressed = function () {
    throw new Error('父类的buttonWasPressed方法必须重写');
}

//弱光状态类
var OffLinghtState = function (linght) {
    this.linght = linght;//保存灯光类的引用
}
OffLinghtState.prototype = new State();
OffLinghtState.constructor = OffLinghtState;

OffLinghtState.prototype.buttonWasPressed = function () {
    console.log('灯光是弱光');
    this.linght.setState(this.linght.weakLinghtState)//设置灯光状态
}

//强光状态类
var WeakLinghtState = function (linght) {
    this.linght = linght;//保存灯光类的引用
}
WeakLinghtState.prototype = new State();
WeakLinghtState.constructor = WeakLinghtState;
WeakLinghtState.prototype.buttonWasPressed = function () {
    console.log('灯光是强。。。。光');
    this.linght.setState(this.linght.strongLinghtState)//设置灯光状态
}

//关灯状态类
var StrongLinghtState = function (linght) {
    this.linght = linght;//保存灯光类的引用
}
StrongLinghtState.prototype = new State();
StrongLinghtState.constructor = StrongLinghtState;
StrongLinghtState.prototype.buttonWasPressed = function () {
    console.log('关灯了');
    this.linght.setState(this.linght.offLinghtState)//设置灯光状态
}

//灯光类
var Linght = function () {
    this.offLinghtState = new OffLinghtState(this);  //保存状态类的引用
    this.weakLinghtState = new WeakLinghtState(this);
    this.strongLinghtState = new StrongLinghtState(this);
}
Linght.prototype.init = function () {
    var button = document.createElement('button');
    button.innerHTML = '切换开关';
    document.body.appendChild(button);
    var _self = this;
    button.onclick = function () {
        _self.state.buttonWasPressed();//执行当前状态的行为方法
    }
    this.state = this.offLinghtState;//设置开始的状态
}
Linght.prototype.setState = function (newSatae) {
    this.state = newSatae;//设置下一个状态
}
var linght = new Linght();
linght.init()

//状态模式  例如一个javascript版本的状态机，
//用上面电灯的例子，来展示更轻巧方法
var Light = function (state) {
    this.currState = state.offState;
}
Light.prototype.init = function () {
    var button = document.createElement('button');
    button.innerHTML = '切换开关';
    document.body.appendChild(button);
    var self = this;

    button.onclick = function () {
        self.currState(self);
    }
}

var states = {
    offState: function (self) {
        console.log('开灯');
        self.currState = states.HardLightState;
    },
    HardLightState: function (self) {
        console.log('强光灯');
        self.currState = states.onState;
    },
    onState: function (self) {
        console.log('关灯？？？？？');
        self.currState = states.offState;
    }
}
var light = new Light(states);
light.init();




//状态模式  例如一个文件上传，
//上传插件的对象
var plugin = (function () {
    var plugin = document.createElement('embed');
    plugin.style.display = 'none';

    plugin.type = 'application/txftn-webkit';

    plugin.sign = function () {
        console.log('扫描文件。。。');
    }

    plugin.pause = function () {
        console.log('暂时文件上传');
    }

    plugin.uploading = function () {
        console.log('开始文件上传。。。');
    }

    plugin.del = function () {
        console.log('删除文件上传');
    }

    plugin.done = function () {
        console.log('文件上传完成');
    }

    document.body.appendChild(plugin);

    return plugin;
})();


var Upload = function (fileName) {
    this.plugin = plugin;//引用上传插件对象
    this.fileName = fileName;//上传文件名称
    this.button1 = null;
    this.button2 = null;
    //引用状态子类
    this.signState = new SignState(this);
    this.uploadingState = new UploadingState(this);
    this.pauseState = new PauseState(this);
    this.doneState = new DoneState(this);
    this.errorState = new ErrorState(this);

    //上传状态默认设置为某个状态子类
    this.currState = this.signState;//设置初始状态为
};

Upload.prototype.init = function () {
    var _this = this;

    this.dom = document.createElement('div');
    this.dom.innerHTML = '<span>文件名称：' + this.fileName + '</span><button data-action="button1">扫描中</button><button data-action="button2">删除</button>';

    document.body.appendChild(this.dom);

    this.button1 = this.dom.querySelector('[data-action="button1"]');
    this.button2 = this.dom.querySelector('[data-action="button2"]');

    this.bindEvent();
}

Upload.prototype.bindEvent = function () {
    var self = this;

    this.button1.onclick = function () {
        self.currState.clickHandler1();//每种状态子类对应clickHandler1()方法
    }
    this.button2.onclick = function () {
        self.currState.clickHandler2();//每种状态子类对应clickHandler2()方法
    }
};

Upload.prototype.sign = function () {//文件扫描
    this.plugin.sign(); //调用上传对象对应扫描方法
    this.currState = this.signState;//扫描状态
}

Upload.prototype.uploading = function () {
    this.button1.innerHTML = '正在上传，点击暂停';
    this.plugin.uploading();//调用上传对象对应上传方法
    this.currState = this.uploadingState;//正在上传状态
}

Upload.prototype.pause = function () {
    this.button2.innerHTML = '已暂停，点击继续上传';
    this.plugin.pause();//调用上传对象对应暂停方法
    this.currState = this.pauseState;//暂停状态
}

Upload.prototype.done = function () {
    this.button1.innerHTML = '上传完成';
    this.plugin.done();//调用上传对象对应完成方法
    this.currState = this.doneState;//上传完成状态
}

Upload.prototype.error = function () {
    this.button1.innerHTML = '上传失败';
    this.currState = this.errorState;//上传失败状态
}

Upload.prototype.del = function () {
    this.plugin.del(); //调用上传对象对应删除方法
    this.dom.parentNode.removeChild(this.dom);
}

var StateFactory = (function () {
    //给状态子类没有实现clickHandler1 clickHandler2这两个方法的一个报错提醒
    var State = function () { };
    State.prototype.clickHandler1 = function () {
        throw new Error('子类必须重写父类的clickHandler1方法');
    }
    State.prototype.clickHandler2 = function () {
        throw new Error('子类必须重写父类的clickHandler2方法');
    }

    return function (param) {
        var F = function (uploadObj) {
            this.uploadObj = uploadObj;
        };

        F.prototype = new State();

        for (var i in param) {
            F.prototype[i] = param[i];
        }

        return F;
    }
})();

//设置状态子类，每个状态子类有两个原型方法，clickHandler1， clickHandler2
//扫描状态，
var SignState = StateFactory({
    clickHandler1: function () {
        console.log('扫描中点击无效。。。');
    },
    clickHandler2: function () {
        console.log('文件上传中，不能删除');
    },
})

//正在上传状态
var UploadingState = StateFactory({
    clickHandler1: function () {
        this.uploadObj.pause();
    },
    clickHandler2: function () {
        console.log('文件上传中，不能删除');
    },
})
//暂停状态
var PauseState = StateFactory({
    clickHandler1: function () {
        this.uploadObj.uploading();
    },
    clickHandler2: function () {
        this.uploadObj.del();
    },
})
//上传完成状态
var DoneState = StateFactory({
    clickHandler1: function () {
        console.log('文件上传完成，点击无效');
    },
    clickHandler2: function () {
        this.uploadObj.del();
    },
});
//上传失败状态
var ErrorState = StateFactory({
    clickHandler1: function () {
        console.log('文件上传失败，点击无效');
    },
    clickHandler2: function () {
        this.uploadObj.del();
    },
});

//上传对象
var uploadObj = new Upload('javascript 设计模式与开发实践');
uploadObj.init();

//上传是一个异步的，所以控件会不停的调用javascript提供的一个全局函数window.external.upload 来通知javascript 上传进度，控件会把当前的文件状态作为参数state塞进window.external.upload,这里没用提供一个插件上传，用setTimeout来模拟
window.external.upload = function (state) {
    uploadObj[state]();
}

window.external.upload('sign');//假如上传控件返回的是扫描状态

setTimeout(function () {
    window.external.upload('uploading');//假如上传控件返回的是上传状态
}, 5000)

setTimeout(function () {
    window.external.upload('done');//假如上传控件返回的是上传完成状态
}, 9000)





