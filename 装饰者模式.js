
//装饰者模式就是动态地给一个对象添加职责
Function.prototype.before = function (beforefn) {
    var _self = this;
    return function () {//返回新函数和原函数的代理
        beforefn.apply(this, arguments);   //先执行新函数 注意点，如果arguments里面的参数是带有引用类型的，在这个新函数修改了这个引用类型，那么这个引用类型，在下一个原函数执行时也会被修改了
        return _self.apply(this, arguments);//再执行原函数，注意arguments有没有被新函数修改过
    }
}

Function.prototype.after = function (afterfn) {
    var _self = this;
    return function () {//返回新函数和原函数的代理
        var ret = _self.apply(this, arguments);//先执行原函数
        afterfn.apply(this, arguments);        //再执行新函数 注意arguments有没有被新函数修改过
        return ret;
    }
}
//用法
window.onload = function () {
    console.log(1);
}
window.onload = (window.onload || function () { }).after(function () { console.log(2) }).after(function () { console.log(3) });//当文档加载完成后输入1， 2， 3

//这上例子是在新函数里修改了arguments，那么后面执行的arguments也发生了改变
var func = function (a, b) {
    console.log(a, b)//输出4，｛a:2,cc:99｝
}
func = func.before(function (a, b) {
    console.log(a, b);//输出4，｛a:2｝
    a = 555;
    b.cc = 99;//添加一个属性


})
func(4, { a: 2 });




//不污染原型的写法
var before = function (fn, beforefn) {
    return function () {
        fn.apply(this, arguments);           //具体哪个新函数哪个是原函数，要看传过来的参数
        return beforefn.apply(this, arguments);
    }
}
var after = function (fn, afterfn) {//其实这个方法是多余的，因为原函数和新函数，还没有真正的确定
    return function () {
        var ret = afterfn.apply(this, arguments); //具体哪个新函数哪个是原函数，要看传过来的参数
        fn.apply(this, arguments);
        return ret;
    }
}

//用法
var a = before(function () { console.log(3) }, function () { console.log(4) });
a = before(function () { console.log(2) }, a);
a = before(function () { console.log(1) }, a);
a();//输出1，2，3，4


//应用场景
Function.prototype.before2 = function (beforefn) {
    var _self = this;
    return function () {
        if (before.apply(this, arguments) === false) {
            return;
        }
        return _self.apply(this, arguments);
    }
}

var validataa = function () {
    if ('用户名' == "") {
        alert('用户名不能为空');
        return false;
    }
    if ('密码' == "") {
        alert('密码不能为空');
        return false;
    }
    return true;
}
var fomSubmit = function () {
    var param = {
        username: '用户名',
        password: '密码'
    }
    ajax("", param);
}
fomSubmit = fomSubmit.before2(validataa);
"".onclick = function () { fomSubmit(); };







//传统面向对象语言的装饰者模式
var Plane = function () { }
Plane.prototype.fire = function () {
    console.log('发射普通子弹');
}

var MissileDecorator = function (obj) {
    this.plane = obj;//保存一个对象引用
}
MissileDecorator.prototype.fire = function () {
    this.plane.fire();//执行一个对象的方法
    console.log('发射导弹');
}

var AtomDecorator = function (obj) {
    this.plane = obj;//保存一个对象引用
}
AtomDecorator.prototype.fire = function () {
    this.plane.fire();  //执行一个对象的方法
    console.log('发射原子弹');
}

var plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);

plane.fire();


//javascript的装饰者
var plane2 = {
    fire: function () {
        console.log('发射普通子弹........');
    }
}

var miss = function () {
    console.log('发射导弹..........');
}

var atom = function () {
    console.log('发射原子弹.........');
}

var fire1 = plane2.fire;//保存原函数引用
plane2.fire = function () {
    fire1();//执行原函数
    miss();
}

var fire2 = plane2.fire;//保存原函数引用
plane2.fire = function () {
    fire2();//执行原函数
    atom();
}

plane2.fire();















